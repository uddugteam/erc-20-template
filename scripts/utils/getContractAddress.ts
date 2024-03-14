import path from "path";
import fs from "fs";
import { addressesDir } from "../../configs/configs";

export function getContractAddress(networkName: string, contractName: string) {
  let address: string;

  try {
    address = JSON.parse(fs.readFileSync(path.join(addressesDir, `/${networkName}.json`)).toString())[contractName];
  } catch (e) {
    throw new Error(`Parsing address ${e}`);
  }
  return address;
}
