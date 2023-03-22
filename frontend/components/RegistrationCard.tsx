import React from "react";
import ButtonSendTransaction from "./ButtonSendTransaction";

const RegistrationCard = () => {
  return (
    <div className="flex justify-center items-center mt-20 text-lg">
      <div className="container h-96 w-96 bg-white bg-opacity-10 rounded-2xl shadow-2xl relative z-2 border border-opacity-20 border-r-0 border-b-0 backdrop-filter backdrop-blur-sm">
        <div className="h-full flex flex-col justify-evenly items-center">
          <h1 className="text-white font-poppins text-2xl tracking-widest">
            Check name availability
          </h1>
          <ButtonSendTransaction />
        </div>
      </div>

      <div className="flex flex-col w-2/5 h-96 items-center justify-center m-10 pb-10">
        <h1 className="text-lg text-white font-bold">
          Buy your universal name
        </h1>
        <p className="p-4 text-white">
          Register now your universal name on every layer 2's currently
          available. No more different identity. Welcome to a cross-chain world.{" "}
        </p>
      </div>
    </div>
  );
};

export default RegistrationCard;
