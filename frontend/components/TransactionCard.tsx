import React, { useState, useEffect } from "react";
import {
  useContractRead,
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import Image from "next/image";
import Link from "next/link";
import polygon from "../assets/polygon.png";
import optimism_logo from "../assets/optimism_logo.png";
import scroll from "../assets/scroll.png";
import Arbitrum from "../assets/Arbitrum.png";
import { MyNewRegistrar, ENSRegistry } from "../utils/contractAddresses";
import { ensABI } from "../service/ensABI";
import { ethers, utils } from "ethers";
import { registrarABI } from "../service/registrarABI";

const namehash = require("eth-ens-namehash");

const TransactionCard = () => {
  const [name, setName] = useState("");

  const { refetch } = useContractRead({
    address: ENSRegistry,
    abi: ensABI,
    functionName: "owner",
    args: [namehash.hash(name + ".uni")],
  });
  const handleSend = async () => {
    const res = await refetch();
    const stringRes = res.data?.toString();
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-white font-poppins text-2xl  mb-8 tracking-widest">
        Make a transaction
      </h1>
      <div className="flex flex-row">
        <input
          className="bg-transparent border border-t-0 border-l-0 border-r-0 focus:outline-none text-white tracking-wide"
          onChange={(e) => setName(e.target.value)}
          placeholder="Search name"
          value={name}
        ></input>
        <p className="text-white mx-3 translate-y-1/4 text-2xl font-semibold">
          .uni
        </p>
      </div>{" "}
      <button
        className="font-poppins text-white bg-gradient-to-br from-violet-700 to-blue-300 hover:bg-gradient-to-bl  dark:focus:ring-blue-600 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-5  mb-2"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};

export default TransactionCard;
