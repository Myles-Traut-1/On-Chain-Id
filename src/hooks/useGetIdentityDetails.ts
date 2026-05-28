'use client';

import { ethers } from "ethers";
import { useEthersProvider } from "./useEthers";
import { useEffect, useState } from "react";

import { Identity, IdentitySDK } from "@onchain-id/identity-sdk";

export function useGetIdentityDetails(userAddress?: string, idAddress?: string) {
    const [keys, setKeys] = useState([] as any[]);
    const [verified, setVerified] = useState(false);

    const provider = useEthersProvider();

    const verifyIdentity = (keys: any[], hashedAddress: string): boolean => {
        for (const key of keys) {
            if (key.key === hashedAddress) {
                console.log("The identity has been instantiated. We verified the wallet used is a manager of the identity.");
                return true;
            }
        }
        return false;
    }

    useEffect(() => {
        const getIdentityDetails = async () => {
            if (!provider || !idAddress || !userAddress) {
                setKeys([]);
                setVerified(false);
                return null;
            };

            if (idAddress === ethers.constants.AddressZero) {
                console.log("No identity found for this address.");
                setKeys([]);
                setVerified(false);
                return null;
            }

            const identity = await Identity.at(idAddress, { provider });

            const keys = await identity.getKeysByPurpose(
                IdentitySDK.utils.enums.KeyPurpose.MANAGEMENT
            );

            const hashedAddress = IdentitySDK.utils.encodeAndHash(["address"], [userAddress]);

            const isManager: boolean = verifyIdentity(keys, hashedAddress);

            setKeys(keys);
            console.log("Identity Keys:", keys);
            setVerified(isManager);
        }

        getIdentityDetails();

    }, [provider, idAddress, userAddress]);

    return { keys, verified };
}