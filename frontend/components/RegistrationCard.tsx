import React, { useState, useEffect } from "react";
import {
  useContractRead,
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import Image from "next/image";
import polygon_logo from "../assets/polygon.png";
import optimism_logo from "../assets/optimism_logo.png";
import scroll_logo from "../assets/scroll.png";
import arbitrum_logo from "../assets/Arbitrum.png";
import gnosis_logo from "../assets/gnosis.png";
import { MyNewRegistrar, ENSRegistry } from "../utils/contractAddresses";
import { ensABI } from "../service/ensABI";
import { ethers, utils } from "ethers";
import { registrarABI } from "../service/registrarABI";
import axios from "axios";
const namehash = require("eth-ens-namehash");

const RegistrationCard = () => {
  const { address, isDisconnected } = useAccount();
  const [name, setName] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [isTaken, setIsTaken] = useState(false);
  const [loading, setLoading] = useState(true);

  const labelhash = (label: string) =>
    utils.keccak256(utils.toUtf8Bytes(label));

  const { refetch } = useContractRead({
    address: ENSRegistry,
    abi: ensABI,
    functionName: "owner",
    args: [namehash.hash(name + ".uni")],
  });

  const { config } = usePrepareContractWrite({
    address: MyNewRegistrar,
    abi: registrarABI,
    functionName: "register",
    args: [labelhash(name), address],
    overrides: {
      value: ethers.utils.parseEther("0.001"),
    },
  });
  console.log(labelhash("testing3"));
  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (isDisconnected) {
      setName("");
      setIsFree(false);
    }
  }, [isDisconnected]);

  useEffect(() => {
    if (isSuccess) {
      axios
        .post("http://localhost:5000", {
          label: labelhash(name),
          address: address,
        })
        .then(function (response) {
          console.log(response);
          console.log("success");
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [isSuccess]);

  console.log(isLoading, isSuccess);
  async function handleClick() {
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
    <>
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

        <button
          className={
            "font-poppins text-white bg-gradient-to-br from-violet-700 to-blue-300 hover:bg-gradient-to-bl  dark:focus:ring-blue-600 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-5  mb-2"
          }
          disabled={isDisconnected}
          onClick={handleVerify}
        >
          Search
        </button>
        {isDisconnected && (
          <p className="mt-4 font-semibold text-transparent bg-clip-text bg-gradient-to-br from-violet-700 to-blue-300">
            {" "}
            Please connect your wallet{" "}
          </p>
        )}
        {isFree && !isDisconnected && (
          <>
            <p className="text-green-500 font-poppins text-center p-2">
              The name is available
            </p>
            <button
              className="cursor-pointer font-poppins text-white bg-gradient-to-br from-violet-700 to-blue-300 hover:bg-gradient-to-bl  dark:focus:ring-blue-600 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-5  mb-2"
              onClick={handleClick}
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
            <div className=" w-max grid grid-cols-5 gap-4">
              <a
                target="_blank"
                href="https://optimistic.etherscan.io/address/0xc847d2f85a0b0c39e574d597098fb6584d2c9f4a"
                rel="noopener noreferrer"
              >
                <div className="hover:cursor-pointer ">
                  <Image
                    src={optimism_logo}
                    alt="optimism"
                    width={40}
                    height={40}
                  />
                </div>
              </a>
              <a
                target="_blank"
                href="https://gnosisscan.io/address/0x332ead518f1bf202b9ecf6254ac572c107c037b9"
                rel="noopener noreferrer"
              >
                <div className="hover:cursor-pointer ">
                  <Image
                    src={gnosis_logo}
                    alt="gnosis"
                    width={40}
                    height={40}
                  />
                </div>
              </a>
              <a
                target="_blank"
                href="https://testnet-zkevm.polygonscan.com/address/0xaCA26Db592d626b75a6E8132b202C29EFa9Ee812"
                rel="noopener noreferrer"
              >
                <div className="hover:cursor-pointer  ">
                  <Image
                    src={polygon_logo}
                    alt="polygon"
                    width={40}
                    height={40}
                  />
                </div>
              </a>
              <a
                target="_blank"
                href="https://blockscout.scroll.io/address/0xaCA26Db592d626b75a6E8132b202C29EFa9Ee812"
                rel="noopener noreferrer"
              >
                <div className=" hover:cursor-pointer ">
                  <Image
                    src={scroll_logo}
                    alt="scroll"
                    width={40}
                    height={40}
                  />
                </div>
              </a>
              <a
                target="_blank"
                href="https://goerli.arbiscan.io/address/0xaCA26Db592d626b75a6E8132b202C29EFa9Ee812"
                rel="noopener noreferrer"
              >
                <div className=" hover:cursor-pointer ">
                  <Image
                    src={arbitrum_logo}
                    alt="arbitrum"
                    width={42}
                    height={42}
                  />
                </div>
              </a>
            </div>
          </>
        )}
        {isTaken && (
          <p className="text-red-500 p-2">The name is already registered</p>
        )}
      </div>
    </>
  );
};

export default RegistrationCard;
