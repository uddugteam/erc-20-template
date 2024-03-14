import dotenv from "dotenv";
import path from "path";
dotenv.config();

// ERC-20 token configs

export const ERC20ContractName = process.env.CONTRACT_NAME ?? "Token";
export const ERC20Name = process.env.TOKEN_NAME ?? "Token";
export const ERC20Symbol = process.env.TOKEN_SYMBOL ?? "TKN";

// Paths for saving tokens addresses and abis

export const addressesDir = path.join(__dirname, "../contracts/addresses");
export const abisDir = path.join(__dirname, "../contracts/abis");
