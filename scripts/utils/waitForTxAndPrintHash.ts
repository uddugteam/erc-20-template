import { ContractTransactionResponse } from "ethers";

export const waitForTxAndPrintHash = async (tx: ContractTransactionResponse) => {
  console.log("Waiting for transaction confirmation...");
  await tx.wait();
  console.log(`Complete! Transaction hash: ${tx.hash}`);
};
