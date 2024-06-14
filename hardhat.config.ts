import { HardhatUserConfig } from "hardhat/config";
import "./tasks/tasksToken";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-docgen";
import { network } from "./configs/configs";

const config: HardhatUserConfig = {
  defaultNetwork: network.name,
  solidity: {
    version: "0.8.21",
  },
  mocha: {
    timeout: 200000,
  },
  networks: {
    mainnet: {
      url: process.env.MAINNET_RPC ?? "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : undefined,
      chainId: 1,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC ?? "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : undefined,
      chainId: 11155111,
    },
    [network.name]: {
      url: network.rpc,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : undefined,
      chainId: network.chainId,
    },
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY ?? "",
      sepolia: process.env.ETHERSCAN_API_KEY ?? "",
      [network.name]: process.env.ETHERSCAN_API_KEY ?? "",
    },
    customChains: [
      {
        network: network.name,
        chainId: network.chainId,
        urls: {
          apiURL: network.apiUrl,
          browserURL: network.browserUrl,
        },
      },
    ],
  },
  docgen: {
    path: "./docs",
    clear: false,
    runOnCompile: false,
  },
};

export default config;
