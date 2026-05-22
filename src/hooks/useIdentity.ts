'use client';

import { usePublicClient } from "wagmi";
import { useCallback, useState, useEffect } from "react";
import { constants, factoryAbi } from "../constants";

export function useIdentity(address?: string) {
    const publicClient = usePublicClient();
    const [identity, setIdentity] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchIdentity = useCallback(async () => {
        if (!publicClient || !address) {
            setIdentity("");
            setLoading(false);
            return null;
        }

        try {
            setLoading(true);
            setError(null);

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
            const errorMessage = err instanceof Error
                ? err.message
                : 'Failed to fetch identity';
            setError(errorMessage);
            setIdentity("");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [publicClient, address]);

    // Auto-fetch on address/publicClient change
    useEffect(() => {
        fetchIdentity();
    }, [fetchIdentity]);

    return { identity, loading, error, refetch: fetchIdentity };
}