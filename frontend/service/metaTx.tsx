import { ethers, utils } from "ethers";
import { createInstanceForwarder } from "./forwarder";
import { createInstanceRegistrar } from "./registrar";
import { signMetaTxRequest } from "./signer";
import {
  getContractAddressRegistrar,
  getContractAddressForwarder,
} from "../utils/utils";

import {
  getProvider,
  getAccount,
  getNetwork,
  switchNetwork,
} from "@wagmi/core";

const labelhash = (label: string) => utils.keccak256(utils.toUtf8Bytes(label));
const URL = "http://localhost:5000";

async function sendMetaTx(
  registry: any,
  provider: any,
  signer: any,
  name: string
) {
  //@ts-ignore
  const forwarder = createInstanceForwarder(provider);
  const from = await signer.getAddress();
  const data = registry.interface.encodeFunctionData("register", [name]);
  const to = registry.address;

  const request = await signMetaTxRequest(signer.provider, forwarder, {
    to,
    from,
    data,
  });

  return fetch(URL, {
    method: "POST",
    body: JSON.stringify(request),
    headers: { "Content-Type": "application/json" },
  });
}

export async function sendMetaTx2(name: string) {
  const ethersProvider = getProvider();
  const userNetwork = await ethersProvider.getNetwork();
  const envChainId = parseInt(process.env.NEXT_PUBLIC_CHAINID || "");
  const chainId = Number.isInteger(envChainId) ? envChainId : 137;
  const url =
    "https://api.defender.openzeppelin.com/autotasks/45d79e55-6c60-422a-9124-e664159851fc/runs/webhook/e6ba80fa-4da0-4b97-977a-2e7ab523bf1b/JBx9uyfq2HW742KhWNjYNi";

  if (!url) throw new Error(`Missing relayer url`);
  //@ts-ignore
  const signer = ethersProvider.getSigner();
  const registrar = createInstanceRegistrar(
    ethersProvider,
    getContractAddressRegistrar(userNetwork)
  );

  const forwarder = createInstanceForwarder(
    ethersProvider,
    getContractAddressForwarder(userNetwork)
  ); //rajouter un paramètre pour l'adresse du forwarder ici - switch
  const account = getAccount();
  const from = account.address;
  const data = registrar.interface.encodeFunctionData("register", [
    labelhash(name),
    from,
  ]);
  const to = registrar.address;

  const request = await signMetaTxRequest(signer.provider, forwarder, {
    to,
    from,
    data,
  });

  return fetch(url, {
    method: "POST",
    body: JSON.stringify(request),
    headers: { "Content-Type": "application/json" },
  });
}

// Chains is a tab of wagmi chains
export async function sendMetaTxOnAllNetworks(name: string, chains: any) {
  let requestArray = [];
  const account = getAccount();
  const from = account.address;
  for (let i = 0; i < chains.length; i++) {
    const { chain } = getNetwork();
    //@ts-ignore
    if (chain != chains[i]) {
      let network = await switchNetwork({
        //@ts-ignore
        chainId: chains[i].id,
      });
    }

    let provider = getProvider();
    //@ts-ignore
    let signer = provider.getSigner();
    let forwarder = createInstanceForwarder(
      provider,
      getContractAddressForwarder(chains[i])
    );
    let registrar = createInstanceRegistrar(
      provider,
      getContractAddressRegistrar(chains[i])
    );
    let data = registrar.interface.encodeFunctionData("register", [
      labelhash(name),
      from,
    ]);
    let to = registrar.address;
    let request = await signMetaTxRequest(signer.provider, forwarder, {
      to,
      from,
      data,
    });
    requestArray.push(JSON.stringify(request));
  }

  // Just send the request array to the relayer to process it

  // return fetch(url, {
  //   method: 'POST',
  //   body: JSON.stringify(request),
  //   headers: { 'Content-Type': 'application/json' },
  // });
}
