'use client';

import { usePublicClient } from "wagmi";
import { useCallback, useState, useEffect } from "react";
import { constants, factoryAbi } from "../constants";
import { useErrorHandler } from "./useErrorHandler";

export function useIdentity(address?: string) {
    const publicClient = usePublicClient();
    const [identity, setIdentity] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const { error, handleError, clearError } = useErrorHandler();

    const fetchIdentity = useCallback(async () => {
        if (!publicClient || !address) {
            setIdentity("");
            setLoading(false);
            return null;
        }

        try {
            setLoading(true);
            clearError();
            const identity = await publicClient.readContract({
                address: constants.idFactory,
                abi: factoryAbi,
                functionName: 'getIdentity',
                args: [address],
            });

            const identityStr = identity as string;
            setIdentity(identityStr);
            return identityStr;
        } catch (err) {
            handleError(err);
            setIdentity("");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [publicClient, address, handleError, clearError]);

    useEffect(() => {
        fetchIdentity();
    }, [fetchIdentity]);

    return { identity, loading, error, refetch: fetchIdentity };
}