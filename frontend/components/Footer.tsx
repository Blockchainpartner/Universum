import React from "react";
import Image from "next/image";
import headerImg from "../assets/astro.svg";

const Footer = () => {
  return (
    <>
      <div className="-translate-y-1/2 -translate-x-7">
        <div className={"  flex justify-end animate-waving-hand   "}>
          <Image
            className={""}
            src={headerImg}
            alt="Header Img"
            width={300}
            height={300}
          />
        </div>
      </div>
      <p className="absolute bottom-0 text-center text-white w-full">
        Made with ❤️ by your frens at Blockchain Partner
      </p>
    </>
  );
};

export default Footer;
