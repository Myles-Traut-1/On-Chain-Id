'use client';

import DeployId from "../components/DeployId";
import { useAccount, usePublicClient } from "wagmi";
import { useEffect, useState } from "react";
import { addressZero, constants, factoryAbi } from "../constants";

export default function Home() {

  const [identity, setIdentity] = useState<string | null>(null);
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdentity = async () => {
      if (!publicClient || !address) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const identityAddr = await publicClient.readContract({
          address: constants.idFactory,
          abi: factoryAbi,
          functionName: 'getIdentity',
          args: [address],
        });

        setIdentity(identityAddr as string);

      } catch (err) {
        console.error('Failed To Get Identity:', err);
        setError((err as Error).message);
      }
      finally {
        setLoading(false);
      }
    }

    fetchIdentity();
  }, [publicClient, address]);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (

    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to On-Chain ID</h1>
      {!isConnected ? (
        <p className="text-white">Please connect your wallet to deploy your identity.</p>
      ) : (
        <>
          {identity === addressZero ? (
            <DeployId />
          ) : (
            <div className="p-4 border rounded">
              <p className="text-sm text-white">Identity Address: {identity}</p>
            </div>

          )
          }
        </>
      )
      }
    </div >
  );
}
