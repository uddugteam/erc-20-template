import path from "path";
import fs from "fs";
import { addressesDir } from "../../configs/configs";

/**
 * @dev saveContractAddress is used to save contract address after deploy.
 * Saves contract address to root/contracts/addresses/chainID-networkName.json
 *
 * @param contractAddress - address of deployed contract;
 * @param networkName - name of network where contract was deployed;
 * @param contractName - name of deployed contract.
 */
export function saveContractAddress(contractAddress: string, networkName: string, contractName: string) {
  if (!fs.existsSync(addressesDir)) {
    fs.mkdirSync(addressesDir);
  }

  const filePath = path.join(addressesDir, `/${networkName}.json`);

  if (!fs.existsSync(filePath)) {
    try {
      fs.writeFileSync(filePath, JSON.stringify({ [contractName]: contractAddress }));
    } catch (e) {
      throw new Error(`Saving address ${e}`);
    }
  } else {
    let contractAddresses;

    try {
      contractAddresses = JSON.parse(fs.readFileSync(filePath).toString());
    } catch (e) {
      throw new Error(`Parsing file ${e}`);
    }

    contractAddresses[contractName] = contractAddress;

    try {
      fs.writeFileSync(filePath, JSON.stringify(contractAddresses));
    } catch (e) {
      throw new Error(`Saving address ${e}`);
    }
  }
}
