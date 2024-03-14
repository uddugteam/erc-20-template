import { HardhatUserConfig } from "hardhat/config";
import "./tasks/tasksToken";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-docgen";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.21",
  },
  mocha: {
    timeout: 200000,
  },
  networks: {
    mainnet: {
      url: (process.env.MAINNET_RPC as string) ?? "",
      accounts: [process.env.PRIVATE_KEY as string],
      chainId: 1,
    },
    sepolia: {
      url: (process.env.SEPOLIA_RPC as string) ?? "",
      accounts: [process.env.PRIVATE_KEY as string],
      chainId: 11155111,
    },
    // Configure your custom network here
    customNetwork: {
      url: (process.env.CUSTOM_RPC as string) ?? "",
      accounts: [process.env.PRIVATE_KEY as string],
      chainId: 999999,
    },
  },
  etherscan: {
    apiKey: {
      mainnet: (process.env.ETHERSCAN_API_KEY as string) ?? "",
      sepolia: (process.env.ETHERSCAN_API_KEY as string) ?? "",
      customNetwork: (process.env.ETHERSCAN_API_KEY as string) ?? "",
    },
    customChains: [
      {
        network: "customNetwork", // change to your custom network name
        chainId: 0, // change to your network chainID
        urls: {
          apiURL: (process.env.CUSTOM_API_URL as string) ?? "",
          browserURL: (process.env.CUSTOM_BROWSER_URL as string) ?? "",
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
