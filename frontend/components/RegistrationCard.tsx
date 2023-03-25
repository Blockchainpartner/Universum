import React, { useState, useEffect, CSSProperties } from "react";
import { useSnackbar } from "notistack";
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
import PropagateLoader from "react-spinners/PropagateLoader";

const namehash = require("eth-ens-namehash");

const RegistrationCard = () => {
  const override: CSSProperties = {
    margin: "10px 0 15px 0",
  };

  const { address, isDisconnected } = useAccount();
  const [name, setName] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [isTaken, setIsTaken] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingTransaction, setLoadingTransaction] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
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
      value: ethers.utils.parseEther("0.0001"),
    },
  });
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
      setLoadingTransaction(true);

      axios
        .post("http://localhost:5000", {
          label: labelhash(name),
          address: address,
        })
        .then(function (response) {
          setLoadingTransaction(false);
          enqueueSnackbar("Name successfully registered", {
            variant: "success",
          });
        })
        .catch(function (error) {
          setLoadingTransaction(false);
          enqueueSnackbar("An error occured", { variant: "error" });
        });
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isLoading) {
      setLoadingTransaction(true);
    }
  }, [isLoading]);

  async function handleClick() {
    write?.();
  }

  async function handleVerify() {
    setIsFree(false);
    setIsTaken(false);

    if (name) {
      setLoadingSearch(true);
      const res = await refetch();
      const stringRes = res.data?.toString();
      if (stringRes == "0x0000000000000000000000000000000000000000") {
        setIsFree(true);
        setLoadingSearch(false);
      } else {
        setIsTaken(true);
        setLoadingSearch(false);
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
            "font-poppins  text-white bg-gradient-to-br from-violet-700 to-blue-300 hover:bg-gradient-to-bl  dark:focus:ring-blue-600 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-5  mb-2"
          }
          disabled={isDisconnected}
          onClick={handleVerify}
        >
          {loadingSearch && (
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-5 h-5 mr-3 text-violet-600 animate-spin"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#93c5fd"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
          )}
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

            <PropagateLoader
              cssOverride={override}
              color={"#93c5fd"}
              loading={loadingTransaction}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />

            {loadingTransaction && (
              <p className="mt-2 ml-4 text-blue-300  font-poppins text-sm text-center">
                Registering name
              </p>
            )}
            <h1 className="p-4 text-white font-bold font-poppins text-lg text-center">
              Supported networks
            </h1>
            <div className=" w-max grid grid-cols-5 gap-4">
              <a
                target="_blank"
                href="https://optimistic.etherscan.io/address/0x332EAD518F1bF202b9ECf6254aC572c107c037B9"
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
