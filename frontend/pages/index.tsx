// import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from "next";
import Head from "next/head";
import RegistrationCard from "../components/RegistrationCard";

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Universum</title>
        <meta content="Universum app" name="Universum" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <RegistrationCard />
    </div>
  );
};

export default Home;
