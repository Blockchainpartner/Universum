const hre = require("hardhat");
const namehash = require('eth-ens-namehash');
const tld = "test";
const ethers = hre.ethers;
const utils = ethers.utils;
const labelhash = (label) => utils.keccak256(utils.toUtf8Bytes(label))
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";

async function main() {
  const ENSRegistry = await ethers.getContractFactory("ENSRegistry")
  const MyRegistrar = await ethers.getContractFactory("MyRegistrar")
  const MinimalForwarder = await ethers.getContractFactory("MinimalForwarder")
//   const ReverseRegistrar = await ethers.getContractFactory("ReverseRegistrar")
//   const PublicResolver = await ethers.getContractFactory("PublicResolver")
  const signers = await ethers.getSigners();
  const accounts = signers.map(s => s.address)

  const minimalForwarder = await MinimalForwarder.deploy()
  await minimalForwarder.deployed()
  console.log("MinimalForwarder deployed to:", minimalForwarder.address);

  const ens = await ENSRegistry.deploy()
  await ens.deployed()
  console.log("ENSRegistry deployed to:", ens.address);

  const registrar = await MyRegistrar.deploy(ens.address, namehash.hash(tld), minimalForwarder.address);
  await registrar.deployed()
  await setupRegistrar(ens, registrar);
  console.log("MyRegistrar deployed to:", registrar.address);

//   const reverseRegistrar = await ReverseRegistrar.deploy(ens.address);
//   await reverseRegistrar.deployed()
//   console.log("ReverseRegistrar deployed to:", reverseRegistrar.address);

//   const resolver = await PublicResolver.deploy(ens.address, ZERO_ADDRESS, ZERO_ADDRESS, reverseRegistrar.address);
//   await resolver.deployed()
//   console.log("PublicResolver deployed to:", resolver.address);

  //await setupResolver(ens, resolver, accounts)
//   await setupRegistrar(ens, registrar);
//   await setupReverseRegistrar(ens, registrar, reverseRegistrar, accounts, resolver);

  //await interactWithDeployedContracts(accounts, registrar, resolver, ens, reverseRegistrar);
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

async function setupReverseRegistrar(ens, registrar, reverseRegistrar, accounts, resolver) {
  await ens.setSubnodeOwner(ZERO_HASH, labelhash("reverse"), accounts[0]);
  await ens.setSubnodeOwner(namehash.hash("reverse"), labelhash("addr"), reverseRegistrar.address);
  await reverseRegistrar.setDefaultResolver(resolver.address);
}

async function interactWithDeployedContracts(accounts, registrar, resolver, ens, reverseRegistrar) {
    // Register my ENS
    await registrar.register(labelhash("florian"), accounts[0]);

    // Verifying if I am the owner within the registry    
    console.log("owner de florian.test est: ", await ens.owner(namehash.hash("florian.test")));

    // Set a resolver for our node
    await ens.setResolver(namehash.hash("florian.test"), resolver.address);
    console.log("resolver de florian.test est: ", await ens.resolver(namehash.hash("florian.test")));

    // Write my address inside the resolver
    // if there are two functions with the same name then you have to explicitly use the fully qualified signature.
    await resolver["setAddr(bytes32,address)"](namehash.hash("florian.test"), accounts[0]);
    console.log("adresse de florian.test est: ", await resolver["addr(bytes32)"](namehash.hash("florian.test")));

    // Setup Reverse Registrar for my address
    await reverseRegistrar.setName("florian.test");
    console.log("l'adresse de account0 est: ", accounts[0]);
    console.log("resolver de mon reverse record:", (await ens.resolver(namehash.hash(accounts[0].substring(2) + ".addr.reverse"))));
    console.log("ENS depuis le reverse record:", (await resolver.name(namehash.hash(accounts[0].substring(2) + ".addr.reverse"))));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });