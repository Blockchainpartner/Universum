//SPDX-License-Identifier: MIT
// These imports are here to force Hardhat to compile contracts we depend on in our tests but don't need anywhere else.

//Registry
import "@ensdomains/ens-contracts/contracts/registry/ENSRegistryWithFallback.sol";
import "@ensdomains/ens-contracts/contracts/registry/FIFSRegistrar.sol";
//import "@ensdomains/ens-contracts/contracts/registry/ReverseRegistrar.sol";

//EthRegistrar
import "@ensdomains/ens-contracts/contracts/ethregistrar/BaseRegistrarImplementation.sol";
import '@ensdomains/ens-contracts/contracts/ethregistrar/ETHRegistrarController.sol';

//Resolvers 
import "@ensdomains/ens-contracts/contracts/resolvers/PublicResolver.sol";

