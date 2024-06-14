import { task, types } from "hardhat/config";
import {
  approve,
  getBalanceOf,
  getOwner,
  getTotalSupply,
  mint,
  transfer,
  transferFrom,
  transferOwnership,
} from "../scripts/scriptsERC20";
import { ERC20ContractName, ERC20Name, ERC20Symbol } from "../configs/configs";
import { deploy } from "../scripts/utils/deploy";
import { getContractAddress } from "../scripts/utils/getContractAddress";

task("DeployToken", "Deploy Token contract").setAction(async (args, hre) => {
  await hre.run("compile");
  await deploy(hre, ERC20ContractName, [ERC20Name, ERC20Symbol]);
});

task("VerifyToken", "Verify deployed Token contract").setAction(async (args, hre) => {
  const contractAddress = getContractAddress(hre.network.name, ERC20ContractName);
  await hre.run("verify:verify", {
    address: contractAddress,
    constructorArguments: [ERC20Name, ERC20Symbol],
  });
});

task("getTotalSupply", "Get total supply of token").setAction(async (args, hre) => {
  const totalSupply = await getTotalSupply(hre);
  console.log(`${ERC20Name} token total supply: ${totalSupply}`);
});

task("getBalanceOf", "Get Token balance of address")
  .addParam("address", "Address of an account to get balance", "", types.string)
  .setAction(async (args, hre) => {
    const addrBalance = await getBalanceOf(hre, args.address);
    const formattedBalance = hre.ethers.formatEther(addrBalance);
    console.log(`${ERC20Name} balance of ${args.address}: ${formattedBalance}`);
  });

task("mint", "Mint amount of tokens to the `to` address")
  .addParam("to", "Address to mint tokens to", "", types.string)
  .addParam("amount", "Amount of tokens to mint (e.g. 10.1)", "", types.string)
  .setAction(async (args, hre) => {
    await mint(hre, args.to, args.amount);
  });

task("approve", "Set an amount as the allowance of `spender` over the caller's tokens")
  .addParam("spender", "Address of `spender`", "", types.string)
  .addParam("amount", "Amount of tokens to be allowed (e.g. 10.1)", "", types.string)
  .setAction(async (args, hre) => {
    await approve(hre, args.spender, args.amount);
  });

task("transfer", "Transfer amount of tokens from the caller to `to` address")
  .addParam("to", "Address of `to`", "", types.string)
  .addParam("amount", "Amount of tokens to transfer (e.g. 10.1)", "", types.string)
  .setAction(async (args, hre) => {
    await transfer(hre, args.to, args.amount);
  });

task("transferFrom", "Transfer amount of tokens from `from` to `to` address")
  .addParam("from", "Address of `from`", "", types.string)
  .addParam("to", "Address of `to`", "", types.string)
  .addParam("amount", "Amount of tokens to transfer (e.g. 10.1)", "", types.string)
  .setAction(async (args, hre) => {
    await transferFrom(hre, args.from, args.to, args.amount);
  });

task("getOwner", "Get Token owner").setAction(async (args, hre) => {
  const owner = await getOwner(hre);
  console.log(`${ERC20Name} owner address: ${owner}`);
});

task("transferOwnership", "Transfer ownership to the new address")
  .addParam("address", "Address of new owner", "", types.string)
  .setAction(async (args, hre) => {
    await transferOwnership(hre, args.address);
  });

task("Balance", "Get address native balance").setAction(async (args, hre) => {
  const [user] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(user);
  console.log(`${user.address} balance: ${hre.ethers.formatEther(balance)}`);
});
