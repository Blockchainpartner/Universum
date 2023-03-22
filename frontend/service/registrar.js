import { ethers } from 'ethers';
let registrarAbi = require('./registrarABI.js');

//const address = process.env.NEXT_PUBLIC_FORWARDER_CONTRACT_ADDRESS
//const address = "0x070E42eB3C33c4b001ef3Dd3098818dFE1aaDf18"

//ENS REGISTRY 0x9EBEe49a631f179f927B721d526080c100A82C4D

export function createInstanceRegistrar(provider, address) {
  return new ethers.Contract(address, registrarAbi, provider);
}