
import React, { useState } from "react";
import { sendMetaTx2 } from "../service/metaTx";
import { useContractRead, useNetwork } from "wagmi";
import useDebounce from "./useDebounce";
import Image from "next/image";
import polygon from "../assets/polygon.png";
import optimism from "../assets/optimism.png";
import scroll from "../assets/scroll.png";
import zksync from "../assets/zksync.png";
import {
  OPTIMISTIC_GOERLI_ENS_ADDRESS,
  ARBITRUM_GOERLI_ENS_ADDRESS,
  SCROLL_ENS_ADDRESS,
  POLYGONZK_ENS_ADDRESS,
} from "../service/contractAddresses";
const namehash = require("eth-ens-namehash");

let ensABI = require("../service/ensABI.js");


const ButtonSendTransaction = () => {
  const [name, setName] = useState("");
  const debouncedName = useDebounce(name, 500);
  const [isFree, setIsFree] = useState(true);
  const [isTaken, setIsTaken] = useState(false);
  const { chain } = useNetwork();

  function getContractAddress() {
    switch (chain?.network) {
      case "optimism-goerli":
        return OPTIMISTIC_GOERLI_ENS_ADDRESS;
        break;
      case "arbitrum-goerli":
        return ARBITRUM_GOERLI_ENS_ADDRESS;
        break;
      case "scroll-testnet":
        return SCROLL_ENS_ADDRESS;
        break;
      case "polygon-zkevm-testnet":
        return POLYGONZK_ENS_ADDRESS;
        break;
      default:
      // code block
    }
  }
  const { refetch } = useContractRead({
    address: getContractAddress(),
    abi: ensABI,
    functionName: "owner",
    args: [namehash.hash(name + ".test")],
  });


  async function handleClick(name: string) {
    sendMetaTx2(name);
  }

  async function handleVerify() {
    setIsFree(false);
    setIsTaken(false);
    const res = await refetch();
    const stringRes = res.data?.toString();
    console.log("resultat de l'appel: ", stringRes);
    if (stringRes == "0x0000000000000000000000000000000000000000") {
      setIsFree(true);
    } else {
      setIsTaken(true);
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <input
          className="bg-transparent border border-t-0 border-l-0 border-r-0 focus:outline-none text-white tracking-wide"
          onChange={(e) => setName(e.target.value)}
          placeholder="Search name"
          value={name}
        ></input>
        <p className="text-white mx-3  translate-y-1/4 text-2xl font-semibold">
          .uni
        </p>
      </div>
      <button
        className="cursor-pointer font-poppins rounded-full px-5 py-1 mt-6 bg-white bg-opacity-50 hover:bg-white hover:bg-opacity-80 "
        onClick={() => handleVerify()}
      >
        Search
      </button>
      {isFree && (
        <>
          <p className="text-green-500 font-poppins text-center p-2">
            The name is available
          </p>
          <button
            className="cursor-pointer font-poppins rounded-full px-5 py-1 mt-6 bg-white bg-opacity-50 hover:bg-white hover:bg-opacity-80"
            onClick={() => handleClick(name)}
          >
            Register it on all L2's
          </button>
          <h1 className="p-4 text-white font-bold font-poppins text-lg text-center">
            Supported networks
          </h1>
          <div className=" w-max flex flex-row content-between">
            <div className="ml-10 mr-4">
              <Image src={optimism} alt="optimism" width={40} height={40} />
            </div>
            <div className=" mr-4">
              <Image src={polygon} alt="polygon" width={40} height={40} />
            </div>
            <div className=" mr-4">
              <Image src={scroll} alt="scroll" width={40} height={40} />
            </div>
            <div>
              <Image src={zksync} alt="zksync" width={40} height={40} />
            </div>
          </div>
        </>
      )}
      {isTaken && (
        <p className="text-red-500 p-2">The name is already registered</p>
      )}
    </div>
  );
};


export default ButtonSendTransaction;
