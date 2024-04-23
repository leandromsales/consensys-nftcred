import { ethers } from "hardhat";

async function main() {
  const maxUint256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

  const [owner] = await ethers.getSigners();
  console.log("Deploying contracts with the account: ", owner.address);
  console.log("Account balance: ", (await owner.provider.getBalance(owner.address)).toString());

  const loanContract = await ethers.deployContract("LoanContract", [owner.address]);
  await loanContract.waitForDeployment();
  console.log(`Loan Contract address: ${loanContract.target}`);

  const loanToken = await ethers.deployContract("LoanToken", [loanContract.getAddress(), maxUint256]);
  await loanToken.waitForDeployment();
  console.log("Loan token address:", loanToken.target);

  await loanContract.setLoanTokenAddress(loanToken.target);

  const collateralToken = await ethers.deployContract("CollateralToken", [owner.address]);
  await collateralToken.waitForDeployment();
  console.log(`Collateral token address: ${collateralToken.target}`);
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  }
);
