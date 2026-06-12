'use client';

import DeployId from "../components/DeployId";
import IdCard from "../components/IdCard";
import ErrorAlert from "../components/ErrorAlert";
import Link from "next/link";

import { useAccount } from "wagmi";
import { useIdentity } from "../hooks/useIdentity";
import { addressZero } from "../constants/constants";
import { useGetIdentityDetails } from "../hooks/useGetIdentityDetails";
import {useManageWallet} from "../hooks/useManageWallet";
import { useState, useEffect, useCallback } from "react";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { identity, linkedWallets, refetchWallets, loading, error, refetch } = useIdentity(address);

  const { verified } = useGetIdentityDetails(address, identity);

  const [dismissedError, setDismissedError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const onUnlinked = useCallback(() => {
      refetchWallets(identity);
  }, [refetchWallets, identity]);


  const { unlinkWallet } = useManageWallet(undefined, onUnlinked);

  useEffect(() => {
    if (error) {
      setDismissedError(false);
    }
  }, [error]);

  return (
    <main className="h-[calc(100vh-80px)] bg-slate-950 overflow-hidden flex flex-col">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 w-full h-full flex flex-col">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center h-full">
            {/* Header Section */}
            <div className="text-center mb-8 sm:mb-10">
              <h1 className="text-4xl sm:text-5xl font-bold text-indigo-400 mb-2 sm:mb-4">
                On-Chain Identity
              </h1>
              <p className="text-base sm:text-lg text-slate-400 font-light">
                Create your decentralized identity on Ethereum Sepolia
              </p>
            </div>

            {/* Card Section */}
            <div className="w-full max-w-md">
              <div className="relative group">
                <div className="absolute inset-0 bg-indigo-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-700 shadow-xl">
                  <div className="text-center space-y-4">
                    <div className="w-14 h-14 mx-auto bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-xl">🔐</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Connect Your Wallet
                    </h2>
                    <p className="text-sm text-slate-400">
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
              <div className="flex items-center justify-center h-full">
                <div className="w-full max-w-2xl">
                  <div className="animate-pulse space-y-4">
                    <div className="h-64 bg-slate-800 rounded-3xl" />
                  </div>
                </div>
              </div>
            ) : error && !dismissedError ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-full max-w-2xl">
                  <div className="bg-red-950 rounded-3xl p-6 sm:p-8 border border-red-800 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl shrink-0">⚠️</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-red-200 mb-2">
                          Error Loading Identity
                        </h3>
                        <ErrorAlert
                          error={error}
                          onDismiss={() => setDismissedError(true)}
                          showDetails={false}
                        />
                        <button
                          onClick={() => refetch()}
                          className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-all duration-300"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : identity === addressZero ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-full max-w-2xl">
                  <DeployId onDeployed={refetch} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full gap-4 sm:gap-6 py-6 sm:py-8 overflow-hidden">
                {/* Header Info Bar */}
                <div className="bg-slate-900/50 rounded-2xl p-4 sm:p-6 border border-slate-700/50 backdrop-blur-sm shrink-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
                        Connected Wallet
                      </p>
                      <p className="text-xs sm:text-sm font-mono text-cyan-300 break-all">
                        {address}
                      </p>
                    </div>

                    {/* Verification Status Badge */}
                    <div className="relative shrink-0">
                      <div
                        className="flex items-center gap-2 cursor-help rounded-full border border-slate-700/80 bg-slate-800/50 px-3 sm:px-4 py-1.5 sm:py-2 transition-colors hover:bg-slate-800/80"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        <div className={`w-2 h-2 rounded-full ${verified ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        <span className={`text-xs font-semibold whitespace-nowrap ${verified ? 'text-emerald-300' : 'text-amber-300'}`}>
                          {verified ? 'Manager' : 'Not a manager'}
                        </span>
                      </div>

                      {/* Tooltip */}
                      {showTooltip && verified && (
                        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg whitespace-nowrap text-xs text-slate-300 shadow-lg z-10 before:content-[''] before:absolute before:top-full before:right-4 before:border-4 before:border-slate-900 before:border-t-slate-700 before:border-r-transparent before:border-b-transparent before:border-l-transparent">
                          Connected wallet is verified to manage this identity
                        </div>
                      )}
                      {showTooltip && !verified && (
                        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg whitespace-nowrap text-xs text-slate-300 shadow-lg z-10 before:content-[''] before:absolute before:top-full before:right-4 before:border-4 before:border-slate-900 before:border-t-slate-700 before:border-r-transparent before:border-b-transparent before:border-l-transparent">
                          Connected wallet is not verified to manage this identity
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 flex-1 min-h-0 overflow-hidden">
                  {/* ID Card Section - Takes up 2 columns */}
                  <div className="lg:col-span-2 min-h-0 overflow-hidden">
                    <div className="relative group h-full">
                      <div className="absolute inset-0 bg-linear-to-b from-emerald-500 to-teal-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-35 transition-opacity duration-300" />
                      <div className="relative bg-slate-900 rounded-3xl p-6 sm:p-8 border border-emerald-600/40 shadow-xl h-full overflow-y-auto">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 to-teal-500" />
                        <IdCard identity={identity} />
                      </div>
                    </div>
                  </div>

                  {/* Sidebar - Actions and Info */}
                  <div className="lg:col-span-1 flex flex-col gap-4 sm:gap-6 min-h-0 overflow-y-auto">
                    {/* Manage Wallet Button Card */}
                    {verified && (
                      <Link
                        href="/manage-wallet"
                        className="relative group shrink-0"
                      >
                        <div className="absolute inset-0 bg-linear-to-b from-indigo-600 to-purple-700 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                        <div className="relative bg-slate-900 rounded-2xl p-5 sm:p-6 border border-indigo-600/40 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-indigo-500 to-purple-500 rounded-t-2xl" />
                          <div className="text-center space-y-2">
                            <div className="w-10 h-10 mx-auto bg-indigo-500/20 rounded-lg flex items-center justify-center">
                              <span className="text-base">⚙️</span>
                            </div>
                            <div>
                              <h3 className="text-xs sm:text-sm font-bold text-white">Manage Identity</h3>
                              <div className="text-xs text-slate-400 mt-0.5">
                                <ul>
                                  <li>Link wallets</li>
                                  <li>Manage keys</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}

                     
                    {linkedWallets.length > 0 && (
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 flex flex-col">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                                Linked Wallets ({linkedWallets.length})
                            </h3>
                            <ul className="space-y-2 overflow-y-auto flex-1">
                                {linkedWallets.map((wallet, index) => (
                                    <li key={index} className="text-xs sm:text-sm font-mono text-cyan-300 bg-slate-900/50 rounded-lg p-3 flex items-start justify-between">
                                        <span className="flex items-center gap-2 flex-1 min-w-0">
                                            <span className="shrink-0 text-emerald-400">✓</span>
                                            <span className="block flex-1 min-w-0 break-all whitespace-normal">{wallet}</span>
                                        </span>
                                        {wallet !== address && verified && (
                                            <button className="shrink-0 ml-2 px-2 py-1 text-xs rounded text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                                                onClick={() => {
                                                    unlinkWallet(wallet);
                                                }}>
                                                Unlink
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
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
