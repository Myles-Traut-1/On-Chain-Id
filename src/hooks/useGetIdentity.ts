'use client';

import { usePublicClient } from "wagmi";
import { constants, factoryAbi } from "../constants";

export function useGetIdentity(address?: string) {
    const publicClient = usePublicClient();

    const getIdentity = async () => {
        if (!publicClient || !address) return null;

        return publicClient.readContract({
            address: constants.idFactory,
            abi: factoryAbi,
            functionName: 'getIdentity',
            args: [address],
        });
    };

    return { getIdentity };
}