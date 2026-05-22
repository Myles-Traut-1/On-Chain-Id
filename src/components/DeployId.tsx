'use client';

import { useDeployIdentity } from "../hooks/useDeployIdentity";
import { IdentitySDK } from "@onchain-id/identity-sdk";
import { useAccount } from "wagmi";
import { useEffect, useMemo, useState } from "react";
import { constants } from "../constants";
import { ethers } from "ethers";

export default function DeployId() {
    const { address, isConnected } = useAccount();
    const { deployIdentity, loading, error } = useDeployIdentity();
    const [deployedAddress, setDeployedAddress] = useState<`0x${string}` | null>(null);
    const [expectedAddress, setExpectedAddress] = useState<`0x${string}` | null>(null);


    const handleDeployIdentity = async () => {
        try {
            const deployedAddress = await deployIdentity();
            setDeployedAddress(deployedAddress as `0x${string}`);
        }
        catch (err) {
            console.error('Failed To Deploy Identity:', err);
        }
    }

    return (
        <div className="p-4 border rounded">
            {deployedAddress ? (
                <div>
                    <p className="mb-2">Identity Deployed Successfully!</p>
                    <p className="text-sm text-white">Deployed Address: {deployedAddress}</p>
                </div>
            ) : (
                <button
                    onClick={handleDeployIdentity}
                    disabled={!isConnected || loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
                >
                    {loading ? "Deploying..." : "Deploy Identity"}
                </button>
            )}
            {error && <p className="mt-2 text-red-600">Error: {error.message}</p>}
        </div>
    )
}

