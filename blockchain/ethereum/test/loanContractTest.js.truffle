const truffleAssert = require('truffle-assertions');

const LoanContractArtifact = artifacts.require("LoanContract");
const LoanTokenArtifact  = artifacts.require("LoanToken");
const CollateralTokenArtifact  = artifacts.require("CollateralToken");

function printVar(name, value) {
  console.log(`         ${name}: ${value}`);
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

contract("LoanContract", (accounts) => {

  let loanContract;
  let loanTokenContract;
  let collateralTokenContract;
  let nftId = "";
  let loanId = "";
  let contractOwnerBalance;
  let userBalance;

  const mintLoanTokenAmount = '1000000000';
  const fee = '10000'; // in wei
  const timeout = '2592000'; // in seconds
  const amount = web3.utils.toBN('10000'); // in Loan Tokens (here we are simulating a NFTCred specific token)
  const interestRate = '4'; // e.g. 4% of amount
  const interest = amount.mul(web3.utils.toBN(interestRate)).div(web3.utils.toBN('100')); // value to charge as an interest rate (in Loan Token)

  before(async () => {
    collateralTokenContract = await CollateralTokenArtifact.deployed();
    loanContract = await LoanContractArtifact.deployed();
    loanTokenContract = await LoanTokenArtifact.deployed();

    await loanContract.disburseLoanToken(accounts[1], mintLoanTokenAmount, { from: accounts[0] });

    let tx = await collateralTokenContract.mintNFT(accounts[1], 'empty', { from: accounts[0] })
    truffleAssert.eventEmitted(tx, 'Mint', (ev) => {
      nftId = ev.tokenId;
      return true;
    });
    contractOwnerBalance = await web3.eth.getBalance(accounts[0]);
    userBalance = await web3.eth.getBalance(accounts[1]);

    console.log(`    .  Contract Wallet: ${accounts[0]} (Balance: ${contractOwnerBalance})`);
    console.log(`    .  User Wallet: ${accounts[1]} (Balance: ${userBalance})`);
    console.log("");
  });

  describe("Loan tests with collateral NFT", async () => {

    it (`Should allow borrowing Loan Token (e.g. ${amount}), paying a fee (e.g. ${fee} wei), with interest rate (e.g. ${interestRate}%), timeout (e.g. ${timeout} seconds) and collaterate a NFT token`, async () => {
      contractOwnerBalance = await web3.eth.getBalance(accounts[0]);
      userBalance = await web3.eth.getBalance(accounts[1]);

      await collateralTokenContract.approve(loanContract.address, nftId, {from: accounts[1]});
      let tx = await loanContract.addLoan(collateralTokenContract.address, nftId, amount, fee, interest, timeout, {from: accounts[1], value: fee});
      truffleAssert.eventEmitted(tx, 'LoanCreated', (ev) => {
        loanId = ev.loanId;
        return true;
      });

      const tokenOwner = await collateralTokenContract.ownerOf(nftId);
      assert.equal(loanContract.address, tokenOwner, `The expected owner of the token is ${loanContract.address}, but it is ${tokenOwner}.`);
      
      let contractBalanceExpected = web3.utils.toBN(contractOwnerBalance).add(web3.utils.toBN(fee));
      contractOwnerBalance = await web3.eth.getBalance(accounts[0]);

      assert.equal(contractOwnerBalance, contractBalanceExpected, `The expected balance for the loan contract is ${contractBalanceExpected}, but it is ${contractOwnerBalance}`);
    });

    it(`Should return a correct loan given its id`, async () => {
      tx = await loanContract.getLoanById(loanId, {from: accounts[1]});
      assert.equal(tx['borrowerAddress'], accounts[1], `borrowerAddress not expected`);
      assert.equal(tx['collateralContractAddress'], collateralTokenContract.address, `collateralContractAddress not expected}`);
      assert.equal(tx['collateralTokenId'], nftId, `collateralTokenId not expected}`);
      assert.equal(tx['amount'], amount.toString(), `amount not expected}`);
      assert.equal(tx['interest'], interest, `interest not expected}`);
      assert.equal(tx['loanId'], loanId, `loanId not expected}`);
    });

    it (`Should pay a loan by id, in this case using previous tested loan with id ${loanId}`, async () => {

      let initialOwner = await collateralTokenContract.ownerOf(nftId);
      assert.equal(initialOwner, loanContract.address, "The LoanContract should hold the NFT initially");

      // const contractLoanTokenCurrentBalance = await loanTokenContract.balanceOf(loanContract.address);

      const amountToRepay = amount.add(interest);
      await loanTokenContract.approve(loanContract.address, amountToRepay, { from: accounts[1] });
      let tx = await loanContract.payLoan(loanId, {from: accounts[1]});
      truffleAssert.eventEmitted(tx, 'LoanPaid', (ev) => {
        loanId = ev.loanId;
        return true;
      });

      tx = await loanContract.getLoanById(loanId, {from: accounts[1]});
      assert.notEqual(tx['isPaid'], 'true', `${loanId} is expected to be marked as paid`);

      let finalOwner = await collateralTokenContract.ownerOf(nftId);
      assert.equal(finalOwner, accounts[1], "The collateral NFT should be returned to the borrower");

      // const contractLoanTokenNewBalance = await loanTokenContract.balanceOf(loanContract.address);
      // console.log(`Old: ${contractLoanTokenCurrentBalance}`);
      // console.log(`New: ${contractLoanTokenNewBalance}`);
      // assert.equal(contractLoanTokenNewBalance, contractLoanTokenCurrentBalance.add(amountToRepay), "Balance of the loan contract not expected");
 
    });

  });

});
