// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LoanToken is ERC20, Ownable, Pausable {

    constructor(address ownerAddress, uint256 initialSupply) ERC20("NFTCredToken", "NCT") Ownable(ownerAddress)
    {
        _mint(ownerAddress, initialSupply);
    }

    function mint(address to, uint256 amount) public onlyOwner
    {
        _mint(to, amount);
    }


    /* ADMIN FUNCTIONS */

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    
}