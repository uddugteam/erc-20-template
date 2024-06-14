import path from "path";
import fs from "fs";
import { abisDir } from "../../configs/configs";

/**
 * @dev saveContractAbi is used to save contract abi after deploy.
 * Saves contract abi to root/contracts/abis/networkName-contractName-abi.json
 *
 * @param contractAbi - abi of deployed contract;
 * @param networkName - name of network where contract was deployed;
 * @param contractName - name of deployed contract.
 */
export function saveContractAbi(contractAbi: string, networkName: string, contractName: string) {
  if (!fs.existsSync(abisDir)) {
    fs.mkdirSync(abisDir);
  }

  const abiPath = path.join(abisDir, `/${networkName}`);

  if (!fs.existsSync(abiPath)) {
    fs.mkdirSync(abiPath);
  }

  try {
    fs.writeFileSync(path.join(abiPath, `/${contractName}-abi.json`), contractAbi);
  } catch (e) {
    throw new Error(`Saving abi ${e}`);
  }
}
