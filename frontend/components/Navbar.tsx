import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import logo from "../assets/logo.png";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="bg-transparent">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center mt-3">
              <Image
                className={""}
                src={logo}
                alt="Header Img"
                width={280}
                height={70}
              />
            </div>
            <a
              href="#"
              className=" mt-8 ml-5  font-extrabold text-transparent text-xl bg-clip-text bg-gradient-to-r from-violet-700 to-blue-300"
            >
              How it works
            </a>
            <a
              href="#"
              className=" mt-8 ml-5  font-extrabold text-transparent text-xl bg-clip-text bg-gradient-to-r from-violet-700 to-blue-300"
            >
              About
            </a>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="relative ml-3 ">
              <div>
                <ConnectButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
