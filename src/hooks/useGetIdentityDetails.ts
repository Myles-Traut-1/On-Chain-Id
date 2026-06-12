"use client";

import { ethers } from "ethers";
import { useEthersProvider } from "./useEthers";
import { useEffect, useState, useCallback } from "react";
import { useErrorHandler } from "./useErrorHandler";

import { Identity, IdentitySDK } from "@onchain-id/identity-sdk";
import { type Key } from "@onchain-id/identity-sdk/dist/identity/Key.interface";

export function useGetIdentityDetails(
  userAddress?: string,
  idAddress?: string,
) {
  const [managementKeys, setManagementKeys] = useState([] as Key[]);
  const [verified, setVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { error, handleError, clearError } = useErrorHandler();
  const provider = useEthersProvider();

  const verifyIdentity = (keys: Key[], hashedAddress: string): boolean => {
    for (const key of keys) {
      if (key.key === hashedAddress) {
        return true;
      }
    }
    return false;
  };

  const getIdentityDetails = useCallback(async () => {
    if (
      !provider ||
      !idAddress ||
      !userAddress ||
      idAddress === ethers.constants.AddressZero
    ) {
      setManagementKeys([]);
      setVerified(false);
      return null;
    }

    try {
      clearError();
      setLoading(true);

      const identity = await Identity.at(idAddress, { provider });

      const managementKeys = await identity.getKeysByPurpose(
        IdentitySDK.utils.enums.KeyPurpose.MANAGEMENT,
      );

      const hashedAddress = IdentitySDK.utils.encodeAndHash(
        ["address"],
        [userAddress],
      );

      const isManager: boolean = verifyIdentity(managementKeys, hashedAddress);

      // setManagementKeys(managementKeys);
      setVerified(isManager);
    } catch (err) {
      handleError(err);
      setManagementKeys([]);
      setVerified(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [provider, idAddress, userAddress, clearError, handleError]);

  const getManagementKeys = useCallback(async () => {
    if (!provider || !idAddress || idAddress === ethers.constants.AddressZero) {
      setManagementKeys([]);
      return null;
    }

    try {
      clearError();
      setLoading(true);

      const identity = await Identity.at(idAddress, { provider });

      const managementKeys = await identity.getKeysByPurpose(
        IdentitySDK.utils.enums.KeyPurpose.MANAGEMENT,
      );

      setManagementKeys(managementKeys);
    } catch (err) {
      handleError(err);
      setManagementKeys([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [provider, idAddress, clearError, handleError]);

  useEffect(() => {
    const run = async () => {
      await getIdentityDetails();
      await getManagementKeys();
    };
    run();
  }, [getIdentityDetails]);

  return {
    managementKeys,
    verified,
    loading,
    error,
    getIdentityDetails,
    getManagementKeys,
  };
}
