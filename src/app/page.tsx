'use client';

import DeployId from "../components/DeployId";
import { useAccount } from "wagmi";

export default function Home() {

  const { isConnected } = useAccount();
  return (

    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to On-Chain ID</h1>
      {!isConnected ? (
        <p className="text-gray-600">Please connect your wallet to deploy your identity.</p>
      ) : (
        <DeployId />
      )}

    </div>
  );
}
