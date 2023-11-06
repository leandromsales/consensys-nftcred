## Getting started

We use Truffle Suite for develop, test and deploy, as well as Ganache for running a local Testnet.

### Installing Truffle Suite

In order to install Truffle, execute the following command:

```shell
npm install truffle dotenv @truffle/hdwallet-provider @openzeppelin/contracts eth-gas-reporter truffle-assertions
```

### Installing Ganache

In order to install Ganache, execute the following command:

On Mac (Homebrew):
```shell
brew install ganache ganache-cli
```

On Mac (NPM):
```shell
npm install ganache ganache-cli -g
```

After installing Ganache, it will be available from your user application folder. To setup Ganache, just open it and create a new workspace with the default settings. Also, during setup, section workspace, click on add project and select this repository folder (cloned to your computer) in the list of projects. In the accounts & keys section, specify 100 as account default balance and at least 4 in the total accounts to generate. In the chain section, specify 80000000000 as gas price and select Petersburg as the Hardfork.

## Using Truffle

As default, Truffle reads the file `truffle-config.js` to perform commands, such as compile, test and deploy.
### Compile Contract

```shell
cd <this project root folder>
truffle compile
```

### Test

```shell
cd <this project root folder>
truffle test
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