const { expect } = require("chai");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { ethers } = require("hardhat");


function printVar(name, value) {
  console.log(`         ${name}: ${value}`);
}

async function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe("LoanContract", function () {
  let loanContract;
  let loanTokenContract;
  let collateralTokenContract;
  let accounts;
  let nftId = 0;
  let loanId = 0;
  let contractOwnerBalance;
  let userBalance;

  const mintLoanTokenAmount = ethers.parseUnits('1000000000', 18);
  const fee = ethers.parseUnits('10000', 'wei'); // in wei
  const timeoutPeriod = 2592000; // in seconds
  const amount = ethers.parseUnits('10000', 18); // in Loan Tokens
  const interestRate = 1n; // e.g. 1%
  interest = amount * interestRate / 100n; // value to charge as an interest rate (in Loan Token)

  before(async function () {
    accounts = await ethers.getSigners();
    const LoanContractArtifact = await ethers.getContractFactory("LoanContract");
    const LoanTokenArtifact = await ethers.getContractFactory("LoanToken");
    const CollateralTokenArtifact = await ethers.getContractFactory("CollateralToken");

    loanContract = await LoanContractArtifact.deploy(accounts[0].address);
    await loanContract.waitForDeployment();

    const maxUint256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
    loanTokenContract = await LoanTokenArtifact.deploy(loanContract.target, maxUint256);
    await loanTokenContract.waitForDeployment();

    await loanContract.setLoanTokenAddress(loanTokenContract.target);
    await loanContract.disburseLoanToken(accounts[1].address, mintLoanTokenAmount);

    collateralTokenContract = await CollateralTokenArtifact.deploy(accounts[0].address);

    const tx = await collateralTokenContract.connect(accounts[0]).mintNFT(accounts[1].address, 'empty');
    const receipt = await tx.wait();
    nftId = receipt.logs[receipt.logs.length-1].args[1];

    contractOwnerBalance = await ethers.provider.getBalance(accounts[0].address);
    userBalance = await ethers.provider.getBalance(accounts[1].address);

    console.log(`    .  Contract Wallet: ${accounts[0].address} (Balance: ${contractOwnerBalance})`);
    console.log(`    .  User Wallet: ${accounts[1].address} (Balance: ${userBalance})`);
    console.log("");
  });

  describe("Loan tests with collateral NFT", function () {

    it("Should allow borrowing Loan Token with NFT collateral", async function () {
      contractOwnerBalance = await ethers.provider.getBalance(accounts[0].address);

      await collateralTokenContract.connect(accounts[1]).approve(loanContract.target, nftId);
      let tx = await loanContract.connect(accounts[1]).addLoan(collateralTokenContract.target, nftId, amount, fee, interest, timeoutPeriod, {value: fee});
      let receipt = await tx.wait();
      loanId = receipt.logs[receipt.logs.length-1].args[0];

      const tokenOwner = await collateralTokenContract.ownerOf(nftId);
      expect(tokenOwner).to.equal(loanContract.target);

      let contractBalanceExpected = contractOwnerBalance + fee;
      newContractBalance = await ethers.provider.getBalance(accounts[0].address)
      expect(newContractBalance).to.equal(contractBalanceExpected);
    });

    it("Should return a loan given its id", async function () {
      const loan = await loanContract.getLoanById(loanId);
      expect(loan[0]).to.equal(accounts[1].address);
      expect(loan[1]).to.equal(collateralTokenContract.target);
      expect(loan[2]).to.equal(nftId);
      expect(loan[3]).to.equal(amount);
      expect(loan[4]).to.equal(fee);
    });

    it("Should pay a loan by id", async function () {
      await loanTokenContract.connect(accounts[1]).approve(loanContract.target, amount + interest);
      await loanContract.connect(accounts[1]).payLoan(loanId);

      const loan = await loanContract.getLoanById(loanId);
      expect(loan.isPaid).to.be.true;

      const finalOwner = await collateralTokenContract.ownerOf(nftId);
      expect(finalOwner).to.equal(accounts[1].address);
    });

  });
});
