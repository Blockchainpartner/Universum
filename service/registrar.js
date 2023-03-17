import { ethers } from 'ethers';

const abi = [
    {
      "inputs": [
        {
          "internalType": "contract ENS",
          "name": "ensAddr",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "node",
          "type": "bytes32"
        },
        {
          "internalType": "contract MinimalForwarder",
          "name": "trustedForwarder",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "forwarder",
          "type": "address"
        }
      ],
      "name": "isTrustedForwarder",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "label",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "register",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

//const address = process.env.NEXT_PUBLIC_FORWARDER_CONTRACT_ADDRESS
const address = "0x070E42eB3C33c4b001ef3Dd3098818dFE1aaDf18"

//ENS REGISTRY 0x9EBEe49a631f179f927B721d526080c100A82C4D

export function createInstanceRegistrar(provider) {
  return new ethers.Contract(address, abi, provider);
}