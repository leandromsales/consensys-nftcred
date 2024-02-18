const LoanContractArtifact = artifacts.require("LoanContract");
const LoanTokenArtifact = artifacts.require("LoanToken");
const collateralTokenArtifact  = artifacts.require("CollateralToken");

module.exports = function (deployer, network, accounts) {
  deployer.then(async () => {
    const maxUint256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
    
    await deployer.deploy(LoanContractArtifact, accounts[0]);
    const loanContractInstance = await LoanContractArtifact.deployed();
    
    await deployer.deploy(LoanTokenArtifact, loanContractInstance.address, maxUint256);
    const loanTokenInstance = await LoanTokenArtifact.deployed();

    loanContractInstance.setLoanTokenAddress(loanTokenInstance.address);
    
    await deployer.deploy(collateralTokenArtifact, accounts[0]);
  });
};
