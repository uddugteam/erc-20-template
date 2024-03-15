# erc-20-template

This template contain standard ERC20 token contract with implemented non-payable mint() function and Ownable inheritance. Use this template for fast token deployment.

## Getting started

1. Clone the repository
2. Run `yarn install` command
3. Run `yarn compile` command
4. Add `.env` file. Example is in the [example](.env.example) file

In case of using custom chains - configure custom chain params in the [hardhat config](hardhat.config.ts)

## Create new token

Specify token contract name in the [ERC20](./contracts/ERC20.sol) file. Name should be the same as in the .env file.

```solidity
contract NEW_TOKEN_NAME is ERC20, Ownable...
```

## Tasks

For all tasks use `--network` param, eg.:
```bash
yarn hardhat DeployToken --network sepolia
```
or configure this param in the [hardhat config](hardhat.config.ts):
```typescript
const config: HardhatUserConfig = {
  defaultNetwork: "sepolia",
  networks: {
    mainnet: {...
    },
    sepolia: {...
    },
  }
}
```
## Deploy token

```bash
yarn hardhat DeployToken
```

## Verify token

```bash
yarn hardhat VerifyToken
```

### TotalSupply
- **Description**: Get the total number of minted tokens.
- **Return**: `bigint`
- **Access**: Public

```bash
yarn hardhat getTotalSupply
```

### BalanceOf
- **Description**: Get the balance of tokens for a given address.
- **Params**:
  - `address` - address to get balance of.
- **Return**: `bigint`
- **Access**: Public

```bash
yarn hardhat getBalanceOf --address address
```

### Mint
- **Description**: Mint amount of tokens to the `to` address.
- **Params**:
  - `to` - address to mint tokens to
  - `amount` - number of tokens to mint. Note: will be converted according to token.decimals()
- **Access**: Only owner

```bash
yarn hardhat mint --to to --amount amount
```

### Approve
- **Description**: Set an `amount` as the allowance of `spender` over the caller's tokens.
- **Params**:
  - `spender` - address to approve tokens to
  - `amount` - number of tokens to approve. Note: will be converted according to token.decimals()
- **Access**: Public

```bash
yarn hardhat approve --spender spender --amount amount
```

### Transfer
- **Description**: Transfer `amount` of tokens from the caller to `to` address.
- **Params**:
  - `to` - address to transfer tokens to
  - `amount` - number of tokens to transfer. Note: will be converted according to token.decimals()
- **Access**: Public

```bash
yarn hardhat transfer --to to --amount amount
```

### TransferFrom
- **Description**: Transfer `amount` of tokens from `from` address to `to` address.
- **Params**:
  - `from` - address to transfer tokens from
  - `to` - address to transfer tokens to
  - `amount` - number of tokens to transfer. Note: will be converted according to token.decimals()
- **Access**: Public

```bash
yarn hardhat transferFrom --from from --to to --amount amount
```

### Owner
- **Description**: Get token contract owner.
- **Return**: `address`
- **Access**: Public

```bash
yarn hardhat getOwner
```

### TransferOwnership
- **Description**: Transfer ownership to the given address.
- **Params**:
  - `address` - address to transfer ownership to
- **Access**: Only owner

```bash
yarn hardhat transferOwnership --address address
```