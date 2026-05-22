'use client';

import DeployId from "../components/DeployId";
import GetId from "../components/GetId";
import { useAccount } from "wagmi";

export default function Home() {

  const { isConnected } = useAccount();
  return (

    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to On-Chain ID</h1>
      {!isConnected ? (
        <p className="text-white">Please connect your wallet to deploy your identity.</p>
      ) : (
        <>
          <DeployId />
          <GetId />
        </>
      )}

    </div>
  );
}
