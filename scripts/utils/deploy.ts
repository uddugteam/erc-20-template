import { saveContractAbi } from "./saveContractAbi";
import { saveContractAddress } from "./saveContractAddress";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export async function deploy(hre: HardhatRuntimeEnvironment, contractName: string, args: unknown[]) {
  const [deployer] = await hre.ethers.getSigners();

  if (!hre.ethers.isAddress(deployer.address)) {
    throw new Error("Invalid address of deployer, deploy reverted");
  }

  console.log(`Deployer address ${deployer.address}`);

  const artifact = await hre.artifacts.readArtifact(contractName);
  const Contract = await hre.ethers.getContractFactoryFromArtifact(artifact);
  const deployTx = await Contract.getDeployTransaction(...args);
  const deploymentData = deployTx.data;

  if (Contract.runner && Contract.runner.estimateGas && Contract.runner.provider) {
    const gas = await Contract.runner.estimateGas({ data: deploymentData });

    console.log(`Deployment estimation gas ${gas.toString()}`);

    const deployerBalance = await Contract.runner.provider.getBalance(deployer.address);

    console.log(`Deployer balance ${deployerBalance.toString()}`);

    const contract = await hre.ethers.deployContract(contractName, args);
    await contract.waitForDeployment();

    const contractAddress = await contract.getAddress();

    console.log(`Contract ${contractName} deployed to address ${contractAddress}`);

    saveContractAddress(contractAddress, hre.network.name, contractName);

    if (hre.network.name != "hardhat" && hre.network.name != "localhost") {
      saveContractAbi(contract.interface.formatJson(), hre.network.name, contractName);

      console.log("Waiting 30 seconds before etherscan verification...");
      await new Promise(f => setTimeout(f, 30000));

      try {
        await hre.run("verify:verify", {
          address: contractAddress,
          constructorArguments: args,
        });
      } catch (e) {
        const err = e as Error;
        console.log("Error occured while verification: ", err.message);
      }
    }
  } else {
    throw new Error(`Bad contract instance of ${contractName}`);
  }
}
