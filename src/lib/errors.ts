
export class Web3Error extends Error {
    constructor(
        message: string,
        public code: string,
        public userMessage: string
    ) {
        super(message);
        this.name = "Web3Error";
    }
}

export function parseWeb3Error(err: unknown): Web3Error {
    const error = err instanceof Error ? err : new Error(String(err));
    const message = error.message.toLowerCase();

    // User rejected tx
    if (
        message.includes("user rejected") ||
        message.includes('user denied') ||
        message.includes('user cancel') ||
        message.includes('rejected transaction')
    ) {
        return new Web3Error(
            error.message,
            "USER_REJECTED",
            "You rejected the transaction"
        );
    }

    // Network errors
    if (
        message.includes('network') ||
        message.includes('connection') ||
        message.includes('timeout')
    ) {
        return new Web3Error(
            error.message,
            'NETWORK_ERROR',
            'Network error occurred. Please check your connection and try again'
        );
    }

    // Invalid address
    if (message.includes('invalid address')) {
        return new Web3Error(
            error.message,
            'INVALID_ADDRESS',
            'The wallet address is invalid'
        );
    }

    // Gas estimation failed
    if (message.includes('gas') || message.includes('out of gas')) {
        return new Web3Error(
            error.message,
            'GAS_ERROR',
            'Transaction failed due to gas estimation. Please try again'
        );
    }

    // Insufficient funds
    if (message.includes('insufficient') || message.includes('insufficient balance')) {
        return new Web3Error(
            error.message,
            'INSUFFICIENT_FUNDS',
            'Insufficient funds for this transaction'
        );
    }

    // Contract revert
    if (message.includes('revert')) {
        return new Web3Error(
            error.message,
            'CONTRACT_REVERT',
            'Transaction reverted. You may not have permission to perform this action'
        );
    }

    // Unknown error
    return new Web3Error(
        error.message,
        'UNKNOWN',
        'An unexpected error occurred. Please try again'
    );
}