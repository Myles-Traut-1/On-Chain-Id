"use client";

import { usePublicClient } from "wagmi";
import { useCallback, useState, useEffect } from "react";
import { constants } from "../constants/constants";
import { useErrorHandler } from "./useErrorHandler";

import { factoryAbi } from "../constants/abis/factoryAbi";

export function useIdentity(address?: string) {
  const publicClient = usePublicClient();
  const [identity, setIdentity] = useState<string>("");
  const [linkedWallets, setLinkedWallets] = useState<`0x${string}`[]>([]);
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
        functionName: "getIdentity",
        args: [address as `0x{string}`],
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

  const fetchWallets = useCallback(
    async (identityAddress: string) => {
      if (!publicClient || !identityAddress) {
        setLinkedWallets([]);
        return null;
      }

      try {
        clearError();
        const linkedWalletsArray = await publicClient.readContract({
          address: constants.idFactory,
          abi: factoryAbi,
          functionName: "getWallets",
          args: [identityAddress as `0x{string}`],
        });

        setLinkedWallets(linkedWalletsArray as `0x${string}`[]);
        return linkedWalletsArray as `0x${string}`[];
      } catch (err) {
        handleError(err);
        setLinkedWallets([]);
        throw err;
      }
    },
    [publicClient, handleError, clearError],
  );

  useEffect(() => {
    void fetchIdentity();
  }, [fetchIdentity]);

  useEffect(() => {
    if (!identity) {
      setLinkedWallets([]);
      return;
    }

    void fetchWallets(identity);
  }, [identity, fetchWallets]);

  return {
    identity,
    linkedWallets,
    loading,
    error,
    refetch: fetchIdentity,
    refetchWallets: fetchWallets,
  };
}
