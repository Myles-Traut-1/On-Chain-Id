'use client';

import { useErrorHandler } from "../hooks/useErrorHandler";
import { constants, factoryAbi } from "../constants";
import { useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import { useState, useEffect } from "react";
import { addressZero } from "../constants";
import { isAddress } from 'viem';

export function useLinkWallet(onLinked?: () => void, onUnlinked?: () => void) {
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();
    const { error, handleError, clearError } = useErrorHandler();
    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined)

    const receipt = useWaitForTransactionReceipt({
        hash: txHash
    });

    useEffect(() => {
        if (receipt.isSuccess && receipt.data?.status === "success") {
            setLoading(false);
            if (onLinked) {
                onLinked();
            }
            if (onUnlinked) {
                onUnlinked();
            }
        }

        if (receipt.isError) {
            handleError(receipt.error);
            setLoading(false);
        }
    }, [receipt.isSuccess, receipt.isError, receipt.data, receipt.error, handleError, onLinked, onUnlinked]);

    const linkWallet = async (walletAddress: string) => {
        if (!walletAddress) {
            const err = new Error("Wallet address is required");
            handleError(err);
            throw err;
        }

        if (!publicClient) {
            const err = new Error("Public client is not available");
            handleError(err);
            throw err;
        }

        if (!isAddress(walletAddress)) {
            const err = new Error("Invalid wallet address");
            handleError(err);
            throw err;
        }

        if (walletAddress === addressZero) {
            const err = new Error("LinkeWallet__Zero address");
            handleError(err);
            throw err;
        }

        const identityAddr = await publicClient.readContract({
            address: constants.idFactory,
            abi: factoryAbi,
            functionName: 'getIdentity',
            args: [walletAddress],
        });

        if (identityAddr !== addressZero) {
            const err = new Error("Wallet Already Linked To An Identity.");
            handleError(err);
            throw err;
        }

        try {
            clearError();
            setLoading(true);
            const txHash = await writeContractAsync({
                address: constants.idFactory,
                abi: factoryAbi,
                functionName: 'linkWallet',
                args: [walletAddress],
            });

            setTxHash(txHash);

        } catch (err) {
            handleError(err);
            throw err;
        } finally {
            setLoading(false);
        }

    };

    const unlinkWallet = async (walletAddress: string) => {
        if (!walletAddress) {
            const err = new Error("Wallet address is required");
            handleError(err);
            throw err;
        }

        if (!publicClient) {
            const err = new Error("Public client is not available");
            handleError(err);
            throw err;
        }

        if (!isAddress(walletAddress)) {
            const err = new Error("Invalid wallet address");
            handleError(err);
            throw err;
        }

        if (walletAddress === addressZero) {
            const err = new Error("LinkeWallet__Zero address");
            handleError(err);
            throw err;
        }

        try {
            clearError();
            setLoading(true);
            const txHash = await writeContractAsync({
                address: constants.idFactory,
                abi: factoryAbi,
                functionName: 'unlinkWallet',
                args: [walletAddress],
            });

            setTxHash(txHash);

        } catch (err) {
            handleError(err);
            throw err;
        } finally {
            setLoading(false);
        }

    };

    return {
        linkWallet,
        unlinkWallet,
        loading: loading || receipt.isLoading,
        error,
        txHash,
        receipt: receipt.data,
        isConfirming: receipt.isLoading,
        isConfirmed: receipt.isSuccess
    };
}