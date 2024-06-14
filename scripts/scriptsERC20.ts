import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getContract } from "./utils/getContract";
import { waitForTxAndPrintHash } from "./utils/waitForTxAndPrintHash";
import { ERC20ContractName } from "../configs/configs";
import { Token } from "../typechain-types";

export async function getTotalSupply(hre: HardhatRuntimeEnvironment) {
  const contract = await getTokenContract(hre);

  try {
    const totalSupply = await contract.totalSupply();
    return hre.ethers.formatUnits(totalSupply, await contract.decimals());
  } catch (e) {
    const err = e as Error;
    throw new Error(`Get total supply error: ${err.message}`);
  }
}

export async function getBalanceOf(hre: HardhatRuntimeEnvironment, address: string) {
  if (!hre.ethers.isAddress(address)) {
    throw new Error("Invalid address, execution reverted");
  }

  const contract = await getTokenContract(hre);

  try {
    const balance = await contract.balanceOf(address);
    return hre.ethers.formatUnits(balance, await contract.decimals());
  } catch (e) {
    const err = e as Error;
    throw new Error(`Get balance error: ${err.message}`);
  }
}

export async function mint(hre: HardhatRuntimeEnvironment, to: string, amount: string) {
  if (!hre.ethers.isAddress(to)) {
    throw new Error("Invalid address, execution reverted");
  }

  if (amount.length == 0) {
    throw new Error("Invalid amount, execution reverted");
  }
  const contract = await getTokenContract(hre);

  let parsedAmount: bigint;
  try {
    parsedAmount = hre.ethers.parseUnits(amount, await contract.decimals());
  } catch {
    throw new Error("Invalid amount, execution reverted");
  }

  let tx;
  try {
    tx = await contract.mint(to, parsedAmount);
  } catch (e) {
    const err = e as Error;
    throw new Error(`Mint error: ${err.message}`);
  }

  console.log(`Minting ${amount} tokens to ${to}`);

  await waitForTxAndPrintHash(tx);
}

export async function transfer(hre: HardhatRuntimeEnvironment, to: string, amount: string) {
  if (amount.length == 0) {
    throw new Error("Invalid amount, execution reverted");
  }

  if (!hre.ethers.isAddress(to)) {
    throw new Error("Invalid address of `to`, execution reverted");
  }

  const contract = await getTokenContract(hre);

  let parsedAmount: bigint;
  try {
    parsedAmount = hre.ethers.parseUnits(amount, await contract.decimals());
  } catch {
    throw new Error("Invalid amount, execution reverted");
  }

  let tx;
  try {
    tx = await contract.transfer(to, parsedAmount);
  } catch (e) {
    const err = e as Error;
    throw new Error(`Transfer error: ${err.message}`);
  }
  console.log(`Transfering ${amount} tokens to ${to}`);

  await waitForTxAndPrintHash(tx);
}

export async function approve(hre: HardhatRuntimeEnvironment, to: string, amount: string) {
  if (amount.length == 0) {
    throw new Error("Invalid amount, execution reverted");
  }

  if (!hre.ethers.isAddress(to)) {
    throw new Error("Invalid address of `to`, execution reverted");
  }

  const contract = await getTokenContract(hre);

  let parsedAmount: bigint;
  try {
    parsedAmount = hre.ethers.parseUnits(amount, await contract.decimals());
  } catch {
    throw new Error("Invalid amount, execution reverted");
  }

  let tx;
  try {
    tx = await contract.approve(to, parsedAmount);
  } catch (e) {
    const err = e as Error;
    throw new Error(`Approve error: ${err.message}`);
  }

  console.log(`Approving ${amount} tokens to ${to}`);

  await waitForTxAndPrintHash(tx);
}

export async function transferFrom(hre: HardhatRuntimeEnvironment, from: string, to: string, amount: string) {
  if (amount.length == 0) {
    throw new Error("Invalid amount, execution reverted");
  }

  if (!hre.ethers.isAddress(from)) {
    throw new Error("Invalid address of `from`, execution reverted");
  }

  if (!hre.ethers.isAddress(to)) {
    throw new Error("Invalid address of `to`, execution reverted");
  }

  const contract = await getTokenContract(hre);

  let parsedAmount: bigint;
  try {
    parsedAmount = hre.ethers.parseUnits(amount, await contract.decimals());
  } catch {
    throw new Error("Invalid amount, execution reverted");
  }

  let tx;
  try {
    tx = await contract.transferFrom(from, to, parsedAmount);
  } catch (e) {
    const err = e as Error;
    throw new Error(`TransferFrom error: ${err.message}`);
  }

  console.log(`Transfering ${amount} tokens from ${from} to ${to}`);

  await waitForTxAndPrintHash(tx);
}

export async function transferOwnership(hre: HardhatRuntimeEnvironment, address: string) {
  if (!hre.ethers.isAddress(address)) {
    throw new Error("Invalid address, execution reverted");
  }

  const contract = await getTokenContract(hre);

  let tx;
  try {
    tx = await contract.transferOwnership(address);
  } catch (e) {
    const err = e as Error;
    throw new Error(`Transfering ownership error: ${err.message}`);
  }
  console.log(`Transfering ownership to ${address}`);

  await waitForTxAndPrintHash(tx);
}

export async function getOwner(hre: HardhatRuntimeEnvironment) {
  const contract = await getTokenContract(hre);

  try {
    return await contract.owner();
  } catch (e) {
    const err = e as Error;
    throw new Error(`Get owner error: ${err.message}`);
  }
}

export async function getTokenContract(hre: HardhatRuntimeEnvironment) {
  const contract = (await getContract(hre, ERC20ContractName)) as unknown as Token;
  return contract;
}
