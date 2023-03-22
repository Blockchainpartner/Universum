import React, { PropsWithChildren } from "react";
import "animate.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="h-screen bg-hero">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};
export default Layout;
