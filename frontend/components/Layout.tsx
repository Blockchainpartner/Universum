import React, { PropsWithChildren } from "react";
import "animate.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { SnackbarProvider } from "notistack";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <SnackbarProvider
      maxSnack={1}
      autoHideDuration={2500}
      anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
    >
      <div className="h-screen bg-hero">
        <Navbar />
        {children}
        <Footer />
      </div>
    </SnackbarProvider>
  );
};
export default Layout;
