'use client';

import { usePublicClient, useAccount } from "wagmi";
import { IdentitySDK } from "@onchain-id/identity-sdk";
import { useState } from "react";
import { useEthersSigner } from "./useEthers";
import { useIdentity } from "./useIdentity";
import { constants } from "../constants";
import { useErrorHandler } from "./useErrorHandler";


export function useDeployIdentity() {
    const publicClient = usePublicClient();
    const { address } = useAccount();
    const signer = useEthersSigner();
    const { refetch: refetchIdentity } = useIdentity(address);

    const [loading, setLoading] = useState<boolean>(false);
    const { error, handleError, clearError } = useErrorHandler();

    const deployIdentity = async () => {
        const provider = signer?.provider;

        if (!publicClient || !address || !provider) {
            const err = new Error("Wallet not connected");
            handleError(err);
            throw err;
        }

        try {
            setLoading(true);
            clearError();

            const tx = await IdentitySDK.Identity.deployUsingGatewayForWallet({
                gateway: constants.gateway,
                identityOwner: address,
            }, { signer });

            await tx.wait();

            const identityAddr = await refetchIdentity();
            return identityAddr as `0x${string}`;
        }

        catch (err: unknown) {
            handleError(err);
            throw err;

        } finally {
            setLoading(false);
        }
    }

    return { deployIdentity, loading, error };
}
