import { ethers, utils } from 'ethers';
import { createInstanceForwarder } from './forwarder';
import { createInstanceRegistrar } from './registrar';
import { signMetaTxRequest } from './signer';
import { getProvider, getAccount } from '@wagmi/core'

const labelhash = (label) => utils.keccak256(utils.toUtf8Bytes(label))

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

export async function sendMetaTx2(name, owner) {
    //const ethersProvider = new ethers.providers.Web3Provider(this.provider);
    const ethersProvider = getProvider();
    const userNetwork = await ethersProvider.getNetwork();
    console.log(userNetwork);
    const envChainId = parseInt(process.env.NEXT_PUBLIC_CHAINID || '');
    const chainId = Number.isInteger(envChainId) ? envChainId : 137;
    //if (userNetwork.chainId !== chainId) throw new Error(`Please switch to Polygon for signing`); 
    
    //const url = process.env.NEXT_PUBLIC_AUTOTASK_WEBHOOK_URL;
    const url = "https://api.defender.openzeppelin.com/autotasks/45d79e55-6c60-422a-9124-e664159851fc/runs/webhook/e6ba80fa-4da0-4b97-977a-2e7ab523bf1b/JBx9uyfq2HW742KhWNjYNi";

    if (!url) throw new Error(`Missing relayer url`);

    const signer = ethersProvider.getSigner();
    const registrar = createInstanceRegistrar(ethersProvider)

    const forwarder = createInstanceForwarder(ethersProvider);
    const account = getAccount()
    const from = account.address;
    const data = registrar.interface.encodeFunctionData('register', [labelhash(name), from]);
    const to = registrar.address;

    const request = await signMetaTxRequest(signer.provider, forwarder, { to, from, data });

    console.log("la metaTx a ete lance");

    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(request),
      headers: { 'Content-Type': 'application/json' },
    });
  }