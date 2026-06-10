import { identityAbi } from "../constants/abis/identityAbi";
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

export function useManageKeys() {
  const publicClient: UsePublicClientReturnType = usePublicClient();
  const { error, handleError, clearError } = useErrorHandler();
  const { writeContractAsync } = useWriteContract();

  const [loading, setLoading] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

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

    if (
      isCurrentReceipt &&
      receipt.isSuccess &&
      receipt.data?.status === "success"
    ) {
      setLoading(false);
      setTxHash(undefined);
    }

    if (isCurrentReceipt && receipt.isError) {
      handleError(receipt.error);
      setLoading(false);
      setTxHash(undefined);
    }
  }, [
    txHash,
    receipt.isSuccess,
    receipt.isError,
    receipt.data,
    receipt.error,
    handleError,
  ]);

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

    try {
      setLoading(true);
      clearError();

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
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  return {
    addManagementKey,
    loading,
    error,
    txHash,
    receipt: receipt.data,
    isConfirming: receipt.isLoading,
    isConfirmed: receipt.isSuccess,
  };
}
