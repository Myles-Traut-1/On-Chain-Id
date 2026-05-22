'use client';

import { usePublicClient, useAccount } from "wagmi";
import { constants, factoryAbi } from "../constants";

export async function useGetIdentity() {
    const publicClient = usePublicClient();
    const { address } = useAccount();

    if (!publicClient || !address) {
        throw new Error("Wallet not connected");
    }

    const identityAddr = await publicClient.readContract({
        address: constants.idFactory,
        abi: factoryAbi,
        functionName: 'getIdentity',
        args: [address],
    });

    return identityAddr as `0x${string}`;
}