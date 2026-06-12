import { identityAbi } from "../constants/abis/identityAbi";
import { factoryAbi } from "../constants/abis/factoryAbi";
import { constants } from "../constants/constants";
import {
  useWriteContract,
  usePublicClient,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useState, useEffect } from "react";
import { validateAddress, validateWalletAndClient } from "../utils/utils";
import { useErrorHandler } from "./useErrorHandler";

import { IdentitySDK } from "@onchain-id/identity-sdk";
import {
  type KeyPurpose,
  type KeyType,
} from "@onchain-id/identity-sdk/dist/identity/Key.interface";

import type {
  UsePublicClientReturnType,
  UseWaitForTransactionReceiptReturnType,
} from "wagmi";

export function useManageKeys(
  onKeyAdded?: () => void,
  onKeyRemoved?: () => void,
) {
  const publicClient: UsePublicClientReturnType = usePublicClient();
  const { error, handleError, clearError } = useErrorHandler();
  const { writeContractAsync } = useWriteContract();

  const [loading, setLoading] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const [pendingOp, setPendingOp] = useState<"addKey" | "removeKey" | null>(
    null,
  );

  const managementKeyPurpose: KeyPurpose.MANAGEMENT =
    IdentitySDK.utils.enums.KeyPurpose.MANAGEMENT;
  const ECDSA_TYPE: KeyType.ECDSA = IdentitySDK.utils.enums.KeyType.ECDSA;

  const receipt: UseWaitForTransactionReceiptReturnType =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  useEffect(() => {
    const isCurrentReceipt =
      !!txHash && receipt.data?.transactionHash === txHash;

    if (isCurrentReceipt && receipt.status === "success") {
      setLoading(false);
      setTxHash(undefined);
    }

    if (isCurrentReceipt && receipt.status === "error") {
      handleError(receipt.error);
      setLoading(false);
      setPendingOp(null);
      setTxHash(undefined);
    }
  }, [txHash, receipt.status, receipt.data, receipt.error, handleError]);

  useEffect(() => {
    if (pendingOp === "addKey") {
      onKeyAdded?.();
    }
    if (pendingOp === "removeKey") {
      onKeyRemoved?.();
    }
  }, [pendingOp, onKeyAdded, onKeyRemoved]);

  const addManagementKey = async (idAddress: string, keyAddress: string) => {
    const { valid: walletAndClientValid, error: walletAndClientError } =
      validateWalletAndClient(keyAddress, publicClient);

    if (!walletAndClientValid) {
      handleError(walletAndClientError);
      throw walletAndClientError;
    }

    const { valid, error: validationError } = validateAddress(keyAddress);
    if (!valid) {
      handleError(validationError);
      throw validationError;
    }

    clearError();
    setLoading(true);

    try {
      const wallets: readonly `0x${string}`[] | undefined =
        await publicClient?.readContract({
          address: constants.idFactory,
          abi: factoryAbi,
          functionName: "getWallets",
          args: [idAddress as `0x{string}`],
        });

      if (!wallets?.includes(keyAddress as `0x{string}`)) {
        const err = new Error("Link Wallet First.");
        handleError(err);
        setLoading(false);
        return;
      }

      const key = IdentitySDK.utils.encodeAndHash(["address"], [keyAddress]);

      const tx = await writeContractAsync({
        address: idAddress as `0x${string}`,
        abi: identityAbi,
        functionName: "addKey",
        args: [
          key as `0x${string}`,
          BigInt(managementKeyPurpose),
          BigInt(ECDSA_TYPE),
        ],
      });
      setTxHash(tx);
      setPendingOp("addKey");
    } catch (err) {
      handleError(err);
      setLoading(false);
      throw err;
    }
  };

  const removeManagementKey = async (idAddress: string, key: `0x{string}`) => {
    clearError();
    setLoading(true);

    try {
      const tx = await writeContractAsync({
        address: idAddress as `0x${string}`,
        abi: identityAbi,
        functionName: "removeKey",
        args: [key as `0x${string}`, BigInt(managementKeyPurpose)],
      });
      setTxHash(tx);
      setPendingOp("removeKey");
    } catch (err) {
      handleError(err);
      setLoading(false);
      throw err;
    }
  };

  return {
    addManagementKey,
    removeManagementKey,
    loading,
    error,
    txHash,
    receipt: receipt.data,
    isConfirming: receipt.status === "pending",
    isConfirmed: receipt.status === "success",
  };
}
