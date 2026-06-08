'use client';

import { useDeployIdentity } from "../hooks/useDeployIdentity";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import ErrorAlert from "./ErrorAlert";

type DeployIdProps = {
    onDeployed?: () => Promise<unknown> | void;
};

export default function DeployId({ onDeployed }: DeployIdProps) {
    const { isConnected, chain } = useAccount();
    const { deployIdentity, loading, error } = useDeployIdentity();

    const [isHovered, setIsHovered] = useState(false);
    const [dismissedError, setDismissedError] = useState(false);

    useEffect(() => {
        if (error) {
            setDismissedError(false);
        }
    }, [error]);

    const handleDeployIdentity = async () => {
        setDismissedError(false);
        try {
            await deployIdentity();
            await onDeployed?.();
        } catch {
            // error is handled and surfaced by useDeployIdentity
        }
    };

    return (
        <div className="relative group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <div className={`absolute inset-0 bg-indigo-400 rounded-3xl blur-xl transition-opacity duration-300 ${isHovered ? 'opacity-40' : 'opacity-20'}`} />
            <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border-2 border-indigo-200 dark:border-indigo-800 shadow-xl overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-200 dark:bg-indigo-900 rounded-full blur-3xl opacity-20 -mr-20 -mt-20" />

                <div className="relative space-y-8">
                    {/* Content */}
                    <div className="space-y-4 text-center">
                        <div className="w-16 h-16 mx-auto bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                            <span className="text-3xl">🪪</span>
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                You do not have an on-chain identity yet.
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-base">
                                Create your unique on-chain identity contract on Ethereum Sepolia
                            </p>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && !dismissedError && (
                        <ErrorAlert
                            error={error}
                            onDismiss={() => setDismissedError(true)}
                            showDetails={false}
                        />
                    )}

                    {/* Button */}
                    <div>
                        <button
                            onClick={handleDeployIdentity}
                            disabled={!isConnected || loading}
                            className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl border-2 ${loading || !isConnected
                                ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-600 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700 dark:border-indigo-600 active:scale-95'
                                }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    <span>Deploying...</span>
                                </div>
                            ) : (
                                <span>Deploy Identity</span>
                            )}
                        </button>
                        {!isConnected && (
                            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-3">
                                Connect your wallet to get started
                            </p>
                        )}
                    </div>

                    {/* Info boxes */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="bg-indigo-50 dark:bg-indigo-950 rounded-xl p-3 border border-indigo-200 dark:border-indigo-800">
                            <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">Network</p>
                            <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100 mt-1">{chain ? chain.name : "Unknown"}</p>
                        </div>
                        <div className="bg-cyan-50 dark:bg-cyan-900 rounded-xl p-3 border border-cyan-200 dark:border-cyan-800">
                            <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">Type</p>
                            <p className="text-sm font-bold text-cyan-900 dark:text-cyan-100 mt-1">Smart Contract</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
