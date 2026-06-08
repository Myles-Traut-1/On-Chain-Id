import { isAddress } from 'viem';
import { addressZero } from "../constants/constants";

import type { UsePublicClientReturnType } from "wagmi"

interface ValidationResult {
    valid: boolean;
    error?: Error;
}

export function validateWalletAndClient(walletAddress: string, publicClient: UsePublicClientReturnType): ValidationResult {
    if (!walletAddress) {
        const err = new Error("Wallet address is required");
        return { valid: false, error: err };
    }

    if (!publicClient) {
        const err = new Error("Public client is not available");
        return { valid: false, error: err };
    }

    return { valid: true };
}

export function validateAddress(walletAddress: string): ValidationResult {

    if (!isAddress(walletAddress)) {
        const err = new Error("Invalid wallet address");
        return { valid: false, error: err };
    }

    if (walletAddress === addressZero) {
        const err = new Error("LinkWallet__Zero address");
        return { valid: false, error: err };
    }

    return { valid: true };
}