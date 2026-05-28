'use client';

import { useState, useCallback } from 'react';
import { Web3Error, parseWeb3Error } from '../lib/errors';

interface UseErrorHandlerReturn {
    error: Web3Error | null;
    setError: (error: Web3Error | null) => void;
    handleError: (err: unknown) => Web3Error;
    clearError: () => void;
}

export function useErrorHandler(): UseErrorHandlerReturn {
    const [error, setError] = useState<Web3Error | null>(null);

    const handleError = useCallback((err: unknown): Web3Error => {
        const web3Error = parseWeb3Error(err);
        setError(web3Error);
        return web3Error;
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        error,
        setError,
        handleError,
        clearError,
    };
}