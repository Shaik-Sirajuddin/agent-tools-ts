import {
  ReadOnlyFunctionOptions,
  callReadOnlyFunction,
  cvToJSON,
  Cl,
} from "@stacks/transactions";
import { deriveChildAccount } from "../utilities";
import { CONTRACT_NAME, DEPLOYER } from "../constants";

// get user index in contract
// param: address

// CONFIGURATION

const NETWORK = Bun.env.network;
const MNEMONIC = Bun.env.mnemonic;
const ACCOUNT_INDEX = Bun.env.accountIndex;

const FUNCTION_NAME = "get-user-index";

// MAIN SCRIPT (DO NOT EDIT)

async function main() {
  // get account info
  const network = NETWORK;
  const mnemonic = MNEMONIC;
  const accountIndex = ACCOUNT_INDEX;

  // get address from mnemonic
  const { address: senderAddress } = await deriveChildAccount(
    network,
    mnemonic,
    accountIndex
  );

  // expect address as first argument
  // or default to configured wallet
  let address = process.argv[2];
  if (!address) {
    address = senderAddress;
  }
  const FUNCTION_ARGS = [Cl.principal(address)];

  const txOptions: ReadOnlyFunctionOptions = {
    contractName: CONTRACT_NAME,
    contractAddress: DEPLOYER,
    functionName: FUNCTION_NAME,
    functionArgs: FUNCTION_ARGS,
    network: network,
    senderAddress: senderAddress,
  };

  try {
    const response = await callReadOnlyFunction(txOptions);
    const responseJson = cvToJSON(response);
    const userId = responseJson.value.value;
    console.log(userId);
  } catch (error) {
    // report error
    console.error(`General/Unexpected Failure: ${error}`);
  }
}

main();
