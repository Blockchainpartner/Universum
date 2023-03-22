import { ethers, utils } from 'ethers';
import { createInstanceForwarder } from './forwarder';
import { createInstanceRegistrar } from './registrar';
import { signMetaTxRequest } from './signer';
import { getProvider, getAccount, getNetwork, switchNetwork } from '@wagmi/core'
import { OPTIMISTIC_GOERLI_MINIMAL_FORWARDER, ARBITRUM_GOERLI_MINIMAL_FORWARDER, SCROLL_MINIMAL_FORWARDER, POLYGONZK_MINIMAL_FORWARDER, OPTIMISTIC_GOERLI_REGISTRAR_ADDRESS, ARBITRUM_GOERLI_REGISTRAR_ADDRESS, SCROLL_REGISTRAR_ADDRESS, POLYGON_REGISTRAR_ADDRESS, POLYGONZK_REGISTRAR_ADDRESS } from './contractAddresses';


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

function getContractAddressForwarder(chain) {
  switch (chain.network) {
    case "optimism-goerli":
      return OPTIMISTIC_GOERLI_MINIMAL_FORWARDER;
      break;
    case "arbitrum-goerli":
      return ARBITRUM_GOERLI_MINIMAL_FORWARDER;
      break;
    case "scroll-testnet":
      return SCROLL_MINIMAL_FORWARDER;
      break;
    case "polygon-zkevm-testnet":
      return POLYGONZK_MINIMAL_FORWARDER;
      break;
    default:
      // code block
      return "";
  }
};

function getContractAddressRegistrar(chain) {
  switch (chain.network) {
    case "optimism-goerli":
      return OPTIMISTIC_GOERLI_REGISTRAR_ADDRESS;
      break;
    case "arbitrum-goerli":
      return ARBITRUM_GOERLI_REGISTRAR_ADDRESS;
      break;
    case "scroll-testnet":
      return SCROLL_REGISTRAR_ADDRESS;
      break;
    case "polygon-zkevm-testnet":
      return POLYGONZK_REGISTRAR_ADDRESS;
      break;
    default:
      // code block
      return "";
  }
};

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
  const registrar = createInstanceRegistrar(ethersProvider, getContractAddressRegistrar(userNetwork))

  const forwarder = createInstanceForwarder(ethersProvider, getContractAddressForwarder(userNetwork)); //rajouter un paramètre pour l'adresse du forwarder ici - switch
  console.log("forwarder :", forwarder);
  const account = getAccount()
  const from = account.address;
  console.log("from: ", from);
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

// Chains is a tab of wagmi chains
export async function sendMetaTxOnAllNetworks(name, chains) {
  let requestArray = [];

  const account = getAccount()
  const from = account.address;
  console.log("from: ", from);

  for (let i = 0; i < chains.length; i++) {

    console.log("chains(i) = ", chains[i]);

    const { chain } = getNetwork();
    
    if (chain != chains[i]) {
      let network = await switchNetwork({
        chainId: chains[i].id,
      })
    }

    let provider = getProvider();

    let signer = provider.getSigner();

    let forwarder = createInstanceForwarder(provider, getContractAddressForwarder(chains[i]));
    let registrar = createInstanceRegistrar(provider, getContractAddressRegistrar(chains[i]));
    let data = registrar.interface.encodeFunctionData('register', [labelhash(name), from]);
    let to = registrar.address;
    let request = await signMetaTxRequest(signer.provider, forwarder, { to, from, data });
    requestArray.push(JSON.stringify(request));
  }

  // Just send the request array to the relayer to process it

  // return fetch(url, {
  //   method: 'POST',
  //   body: JSON.stringify(request),
  //   headers: { 'Content-Type': 'application/json' },
  // });
}