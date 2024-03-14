# erc-20-template

This template contain standard ERC20 token contract with implemented non-payable mint() function and Ownable inheritance. Use this template for fast token deployment.

## Getting started

1. Clone the repository
2. Run `yarn install` command
3. Run `yarn compile` command
4. Add `.env` file. Example is in the [example](.env.example) file

## Deploy token

Specify token contract name in the [ERC20](./contracts/ERC20.sol) file. Name sould be the same as in the .env file.

```solidity
contract NEW_TOKEN_NAME is ERC20, Ownable...
```

Run with `--network` param (eg. sepolia):

```bash
yarn hardhat DeployToken --network NETWORK_NAME
```

In case of using custom chains - configure custom chain params in the [hardhat config](hardhat.config.ts)
