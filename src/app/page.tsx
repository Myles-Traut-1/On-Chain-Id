'use client';

import DeployId from "../components/DeployId";
import IdCard from "../components/IdCard";
import ErrorAlert from "../components/ErrorAlert";

import { useAccount } from "wagmi";
import { useIdentity } from "../hooks/useIdentity";
import { addressZero } from "../constants";
import { useGetIdentityDetails } from "../hooks/useGetIdentityDetails";
import { useState } from "react";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { identity, loading, error, refetch } = useIdentity(address);

  const { keys, verified } = useGetIdentityDetails(address, identity);

  const [dismissedError, setDismissedError] = useState(false);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
            On-Chain Identity
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-light">
            Create your decentralized identity on Ethereum Sepolia
          </p>
        </div>

        {/* Main Content Card */}
        {!isConnected ? (
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="relative group">
                <div className="absolute inset-0 bg-indigo-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border-2 border-slate-200 dark:border-slate-700 shadow-xl">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">🔐</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Connect Your Wallet
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Get started by connecting your wallet to create your on-chain identity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {loading ? (
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  {/* Skeleton Loading */}
                  <div className="animate-pulse space-y-4">
                    <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-3xl" />
                  </div>
                </div>
              </div>
            ) : error && !dismissedError ? (
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <div className="bg-red-50 dark:bg-red-950 rounded-3xl p-8 border-2 border-red-200 dark:border-red-800 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">⚠️</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-red-900 dark:text-red-200 mb-2">
                          Error Loading Identity
                        </h3>
                        <ErrorAlert
                          error={error}
                          onDismiss={() => setDismissedError(true)}
                          showDetails={false}
                        />
                        <button
                          onClick={() => refetch()}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : identity === addressZero ? (
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <DeployId onDeployed={refetch} />
                </div>
              </div>
            ) : (
              < IdCard identity={identity} keys={keys} verified={verified} />
            )}
          </>
        )}
      </div>
    </main>
  );
}
