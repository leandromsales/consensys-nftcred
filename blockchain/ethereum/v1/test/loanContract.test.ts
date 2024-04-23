import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { string } from "hardhat/internal/core/params/argumentTypes";


function printVar(name: any, value: any) {
  console.log(`         ${name}: ${value}`);
}

async function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe("LoanContract", function () {
  let loanContract: any;
  let loanTokenContract: any;
  let collateralTokenContract: any;
  let nftId = 0;
  let loanId: string = "";
  let contractOwnerBalance = 0n;
  let userBalance = 0n;

  const mintLoanTokenAmount = ethers.parseUnits('1000000000', 18); // amount distributed to the borrower (in Loan Tokens) via airdrop
  const fee = ethers.parseUnits('10000', 'wei'); // in wei, charged by the contract to provide the lending service
  const timeoutPeriod = 2592000; // in seconds
  const amount = ethers.parseUnits('10000', 18); // amount to be borrowed (in Loan Tokens)
  const interestRate = 1n; // e.g. 1% as an interest to be payed to the lender
  const interest = amount * interestRate / 100n; // amount to charge as an interest rate (in Loan Token)

  before(async function () {
    const [lender, borrower] = await ethers.getSigners();
    contractOwnerBalance = await ethers.provider.getBalance(lender.address);
    const LoanContractArtifact = await ethers.getContractFactory("LoanContract");
    const LoanTokenArtifact = await ethers.getContractFactory("LoanToken");
    const CollateralTokenArtifact = await ethers.getContractFactory("CollateralToken");

    loanContract = await LoanContractArtifact.deploy(lender.address);
    await loanContract.waitForDeployment();

    const maxUint256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
    loanTokenContract = await LoanTokenArtifact.deploy(loanContract.target, maxUint256);
    await loanTokenContract.waitForDeployment();
    await loanContract.setLoanTokenAddress(loanTokenContract.target);
    await loanContract.airdropLoanToken(borrower.address, mintLoanTokenAmount);

    collateralTokenContract = await CollateralTokenArtifact.deploy(lender.address);

    const tx = await collateralTokenContract.connect(lender).mintNFT(borrower.address, 'empty');
    const receipt = await tx.wait();
    nftId = receipt.logs[receipt.logs.length-1].args[1];

    contractOwnerBalance = await ethers.provider.getBalance(lender.address);
    userBalance = await ethers.provider.getBalance(borrower.address);

    console.log(`    .  Contract Wallet ${lender.address} Balance: ${contractOwnerBalance}`);
    console.log(`    .  User Wallet: ${borrower.address} Balance: ${userBalance}`);
    console.log("");
  });

  describe("Loan tests with collateral NFT", function () {

    it("Should allow borrowing Loan Token with NFT collateral", async () => {
      const [lender, borrower] = await ethers.getSigners();
      contractOwnerBalance = await ethers.provider.getBalance(lender.address);

      await collateralTokenContract.connect(borrower).approve(loanContract.target, nftId);
      let tx = await loanContract.connect(borrower).addLoan(collateralTokenContract.target, nftId, amount, fee, interest, timeoutPeriod, {value: fee});
      let receipt = await tx.wait();
      loanId = receipt.logs[receipt.logs.length-1].args[0];

      const tokenOwner = await collateralTokenContract.ownerOf(nftId);
      expect(tokenOwner).to.equal(loanContract.target);

      let contractBalanceExpected = contractOwnerBalance + fee;
      const newContractBalance = await ethers.provider.getBalance(lender.address)
      expect(newContractBalance).to.equal(contractBalanceExpected);
    });

    it("Should return a loan given its id", async () => {
      const [lender, borrower] = await ethers.getSigners();

      const loan = await loanContract.getLoanById(loanId);
      expect(loan[0]).to.equal(borrower.address);
      expect(loan[1]).to.equal(collateralTokenContract.target);
      expect(loan[2]).to.equal(nftId);
      expect(loan[3]).to.equal(amount);
      expect(loan[4]).to.equal(fee);
    });

    it("Should pay a loan by id", async () => {
      const [lender, borrower] = await ethers.getSigners();

      await loanTokenContract.connect(borrower).approve(loanContract.target, amount + interest);
      await loanContract.connect(borrower).payLoan(loanId);
      
      const loan = await loanContract.getLoanById(loanId);
      expect(loan.isPaid).to.be.true;

      const finalOwner = await collateralTokenContract.ownerOf(nftId);
      expect(finalOwner).to.equal(borrower.address);
    });

  });
});