'use client';

import DeployId from "../components/DeployId";
import { useAccount } from "wagmi";
import { useIdentity } from "../hooks/useIdentity";
import { addressZero } from "../constants";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { identity, loading, error, refetch } = useIdentity(address);

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
            ) : error ? (
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <div className="bg-red-50 dark:bg-red-950 rounded-3xl p-8 border-2 border-red-200 dark:border-red-800 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">⚠️</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-red-900 dark:text-red-200 mb-2">
                          Error Loading Identity
                        </h3>
                        <p className="text-red-800 dark:text-red-300 text-sm mb-4">
                          {error}
                        </p>
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
                  <DeployId />
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  {/* Success Card - ID Card Style */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-emerald-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                    <div className="relative">
                      {/* Card Background */}
                      <div className="bg-emerald-50 dark:bg-emerald-950 rounded-3xl overflow-hidden border-2 border-emerald-200 dark:border-emerald-800 shadow-2xl">
                        {/* Decorative top bar */}
                        <div className="h-2 bg-emerald-500" />

                        {/* Card content */}
                        <div className="p-8 sm:p-12 space-y-8">
                          {/* Header */}
                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                              ✓ Identity Created
                            </p>
                            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                              Your Identity is Live
                            </h3>
                          </div>

                          {/* Address section */}
                          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
                              Identity Address
                            </p>
                            <div className="flex items-center justify-between gap-4">
                              <code className="text-sm sm:text-base font-mono text-slate-900 dark:text-cyan-300 break-all">
                                {identity}
                              </code>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(identity);
                                }}
                                className="flex-shrink-0 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
                                title="Copy address"
                              >
                                📋
                              </button>
                            </div>
                          </div>

                          {/* Stats section */}
                          <div className="grid grid-cols-2 gap-4 sm:gap-6">
                            <div className="bg-emerald-100 dark:bg-emerald-900 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-700">
                              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-2">
                                Status
                              </p>
                              <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                                Active
                              </p>
                            </div>
                            <div className="bg-cyan-100 dark:bg-cyan-900 rounded-2xl p-4 border border-cyan-200 dark:border-cyan-700">
                              <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider mb-2">
                                Network
                              </p>
                              <p className="text-lg font-bold text-cyan-900 dark:text-cyan-100">
                                Sepolia
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
