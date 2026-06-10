'use client';

import { useErrorHandler } from "../hooks/useErrorHandler";
import { constants } from "../constants/constants";
import factoryAbi from "../constants/abis/factoryAbi.json";
import { useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import { useState, useEffect } from "react";
import { addressZero } from "../constants/constants";
import { validateAddress, validateWalletAndClient } from "../utils/utils";

import type { UsePublicClientReturnType, UseWaitForTransactionReceiptReturnType } from "wagmi"


export function useManageWallet(onLinked?: () => void, onUnlinked?: () => void) {
    const publicClient: UsePublicClientReturnType = usePublicClient();
    const { writeContractAsync } = useWriteContract();
    const { error, handleError, clearError } = useErrorHandler();

    const [loading, setLoading] = useState<boolean>(false);
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined)
    const [pendingOp, setPendingOp] = useState<'link' | 'unlink' | null>(null)

    const receipt: UseWaitForTransactionReceiptReturnType = useWaitForTransactionReceipt({
        hash: txHash
    });

    useEffect(() => {
        const isCurrentReceipt = !!txHash && receipt.data?.transactionHash === txHash;

        if (isCurrentReceipt && receipt.isSuccess && receipt.data?.status === "success") {
            setLoading(false);
            if (pendingOp === 'link') {
                onLinked?.();
                setPendingOp(null);
            } else if (pendingOp === 'unlink') {
                onUnlinked?.();
                setPendingOp(null);
            }

            setTxHash(undefined);
        }

        if (isCurrentReceipt && receipt.isError) {
            handleError(receipt.error);
            setLoading(false);
            setPendingOp(null);
            setTxHash(undefined);
        }
    }, [txHash, receipt.isSuccess, receipt.isError, receipt.data, receipt.error, handleError, onLinked, onUnlinked, pendingOp]);

    const linkWallet = async (walletAddress: string) => {
        const { valid: walletAndClientValid, error: walletAndClientError } = validateWalletAndClient(walletAddress, publicClient);
        if (!walletAndClientValid) {
            handleError(walletAndClientError);
            throw walletAndClientError;
        }

        const { valid, error: validationError } = validateAddress(walletAddress);
        if (!valid) {
            handleError(validationError);
            throw validationError;
        }


        const identityAddr = await publicClient!.readContract({
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
            setTxHash(undefined);

            const txHash = await writeContractAsync({
                address: constants.idFactory,
                abi: factoryAbi,
                functionName: 'linkWallet',
                args: [walletAddress],
            });

            setTxHash(txHash);
            setPendingOp('link');

        } catch (err) {
            setLoading(false);
            handleError(err);
            throw err;
        }

    };

    const unlinkWallet = async (walletAddress: string) => {
        const { valid: walletAndClientValid, error: walletAndClientError } = validateWalletAndClient(walletAddress, publicClient);
        if (!walletAndClientValid) {
            handleError(walletAndClientError);
            throw walletAndClientError;
        }


        const { valid, error: validationError } = validateAddress(walletAddress);
        if (!valid) {
            handleError(validationError);
            throw validationError;
        }

        try {
            clearError();
            setLoading(true);
            setTxHash(undefined);

            const txHash = await writeContractAsync({
                address: constants.idFactory,
                abi: factoryAbi,
                functionName: 'unlinkWallet',
                args: [walletAddress],
            });

            setTxHash(txHash);
            setPendingOp('unlink');

        } catch (err) {
            setLoading(false);
            handleError(err);
            throw err;
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