import React from "react";
import Image from "next/image";
import headerImg from "../assets/astro.svg";

const Footer = () => {
  return (
    <>
      <div className="box-content -translate-y-44 w-1/2  translate-x-full">
        <div className={"flex justify-end animate-waving-hand "}>
          <Image
            className={""}
            src={headerImg}
            alt="Header Img"
            width={300}
            height={300}
          />
        </div>
      </div>
    </>
  );
};

export default Footer;
