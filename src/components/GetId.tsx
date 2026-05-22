'use client';

import { useState } from "react";

import { usePublicClient, useAccount } from "wagmi";
import { constants, factoryAbi } from "../constants";


export default function handleGetId() {
    const [identityAddress, setIdentityAddress] = useState<`0x${string}` | null>(null);
    const [error, setError] = useState<string | null>(null);
    const publicClient = usePublicClient();
    const { address } = useAccount();

    const handleGetIdentity = async () => {
        if (!publicClient || !address) {
            throw new Error("Wallet not connected");
        }
        try {
            const identityAddr = await publicClient.readContract({
                address: constants.idFactory,
                abi: factoryAbi,
                functionName: 'getIdentity',
                args: [address],
            });

            setIdentityAddress(identityAddr as `0x${string}`);

        } catch (err) {
            console.error('Failed To Get Identity:', err);
            setError((err as Error).message);
        }
    }

    return (
        <div className="p-4 border rounded">
            <button
                onClick={handleGetIdentity}
                className="px-4 py-2 bg-green-600 text-white rounded"
            >
                Get My Identity
            </button>
            {identityAddress && (
                <p className="mt-2 text-sm text-white">My Identity Address: {identityAddress}</p>
            )}
            {error && <p className="mt-2 text-red-600">Error: {error}</p>}
        </div>
    )
}