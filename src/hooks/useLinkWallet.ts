'use client';

import { useErrorHandler } from "../hooks/useErrorHandler";
import { constants, factoryAbi } from "../constants";
import { useWriteContract } from "wagmi";
import { useState } from "react";

export function useLinkWallet() {
    const { writeContract } = useWriteContract();
    const { error, handleError, clearError } = useErrorHandler();
    const [loading, setLoading] = useState(false);

    const linkWallet = async (walletAddress: string) => {
        if (!walletAddress) {
            const err = new Error("Wallet address is required");
            handleError(err);
            throw err;
        }

        try {
            clearError();
            setLoading(true);
            await writeContract({
                address: constants.idFactory,
                abi: factoryAbi,
                functionName: 'linkWallet',
                args: [walletAddress],
            });
        } catch (err) {
            handleError(err);
            throw err;
        } finally {
            setLoading(false);
        }

    }

    return { linkWallet, loading, error };
}