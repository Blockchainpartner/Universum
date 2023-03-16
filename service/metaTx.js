import { ethers } from 'ethers';
import { createInstance } from './forwarder';
import { signMetaTxRequest } from './signer';

// async function sendTx(registry, name) {
//   console.log(`Sending register tx to set name=${name}`);
//   return registry.register(name);
// }

async function sendMetaTx(registry, provider, signer, name) {
  console.log(`Sending register meta-tx to set name=${name}`);
  const url = process.env.REACT_APP_WEBHOOK_URL;
  if (!url) throw new Error(`Missing relayer url`);

  const forwarder = createInstance(provider);
  const from = await signer.getAddress();
  const data = registry.interface.encodeFunctionData('register', [name]);
  const to = registry.address;
  
  const request = await signMetaTxRequest(signer.provider, forwarder, { to, from, data });

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function registerName(registry, provider, name) {
  if (!name) throw new Error(`Name cannot be empty`);
  if (!window.ethereum) throw new Error(`User wallet not found`);

  await window.ethereum.enable();
  const userProvider = new ethers.providers.Web3Provider(window.ethereum);
  const userNetwork = await userProvider.getNetwork();
  if (userNetwork.chainId !== 5) throw new Error(`Please switch to Goerli for signing`);

  const signer = userProvider.getSigner();
  const from = await signer.getAddress();
  const balance = await provider.getBalance(from);
  
  const canSendTx = balance.gt(1e15);
  if (canSendTx) return sendTx(registry.connect(signer), name);
  else return sendMetaTx(registry, provider, signer, name);
}

export async function sendMetaTx2(signature: string, hashedEmail: string, arrayId: number[]) {
    const ethersProvider = new ethers.providers.Web3Provider(this.provider);
    const userNetwork = await ethersProvider.getNetwork();
    const envChainId = parseInt(process.env.NEXT_PUBLIC_CHAINID || '');
    const chainId = Number.isInteger(envChainId) ? envChainId : 137;
    if (userNetwork.chainId !== chainId) throw new Error(`Please switch to Polygon for signing`); 
    
    const url = process.env.NEXT_PUBLIC_AUTOTASK_WEBHOOK_URL;

    if (!url) throw new Error(`Missing relayer url`);

    const signer = ethersProvider.getSigner();

    const erc1155contract = createInstanceERC1155(ethersProvider)

    const forwarder = createInstanceForwarder(ethersProvider);
    const from = await signer.getAddress();
    const data = erc1155contract.interface.encodeFunctionData('whitelistMint', [signature, hashedEmail, arrayId]);
    const to = erc1155contract.address;

    const request = await signMetaTxRequest(signer.provider, forwarder, { to, from, data });

    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(request),
      headers: { 'Content-Type': 'application/json' },
    });
  }