// import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from "next";
import Head from "next/head";
import ProjectSection from "../components/ProjectSection";

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Universum</title>
        <meta content="Universum app" name="Universum" />
        <link href="/favicon.ico" rel="icon" />
        <link
          href="https://fonts.googleapis.com/css?family=Poppins"
          rel="stylesheet"
        ></link>
      </Head>

      <ProjectSection />
    </div>
  );
};

export default Home;
