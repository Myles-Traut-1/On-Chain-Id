'use client';

import { usePublicClient, useAccount } from "wagmi";
import { IdentitySDK } from "@onchain-id/identity-sdk";
import { useState } from "react";
import { useEthersSigner } from "./useEthersSigner";
import { useIdentity } from "./useIdentity";
import { constants } from "../constants";

export function useDeployIdentity() {
    const publicClient = usePublicClient();
    const { address } = useAccount();
    const signer = useEthersSigner();
    const { refetch: refetchIdentity } = useIdentity(address);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const deployIdentity = async () => {
        const provider = signer?.provider;

        if (!publicClient || !address || !provider) {
            throw new Error("Wallet not connected");
        }

        try {
            setLoading(true);
            setError(null);

            const tx = await IdentitySDK.Identity.deployUsingGatewayForWallet({
                gateway: constants.gateway,
                identityOwner: address,
            }, { signer });

            await tx.wait();

            const identityAddr = await refetchIdentity();
            return identityAddr as `0x${string}`;
        }

        catch (err) {
            const error = err instanceof Error ? err : new Error('Deployment failed');
            setError(error);
            throw error;

        } finally {
            setLoading(false);
        }
    }

    return { deployIdentity, loading, error };
}
