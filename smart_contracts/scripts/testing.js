const namehash = require('eth-ens-namehash');
const hre = require("hardhat");
const ethers = hre.ethers;
const utils = ethers.utils;
const labelhash = (label) => utils.keccak256(utils.toUtf8Bytes(label))

console.log("Le node de .test est : ", namehash.hash("test"));
console.log("Le node de bouchut.eth est : ", namehash.hash("bouchut.eth"));
console.log("Le node de bouchut.test est : ", namehash.hash("bouchut.test"));
console.log("Le node de hanpepe.eth est : ", namehash.hash("hanpepe.eth"));
console.log(namehash.hash("florian.test.test"));
console.log("Le node de .eth est : ", namehash.hash("eth"));
console.log("Le node de florian.test est : ", namehash.hash("florian.test"));
console.log("Le node de frigo.test est : ", namehash.hash("frigo.test"));
console.log("Le labelhash de florian est :", labelhash("florian"));


