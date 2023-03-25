const ethSigUtil = require("eth-sig-util");
import { signTypedData } from "@wagmi/core";
import { EIP712Domain, ForwardRequest } from "../utils/constants";

function getMetaTxTypeData(chainId: number, verifyingContract: string) {
  return {
    types: {
      EIP712Domain,
      ForwardRequest,
    },
    domain: {
      name: "MinimalForwarder",
      version: "0.0.1",
      chainId,
      verifyingContract,
    },
    primaryType: "ForwardRequest",
  };
}

async function signTypedData2(signer: any, from: string, data: any) {
  // If signer is a private key, use it to sign
  if (typeof signer === "string") {
    const privateKey = Buffer.from(signer.replace(/^0x/, ""), "hex");
    return ethSigUtil.signTypedMessage(privateKey, { data });
  }

  // Otherwise, send the signTypedData RPC call
  // Note that hardhatvm and metamask require different EIP712 input
  const isHardhat = data.domain.chainId == 31337;

  const [method, argData] = isHardhat
    ? ["eth_signTypedData", data]
    : ["eth_signTypedData_v4", JSON.stringify(data)];

  //return await signer.send(method, [from, argData]);
  const signature = await signTypedData({
    domain: data.domain,
    types: data.types,
    value: data.message,
  });
  return signature;
}

async function buildRequest(forwarder: any, input: any) {
  const nonce = await forwarder.getNonce(input.from).then((nonce: number) => {
    nonce.toString();
  });
  return { value: 0, gas: 1e6, nonce, ...input };
}

async function buildTypedData(forwarder: any, request: any) {
  const chainId = await forwarder.provider.getNetwork().then((n: any) => {
    n.chainId;
  });
  const typeData = getMetaTxTypeData(chainId, forwarder.address);
  return { ...typeData, message: request };
}

export async function signMetaTxRequest(
  signer: any,
  forwarder: any,
  input: any
) {
  const request = await buildRequest(forwarder, input);
  const toSign = await buildTypedData(forwarder, request);
  const signature = await signTypedData2(signer, input.from, toSign);

  return { signature, request };
}
