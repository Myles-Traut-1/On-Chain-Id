export class Web3Error extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string,
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
    message.includes("user denied") ||
    message.includes("user cancel") ||
    message.includes("rejected transaction")
  ) {
    return new Web3Error(
      error.message,
      "USER_REJECTED",
      "You rejected the transaction",
    );
  }

  // Network errors
  if (
    message.includes("network") ||
    message.includes("connection") ||
    message.includes("timeout")
  ) {
    return new Web3Error(
      error.message,
      "NETWORK_ERROR",
      "Network error occurred. Please check your connection and try again",
    );
  }

  // Invalid address
  if (message.includes("invalid address")) {
    return new Web3Error(
      error.message,
      "INVALID_ADDRESS",
      "The wallet address is invalid",
    );
  }

  // Gas estimation failed
  if (message.includes("gas") || message.includes("out of gas")) {
    return new Web3Error(
      error.message,
      "GAS_ERROR",
      "Transaction failed due to gas estimation. Please try again",
    );
  }

  // Insufficient funds
  if (
    message.includes("insufficient") ||
    message.includes("insufficient balance")
  ) {
    return new Web3Error(
      error.message,
      "INSUFFICIENT_FUNDS",
      "Insufficient funds for this transaction",
    );
  }

  // Contract revert
  if (message.includes("revert")) {
    return new Web3Error(
      error.message,
      "CONTRACT_REVERT",
      "Transaction reverted. You may not have permission to perform this action",
    );
  }

  // Zero address error
  if (message.includes("Zero address") || message.includes("zero address")) {
    return new Web3Error(
      error.message,
      "ZERO_ADDRESS",
      "Cannot use zero address",
    );
  }

  // Wallet already linked error
  if (
    message.includes("Wallet Already Linked To An Identity") ||
    message.includes("wallet already linked")
  ) {
    return new Web3Error(
      error.message,
      "WALLET_ALREADY_LINKED",
      "This wallet is already linked to an identity",
    );
  }

  // Invalid wallet address error
  if (
    message.includes("Invalid wallet address") ||
    message.includes("invalid wallet address")
  ) {
    return new Web3Error(
      error.message,
      "INVALID_WALLET_ADDRESS",
      "The wallet address is invalid",
    );
  }

  if (message.includes("link wallet")) {
    return new Web3Error(
      error.message,
      "WALLET_NOT_LINKED",
      "Please link the wallet to your identity first",
    );
  }

  // Unknown error
  return new Web3Error(
    error.message,
    "UNKNOWN",
    "An unexpected error occurred. Please try again",
  );
}
