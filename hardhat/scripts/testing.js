const namehash = require('eth-ens-namehash');
console.log("Le node de .test est : ", namehash.hash("test"));
console.log("Le node de bouchut.eth est : ", namehash.hash("bouchut.eth"));
console.log("Le node de hanpepe.eth est : ", namehash.hash("hanpepe.eth"));
console.log(namehash.hash("florian.test.test"));
console.log("Le node de .eth est : ", namehash.hash("eth"));
console.log("Le node de florian.test est : ", namehash.hash("florian.test"));


