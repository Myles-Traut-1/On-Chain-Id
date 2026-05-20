'use client';

import { useDeployIdentity } from "../hooks/useDeployIdentity";
import { useAccount } from "wagmi";
import { useState } from "react";

export default function DeployId() {
    const { address, isConnected } = useAccount();
    const { deployIdentity, loading, error } = useDeployIdentity();
    const [deployedAddress, setDeployedAddress] = useState<`0x${string}` | null>(null);

    const handleDeployIdentity = async () => {
        try {
            const deployedIdAddress = await deployIdentity();
            setDeployedAddress(deployedIdAddress);
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
                    <p className="text-sm text-gray-600">Deployed Address: {deployedAddress}</p>
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

