'use client';

import { usePublicClient, useWalletClient, useAccount } from "wagmi";
import { IdentitySDK } from "@onchain-id/identity-sdk";
import { ethers } from "ethers";
import { useState } from "react";

import { constants } from "../constants";


export function useDeployIdentity() {
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();
    const { address } = useAccount();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const deployIdentity = async () => {
        if (!publicClient || !walletClient || !address) {
            throw new Error("Wallet not connected");
        }

        try {
            setLoading(true);
            setError(null);

            // Create a combined provider that uses wallet for writes and public client for reads
            const combinedProvider: any = {
                request: async (args: { method: string; params?: any[] }) => {
                    // Use wallet client for write operations
                    if (
                        args.method === 'eth_sendTransaction' ||
                        args.method === 'eth_signTransaction' ||
                        args.method === 'personal_sign' ||
                        args.method === 'eth_sign'
                    ) {
                        return (walletClient as any).request({
                            method: args.method,
                            params: args.params ?? [],
                        });
                    }
                    // Use public client for read operations
                    return (publicClient as any).request({
                        method: args.method,
                        params: args.params ?? [],
                    });
                },
            };

            // Create ethers provider
            const provider = new ethers.providers.Web3Provider(
                combinedProvider,
                {
                    chainId: publicClient.chain.id,
                    name: publicClient.chain.name,
                }
            );

            const signer = provider.getSigner(address);

            // Deploy identity
            const identity = await IdentitySDK.Identity.deployNew(
                {
                    managementKey: address,
                    implementationAuthority: constants.implementationAuthority,
                },
                { signer }
            );

            await identity.deployed();

            return identity.address as `0x${string}`;

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
