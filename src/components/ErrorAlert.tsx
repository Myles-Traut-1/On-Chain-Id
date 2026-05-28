'use client';

import { Web3Error } from "../lib/errors";

interface ErrorAlertProps {
    error: Error | Web3Error | null;
    onDismiss?: () => void;
    showDetails?: boolean;
}

export default function ErrorAlert({ error, onDismiss, showDetails = false }: ErrorAlertProps) {
    if (!error) return null;

    const isWeb3Error = error instanceof Web3Error;
    const userMessage = isWeb3Error ? error.userMessage : error.message;
    const showTechnicalDetails = showDetails && isWeb3Error;

    return (
        <div className="bg-red-50 dark:bg-red-950 border-l-4 border-red-500 rounded-xl p-4 shadow-md">
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="text-2xl shrink-0">⚠️</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-red-900 dark:text-red-200 mb-1">
                        Transaction Error
                    </h3>
                    <p className="text-red-800 dark:text-red-300 text-sm mb-3">
                        {userMessage}
                    </p>

                    {/* Technical Details (optional) */}
                    {showTechnicalDetails && (
                        <details className="text-xs text-red-700 dark:text-red-400 mb-3">
                            <summary className="cursor-pointer font-semibold hover:underline">
                                Technical Details
                            </summary>
                            <pre className="mt-2 bg-red-100 dark:bg-red-900 p-2 rounded overflow-auto max-h-40">
                                {error.message}
                            </pre>
                        </details>
                    )}
                </div>

                {/* Dismiss Button */}
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="shrink-0 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
                        aria-label="Dismiss error"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}