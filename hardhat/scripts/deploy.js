const hre = require("hardhat");
const namehash = require('eth-ens-namehash');
const tld = "eth";
const ethers = hre.ethers;
const utils = ethers.utils;
const labelhash = (label) => utils.keccak256(utils.toUtf8Bytes(label))
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";

async function main() {
  const ENSRegistryWithFallback = await ethers.getContractFactory("ENSRegistryWithFallback")
  //const FIFSRegistrar = await ethers.getContractFactory("FIFSRegistrar")
  const BaseRegistrar = await ethers.getContractFactory("BaseRegistrarImplementation")
  const NameWrapper = await ethers.getContractFactory("NameWrapper")
  const MetadataService = await ethers.getContractFactory("StaticMetadataService")
  const EthRegistrarController = await ethers.getContractFactory("ETHRegistrarController")
  const ReverseRegistrar = await ethers.getContractFactory("ReverseRegistrar")
  const PublicResolver = await ethers.getContractFactory("PublicResolver")
  const signers = await ethers.getSigners();
  const accounts = signers.map(s => s.address)

  const ens = await ENSRegistryWithFallback.deploy()
  await ens.deployed()
  console.log("ENSRegistryWithFallback deployed to:", ens.address);
  
  const reverseRegistrar = await ReverseRegistrar.deploy(ens.address);
  await reverseRegistrar.deployed()
  console.log("ReverseRegistrar deployed to:", reverseRegistrar.address);

  const resolver = await PublicResolver.deploy(ens.address, ZERO_ADDRESS, ZERO_ADDRESS, reverseRegistrar.address);
  await resolver.deployed()
  await setupResolver(ens, resolver, accounts)
  console.log("PublicResolver deployed to:", resolver.address);

  // Take in parameters ENSRegistry address and node of TLD
  const registrar = await BaseRegistrar.deploy(ens.address, namehash.hash(tld));
  await registrar.deployed()
  console.log("BaseRegistrar deployed to:", registrar.address);

  const metadataService = await MetadataService.deploy("");
  await metadataService.deployed()
  console.log("MetadataService deployed to:", metadataService.address);

  const nameWrapper = await NameWrapper.deploy(ens.address, registrar.address, metadataService.address);
  await nameWrapper.deployed()
  console.log("NameWrapper deployed to:", nameWrapper.address);

  // A faire
  const priceOracle = await EthRegistrarController.deploy(ens.address, namehash.hash(tld));
  await registrar.deployed()
  console.log("BaseRegistrar deployed to:", registrar.address);

  const controller = await EthRegistrarController.deploy(ens.address, namehash.hash(tld));
  await registrar.deployed()
  console.log("BaseRegistrar deployed to:", registrar.address);


  await setupRegistrar(ens, registrar);
  await setupReverseRegistrar(ens, registrar, reverseRegistrar, accounts);
  
};

async function setupResolver(ens, resolver, accounts) {
  const resolverNode = namehash.hash("resolver");
  const resolverLabel = labelhash("resolver");
  await ens.setSubnodeOwner(ZERO_HASH, resolverLabel, accounts[0]);
  await ens.setResolver(resolverNode, resolver.address);
  await resolver['setAddr(bytes32,address)'](resolverNode, resolver.address);
}

async function setupRegistrar(ens, registrar) {
  await ens.setSubnodeOwner(ZERO_HASH, labelhash(tld), registrar.address);
}

async function setupReverseRegistrar(ens, registrar, reverseRegistrar, accounts) {
  await ens.setSubnodeOwner(ZERO_HASH, labelhash("reverse"), accounts[0]);
  await ens.setSubnodeOwner(namehash.hash("reverse"), labelhash("addr"), reverseRegistrar.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });