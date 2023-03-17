const ethSigUtil = require('eth-sig-util');
import { signTypedData } from '@wagmi/core'


const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' }
];

const ForwardRequest = [
  { name: 'from', type: 'address' },
  { name: 'to', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'gas', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'data', type: 'bytes' },
];

function getMetaTxTypeData(chainId, verifyingContract) {
  return {
    types: {
      EIP712Domain,
      ForwardRequest,
    },
    domain: {
      name: 'MinimalForwarder',
      version: '0.0.1',
      chainId,
      verifyingContract,
    },
    primaryType: 'ForwardRequest',
  }
};

async function signTypedData2(signer, from, data) {
  // If signer is a private key, use it to sign
  if (typeof(signer) === 'string') {
    const privateKey = Buffer.from(signer.replace(/^0x/, ''), 'hex');
    return ethSigUtil.signTypedMessage(privateKey, { data });
  }

  // Otherwise, send the signTypedData RPC call
  // Note that hardhatvm and metamask require different EIP712 input
  const isHardhat = data.domain.chainId == 31337;
  
  const [method, argData] = isHardhat
    ? ['eth_signTypedData', data]
    : ['eth_signTypedData_v4', JSON.stringify(data)]
    console.log("method :", method);
    console.log("argData", argData);
    console.log("data :", data);
  //return await signer.send(method, [from, argData]);
  const signature = await signTypedData({
    domain: data.domain, 
    types: data.types,
    value: data.message,
  });
  console.log("signature :", signature);
  return signature;
}

async function buildRequest(forwarder, input) {
  const nonce = await forwarder.getNonce(input.from).then(nonce => nonce.toString());
  console.log("nonce: ", nonce);
  return { value: 0, gas: 1e6, nonce, ...input };
}

async function buildTypedData(forwarder, request) {
  const chainId = await forwarder.provider.getNetwork().then(n => n.chainId);
  console.log("chainId :", chainId)
  const typeData = getMetaTxTypeData(chainId, forwarder.address);
  return { ...typeData, message: request };
}

export async function signMetaTxRequest(signer, forwarder, input) {
  const request = await buildRequest(forwarder, input);
  const toSign = await buildTypedData(forwarder, request);
  const signature = await signTypedData2(signer, input.from, toSign);

  return { signature, request };
}
