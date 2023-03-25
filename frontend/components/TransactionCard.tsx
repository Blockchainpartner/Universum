import React, { useState, useEffect, CSSProperties } from "react";
import { useSnackbar } from "notistack";
import { useDebounce } from "use-debounce";
import { usePrepareSendTransaction, useSendTransaction } from "wagmi";
import { useContractRead, useAccount, useWaitForTransaction } from "wagmi";
import { ENSRegistrytestnet } from "../utils/contractAddresses";
import { ensABI } from "../service/ensABI";
import { utils } from "ethers";
import { PropagateLoader } from "react-spinners";

const override: CSSProperties = {
  margin: "10px 0 15px 0",
};
const namehash = require("eth-ens-namehash");

const TransactionCard = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  const [debouncedTo] = useDebounce(address, 500);
  const [debouncedAmount] = useDebounce(amount, 500);
  const { isDisconnected } = useAccount();

  const { enqueueSnackbar } = useSnackbar();

  const { config } = usePrepareSendTransaction({
    request: {
      to: debouncedTo ? debouncedTo : "",
      value: debouncedAmount ? utils.parseEther(debouncedAmount) : undefined,
    },
  });
  const { data, sendTransaction } = useSendTransaction(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isLoading]);
  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar("Transaction sent successfully", {
        variant: "success",
      });
    }
  }, [isSuccess]);

  const { refetch } = useContractRead({
    address: ENSRegistrytestnet,
    abi: ensABI,
    functionName: "owner",
    args: [namehash.hash(name + ".uni")],
  });

  const handleSend = async () => {
    const res = await refetch();
    const stringRes = res.data?.toString();
    //setTimeout(() => {  console.log("World!"); }, 5000);
    if (stringRes) {
      console.log(stringRes);
      setAddress(stringRes);
      sendTransaction?.();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-white font-poppins text-2xl  mb-8 tracking-widest">
        Make a transaction
      </h1>
      <div className="flex flex-row">
        <input
          className="bg-transparent border border-t-0 border-l-0 border-r-0 focus:outline-none text-white tracking-wide"
          disabled={isDisconnected}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          value={name}
        ></input>
        <p className="text-white mx-3 translate-y-1/4 text-2xl font-semibold">
          .uni
        </p>
      </div>{" "}
      <input
        className="mt-5 w-full bg-transparent border border-t-0 border-l-0 border-r-0 focus:outline-none text-white tracking-wide"
        disabled={isDisconnected}
        pattern="[0-9]*\.?[0-9]*"
        onChange={(e) => {
          setAmount(e.target.value);
        }}
        placeholder="Amount"
        value={amount}
      ></input>
      <button
        className="font-poppins text-white bg-gradient-to-br from-violet-700 to-blue-300 hover:bg-gradient-to-bl  dark:focus:ring-blue-600 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-5  mb-2"
        disabled={isDisconnected}
        onClick={handleSend}
      >
        Send
      </button>
      <PropagateLoader
        cssOverride={override}
        color={"#93c5fd"}
        loading={loading}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      {loading && (
        <p className="mt-2 ml-4 text-blue-300  font-poppins text-sm text-center">
          Sending transaction
        </p>
      )}
      {isDisconnected && (
        <p className="mt-4 font-semibold text-transparent bg-clip-text bg-gradient-to-br from-violet-700 to-blue-300">
          {" "}
          Please connect your wallet{" "}
        </p>
      )}
    </div>
  );
};

export default TransactionCard;
