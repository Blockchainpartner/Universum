import React, { useState, useEffect } from "react";
import { sendMetaTxOnAllNetworks } from "../service/metaTx";
import {
  useContractRead,
  useNetwork,
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import useDebounce from "./useDebounce";
import Image from "next/image";
import polygon from "../assets/polygon.png";
import optimism_logo from "../assets/optimism_logo.png";
import scroll from "../assets/scroll.png";
import zksync from "../assets/zksync.png";
import {
  getContractAddress,
  getContractAddressRegistrar,
} from "../utils/utils";
import { MyNewRegistrar } from "../utils/contractAddresses";
import {
  arbitrum,
  goerli,
  mainnet,
  optimism,
  arbitrumGoerli,
  optimismGoerli,
  zkSyncTestnet,
} from "wagmi/chains";
import { scrollTestnet, polygonZkTestnet } from "../utils/constants";
import { ensABI } from "../service/ensABI";
import { ethers, utils } from "ethers";
import { registrarABI } from "../service/registrarABI";

const labelhash = (label: string) => utils.keccak256(utils.toUtf8Bytes(label));

const namehash = require("eth-ens-namehash");

const RegistrationCard = () => {
  const [name, setName] = useState("");
  const debouncedName = useDebounce(name, 500);
  const [isFree, setIsFree] = useState(false);
  const [isTaken, setIsTaken] = useState(false);
  const { chain } = useNetwork();
  const { address, isConnecting, isDisconnected } = useAccount();
  useEffect(() => {
    if (isDisconnected) {
      setName("");
      setIsFree(false);
    }
  }, [isDisconnected]);

  const { config } = usePrepareContractWrite({
    //@ts-ignore
    address: MyNewRegistrar,
    abi: registrarABI,
    functionName: "register",
    args: [labelhash(name), address],
  });

  const { data, error, isError, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const { refetch } = useContractRead({
    address: getContractAddress(chain),
    abi: ensABI,
    functionName: "owner",
    args: [namehash.hash(name + ".test")],
  });

  async function handleClick(name: string) {
    write?.();
  }

  async function handleVerify() {
    setIsFree(false);
    setIsTaken(false);
    if (name) {
      const res = await refetch();
      const stringRes = res.data?.toString();
      console.log("resultat de l'appel: ", stringRes);
      if (stringRes == "0x0000000000000000000000000000000000000000") {
        setIsFree(true);
      } else {
        setIsTaken(true);
      }
    }
  }

  return (
    <div className="container h-auto py-20	 w-1/3 bg-white bg-opacity-10 rounded-2xl shadow-2xl relative z-2 border border-opacity-20 border-r-0 border-b-0 backdrop-filter backdrop-blur-sm">
      <div className="h-full flex flex-col justify-evenly items-center">
        <h1 className="text-white font-poppins text-2xl  mb-8 tracking-widest">
          Check name availability
        </h1>
        <div className="flex flex-col items-center">
          <div className="flex flex-row">
            <input
              className="bg-transparent border border-t-0 border-l-0 border-r-0 focus:outline-none text-white tracking-wide"
              onChange={(e) => setName(e.target.value)}
              disabled={isDisconnected}
              placeholder="Search name"
              value={name}
            ></input>
            <p className="text-white mx-3 translate-y-1/4 text-2xl font-semibold">
              .uni
            </p>
          </div>
          {isDisconnected && (
            <p className="mt-4 font-semibold text-transparent bg-clip-text bg-gradient-to-br from-violet-700 to-blue-300">
              {" "}
              Please connect your wallet{" "}
            </p>
          )}
          <button
            className={` font-poppins rounded-full w-40   px-5 py-1 mt-6 bg-white  ${
              !isDisconnected
                ? "hover:bg-white bg-opacity-50 hover:bg-opacity-80 cursor-pointer  "
                : "bg-opacity-30 text-gray-700 "
            }
            
            
            `}
            disabled={isDisconnected}
            onClick={() => handleVerify()}
          >
            Search
          </button>
          {isFree && !isDisconnected && (
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
              {/* {isSuccess && (
                <div>
                  Successfully registered your universum identity !
                  <div>
                    <a href={`https://goerli-optimism.etherscan.io/tx/${data?.hash}`}>Etherscan</a>
                  </div>
                </div>
              )} */}
              <h1 className="p-4 text-white font-bold font-poppins text-lg text-center">
                Supported networks
              </h1>
              <div className=" w-max flex flex-row content-between">
                <div className="ml-10 mr-4">
                  <Image
                    src={optimism_logo}
                    alt="optimism"
                    width={40}
                    height={40}
                  />
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
      </div>
    </div>
  );
};

export default RegistrationCard;
