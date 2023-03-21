import React, { PropsWithChildren } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import headerImg from "../assets/astro.svg";
import Image from "next/image";

import "animate.css";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="h-screen bg-hero">
      <div className="flex justify-end p-4">
        <ConnectButton />
      </div>

      {children}

      <div className=" -translate-y-1/2  flex justify-end  ">
        <div className={"animate__animated animate__zoomIn"}>
          <Image src={headerImg} alt="Header Img" width={300} height={300} />
        </div>
      </div>
      <p className="absolute bottom-0 text-center text-white w-full">
        Made with ❤️ by your frens at Blockchain Partner
      </p>
    </div>
  );
};
export default Layout;
