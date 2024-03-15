import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getContractAddress } from "./getContractAddress";

export async function getContract(hre: HardhatRuntimeEnvironment, contractName: string) {
  const address = getContractAddress(hre.network.name, contractName);

  try {
    return await hre.ethers.getContractAt(contractName, address);
  } catch (e) {
    throw new Error(`Get contract ${e}`);
  }
}
