'use client';

import { usePublicClient, useWalletClient, useAccount } from "wagmi";
import { Identity, IdentitySDK } from "@onchain-id/identity-sdk";
import { ethers, providers } from 'ethers'
import { useState, useMemo } from "react";
import type { Account, Chain, Client, Transport } from 'viem'
import { type Config, useConnectorClient, useWatchContractEvent } from 'wagmi'

import { constants, factoryAbi } from "../constants";

export function clientToSigner(client: Client<Transport, Chain, Account>) {
    const { account, chain, transport } = client
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    }
    const provider = new providers.Web3Provider(transport, network)
    const signer = provider.getSigner(account.address)
    return signer
}

export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
    const { data: client } = useConnectorClient<Config>({ chainId })
    return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
}


export function useDeployIdentity() {
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();
    const { address } = useAccount();
    const signer = useEthersSigner();

    const [loading, setLoading] = useState(false);
    const [deployedAddress, setDeployedAddress] = useState<`0x${string}` | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const deployIdentity = async () => {
        const provider = signer?.provider;

        if (!publicClient || !walletClient || !address || !provider) {
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

            const identityAddr = await publicClient.readContract({
                address: constants.idFactory,
                abi: factoryAbi,
                functionName: 'getIdentity', // Or whatever method your factory has
                args: [address],
            });

            setDeployedAddress(identityAddr as `0x${string}`);
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
