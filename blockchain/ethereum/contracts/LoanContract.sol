// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "./ILoanToken.sol";
import "./libs/HitchensUnorderedKeySet.sol";

contract LoanContract is IERC721Receiver, Ownable, Pausable, ReentrancyGuard {

    ILoanToken public loanTokenContract;

    struct Loan {
        address borrowerAddress;
        address collateralContractAddress;
        uint256 collateralTokenId;
        uint256 amount;
        uint256 fee;
        uint256 interest;
        uint256 timeout;
        bytes32 loanId;
        bool isPaid;
        bool _used;
    }

    using HitchensUnorderedKeySetLib for HitchensUnorderedKeySetLib.Set;
    struct LoansSet {
        HitchensUnorderedKeySetLib.Set loansPointers;
        bool _used;
    }

    mapping(address => LoansSet) private _loansMap; // map a pointer to all loans of a wallet
    mapping(bytes32 => Loan) private _loans; // stores all loan in this contract

    constructor(address ownerAddress) Ownable(ownerAddress) { }

    // Create a new loan with an NFT as collateral
    function addLoan(address _collateralContractAddress,
                     uint256 _collateralTokenId,
                     uint256 _amount,
                     uint256 _fee,
                     uint256 _interest,
                     uint256 _timeout) public payable whenNotPaused nonReentrant
    {
        require(_amount > 0, "Error 26");
        _chargeFee(_fee);

        IERC721 collateralContract = IERC721(_collateralContractAddress);
        require(collateralContract.getApproved(_collateralTokenId) == address(this), 'Error 10');
        
        // Transfer NFT to this contract to hold as collateral
        collateralContract.safeTransferFrom(msg.sender, address(this), _collateralTokenId);

        // Prepare borrower loans set
        LoansSet storage loansSet = _loansMap[msg.sender];
        if (!loansSet._used) {
            loansSet._used = true;
        }

        // Generate a unique id for this loan and store a pointer in the borrower loans set
        bytes32 loanId = _generateLoanId(msg.sender, _collateralContractAddress, _collateralTokenId);
        loansSet.loansPointers.insert(loanId);

        Loan storage loan = _loans[loanId];
        loan.loanId = loanId;
        loan.borrowerAddress = payable(msg.sender);
        loan.collateralContractAddress = _collateralContractAddress;
        loan.collateralTokenId = _collateralTokenId;
        loan.amount = _amount;
        loan.fee = _fee;
        loan.interest = _interest;
        loan.timeout = block.timestamp + _timeout;
        loan.isPaid = false;
        loan._used = true;

        _loans[loanId] = loan;

        require(loanTokenContract.balanceOf(address(this)) >= _amount, "Error 25");
        loanTokenContract.transfer(msg.sender, _amount);

        emit LoanCreated(loanId, msg.sender, _amount, _fee);
    }

    // Repay the loan and return the NFT collateral
    function payLoan(bytes32 _loanId)
        public
        whenNotPaused
        nonReentrant
        onlyNotPaidLoan(_loanId)
        onlyNotExpiredLoan(_loanId)
    {
        Loan storage loan = _getLoanById(_loanId);
        
        require(msg.sender == loan.borrowerAddress, "Error 20");
        uint256 repaymentAmount = loan.amount + loan.interest;
        require(loanTokenContract.transferFrom(msg.sender, address(this), repaymentAmount), 'Error 22');
        loan.isPaid = true;

        // Return the NFT collateral to the borrower address
        IERC721 collateralContract = IERC721(loan.collateralContractAddress);
        collateralContract.safeTransferFrom(address(this), loan.borrowerAddress, loan.collateralTokenId);
        
        emit LoanPaid(_loanId);
    }

    function listLoans(bool isPaid) public view returns (Loan[] memory) {
        Loan[] memory response = new Loan[](0);

        if (_loansMap[msg.sender]._used) {
            HitchensUnorderedKeySetLib.Set storage set = _getLoansSet();
            uint listOfKeysLength = set.count();

            uint responseSize = 0;
            uint responseIndex = 0;

            for (uint i = 0; i < listOfKeysLength; i++) {
                Loan storage loan = _loans[set.keyAtIndex(i)];
                if (loan.isPaid == isPaid) {
                   responseSize++;
                }
            }

            response = new Loan[](responseSize);

            for (uint i = 0; i < listOfKeysLength; i++) {
                Loan storage loan = _loans[set.keyAtIndex(i)];
                if (loan.isPaid == isPaid) {
                    response[responseIndex] = loan;
                    responseIndex++;
                }
            }
        }

        return response;
    }

    function getLoanById(bytes32 loanId) public view returns (Loan memory) {
        return _getLoanById(loanId);
    }

    function setLoanTokenAddress(address _loanTokenAddress) public onlyOwner
    {
        loanTokenContract = ILoanToken(_loanTokenAddress);
    }

    function disburseLoanToken(address to, uint256 amount) public onlyOwner
    {
        require(loanTokenContract.transfer(to, amount), "Error 27");
    }

    /* PRIVATE FUNCTIONS */

    function _withdraw(address payable recipient, uint256 amount) private
    {
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Error 22");
    }

    function _chargeFee(uint256 fee) internal
    {
        require(msg.value >= fee, 'Error 10');
        _withdraw(payable(owner()), fee);
    }

    function _generateLoanId(address _borrowerAddress,
                            address _nftContractAddress,
                            uint256 _nftTokenId) internal view returns (bytes32)
    {
        return keccak256(abi.encode(_borrowerAddress,
                                    _nftContractAddress,
                                    _nftTokenId,
                                    block.timestamp));
    }

    function _getLoanById(bytes32 _loanId) internal view returns (Loan storage)
    {
        require(_loans[_loanId]._used, "Error 28");
        return _loans[_loanId];
    }

    function _getLoansSet() internal view returns (HitchensUnorderedKeySetLib.Set storage)
    {
        return _loansMap[msg.sender].loansPointers;
    }


    /* ADMIN FUNCTIONS */

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }


    /* MODIFIERS */

    modifier onlyNotPaidLoan(bytes32 loanId)
    {
        Loan storage loan = _getLoanById(loanId);
        require(loan.isPaid == false, 'Error 2');
        _;
    }

    modifier onlyNotExpiredLoan(bytes32 loanId)
    {
        Loan storage loan = _getLoanById(loanId);
        require(block.timestamp < loan.timeout, 'Error 3');
        _;
    }

    
    /* EVENTS */
    event LoanCreated(bytes32 loanId, address borrowerAddress, uint256 amount, uint256 fee);
    event LoanPaid(bytes32 loanId);

    /* Overrides onERC721Received of the IERC721Receiver contract. */
    function onERC721Received (
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data) pure external returns (bytes4)
    {
        // just to remove the compile warning of variables not being used.
        operator;
        from;
        tokenId;
        data;
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }
}
