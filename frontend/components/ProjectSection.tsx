import React, { useState } from "react";
import RegistrationCard from "./RegistrationCard";
import Description from "./Description";
import TransactionCard from "./TransactionCard";
const ProjectSection = () => {
  const [transactionCard, setTransactionCard] = useState(false);
  return (
    <div className="flex justify-center items-center mt-20 text-lg">
      <div className="container h-auto py-5 w-1/3 bg-white bg-opacity-10 rounded-2xl shadow-2xl relative z-2 border border-opacity-20 border-r-0 border-b-0 backdrop-filter backdrop-blur-sm">
        <div className="h-full flex flex-col justify-evenly mb-5 items-center">
          {transactionCard ? <TransactionCard /> : <RegistrationCard />}
          <button
            className="font-poppins text-white bg-gradient-to-br from-violet-700 to-blue-300 hover:bg-gradient-to-bl  dark:focus:ring-blue-600 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-5  mb-2"
            onClick={() => {
              setTransactionCard(!transactionCard);
            }}
          >
            {!transactionCard ? "Send transaction" : "Register name"}
          </button>
        </div>
      </div>
      <Description />
    </div>
  );
};

export default ProjectSection;
