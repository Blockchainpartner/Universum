import { ethers } from "ethers";
import { registrarABI } from "./registrarABI";

export function createInstanceRegistrar(provider: any, address: string) {
  return new ethers.Contract(address, registrarABI, provider);
}
