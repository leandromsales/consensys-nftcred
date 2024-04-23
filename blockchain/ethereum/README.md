# NFTCred Smart Contract

## Hardhat

`npx hardhat init`

## Using Hardhat

As default, Truffle reads the file `harhat-config.js` to perform commands, such as compile, test and deploy.
### Compile Contract

```shell
npx hardhat compile
```

### Test & verify

```shell
npx hardhat test
npx hardhat verify --network linea <CONTRACT ADDRESS>
```

### Deploy Contract

To default development network:

```shell
cd <this project root folder>
truffle deploy
```

To a specific network, in this case "goerli":

```shell
truffle deploy --network goerli
```

You can use --network to specify the network name, defined in the `truffle-config.js`


### Migrate Contract

To a specific network, in this case "goerli":

```shell
truffle migrate --network goerli
```

## Testnets

### Get Ethers

- https://faucet.metamask.io/

## Current Contracts Info on Goerli

NFT Contract address: 0x137735Ae0aB6C69c6950c92441E96ACAE9a6542c

## Error codes of the Loan Contract

    modifier onlyEnabled() {
        require(enabled, 'Error 1');
        _;
    }

    modifier onlyNotPaidLoan(bytes32 loanId) {
        Loan storage loan = _getLoanById(loanId);
        require(loan.isPaid == true, 'Error 2');
        _;
    }

    modifier onlyNotExpiredLoan(bytes32 loanId) {
        Loan storage loan = _getLoanById(loanId);
        require(block.timestamp < loan.timeout, 'Error 3');
        _;
    }

01 - Contract operation disabled by the owner
02 - Loan already paid
03 - Loan is expired
04 - Reserved for future use in create loan operation
05 - Reserved for future use in create loan operation
06 - Reserved for future use in create loan operation
07 - Reserved for future use in create loan operation
08 - Reserved for future use in create loan operation
09 - Reserved for future use in create loan operation
10 - Collateral token not approved to allow loan contract to transfer
11 - Sender is not the owner of the collateral token
12 - Not expected fee value
13 - Error in transfering the collateral token to the contract
14 - Reserved for future use in create pay loan operation
15 - Reserved for future use in create pay loan operation
16 - Reserved for future use in create pay loan operation
17 - Reserved for future use in create pay loan operation
18 - Reserved for future use in create pay loan operation
19 - Reserved for future use in create pay loan operation
20 - Sender is not the loan owner
21 - Not enough funds sent to pay back the loan
22 - Loan payment failed or transfer failed
23 - Loan has not expired yet
24 - Loan is already paid
25 - Contract does not have enough Loan Token
26 - Loan Token amount must be greater than 0
27 - Disburse failed
28 - Loan does not exist

## Useful links

- https://goerli.lineascan.build/

- https://docs.linea.build/use-mainnet/info-contracts

- https://hardhat.org/hardhat-runner/plugins
  
- https://hardhat.org/hardhat-vscode/docs/overview
  
- https://hardhat.org/hardhat-vscode/docs/formatting#formatting-configuration