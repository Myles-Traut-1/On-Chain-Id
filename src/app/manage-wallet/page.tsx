'use client';

import LinkWallet from "../../components/LinkWallet";

import { useIdentity } from "../../hooks/useIdentity";
import { useManageWallet } from "../../hooks/useLinkWallet";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

export default function ManageWalletPage() {
    const router = useRouter();
    const { address, status, isConnecting, isReconnecting } = useAccount();
    const { identity, linkedWallets, refetchWallets } = useIdentity(address);

    const onLinked = useCallback(() => {
        refetchWallets(identity);
    }, [refetchWallets, identity]);

    const onUnlinked = useCallback(() => {
        refetchWallets(identity);
    }, [refetchWallets, identity]);


    const { unlinkWallet } = useManageWallet(onLinked, onUnlinked);
    const [expandedSection, setExpandedSection] = useState<'wallet' | 'key' | 'purpose' | null>('wallet');
    const [initialConnectionWindowPassed, setInitialConnectionWindowPassed] = useState(false);

    useEffect(() => {
        // Give wallet providers a brief window to restore session after refresh.
        const timeout = window.setTimeout(() => {
            setInitialConnectionWindowPassed(true);
        }, 600);

        return () => window.clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (!initialConnectionWindowPassed) return;
        if (isConnecting || isReconnecting) return;
        if (status === 'disconnected') {
            router.replace('/');
        }
    }, [initialConnectionWindowPassed, isConnecting, isReconnecting, status, router]);

    return (
        <div className="h-[calc(100vh-80px)] bg-slate-950 overflow-hidden flex flex-col">
            <div className="max-w-4xl mx-auto px-6 sm:px-8 w-full h-full flex flex-col py-6 sm:py-8 gap-6">
                {/* Header */}
                <div className="shrink-0">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        Manage Identity
                    </h1>
                    <p className="text-slate-400 font-light">
                        Manage your identity's wallets and keys
                    </p>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-h-0 overflow-y-auto space-y-4 sm:space-y-6">
                    {/* Link Wallet Section */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-linear-to-b from-purple-600 to-indigo-700 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                        <div className="relative bg-slate-900 rounded-2xl border border-purple-600/40 shadow-lg overflow-hidden">
                            {/* Header */}
                            <button
                                onClick={() => setExpandedSection(expandedSection === 'wallet' ? null : 'wallet')}
                                className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-lg shrink-0">
                                        🔗
                                    </div>
                                    <div className="text-left">
                                        <h2 className="text-lg sm:text-xl font-bold text-white">
                                            Link Wallet
                                        </h2>
                                        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                                            Add additional wallets to your identity
                                        </p>
                                    </div>
                                </div>
                                <div className={`text-2xl transition-transform duration-300 shrink-0 ${expandedSection === 'wallet' ? 'rotate-180' : ''}`}>
                                    ▼
                                </div>
                            </button>

                            {/* Content */}
                            {expandedSection === 'wallet' && (
                                <>
                                    <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-purple-500/0 via-purple-500/40 to-purple-500/0" />
                                    <div className="px-4 sm:px-6 pb-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Input Section */}
                                            <div>
                                                <h3 className="text-sm font-semibold text-white mb-4">Add New Wallet</h3>
                                                <LinkWallet onLinked={onLinked} />
                                            </div>

                                            {/* Linked Wallets List */}
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
                                                                {wallet !== address && (
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
                                </>
                            )}
                        </div>
                    </div>

                    {/* Add Key Section */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-linear-to-b from-indigo-600 to-blue-700 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                        <div className="relative bg-slate-900 rounded-2xl border border-indigo-600/40 shadow-lg overflow-hidden">
                            {/* Header */}
                            <button
                                onClick={() => setExpandedSection(expandedSection === 'key' ? null : 'key')}
                                className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center text-lg shrink-0">
                                        🔑
                                    </div>
                                    <div className="text-left">
                                        <h2 className="text-lg sm:text-xl font-bold text-white">
                                            Add Key
                                        </h2>
                                        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                                            Add a new key to your identity
                                        </p>
                                    </div>
                                </div>
                                <div className={`text-2xl transition-transform duration-300 shrink-0 ${expandedSection === 'key' ? 'rotate-180' : ''}`}>
                                    ▼
                                </div>
                            </button>

                            {/* Content */}
                            {expandedSection === 'key' && (
                                <>
                                    <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-indigo-500/0 via-indigo-500/40 to-indigo-500/0" />
                                    <div className="px-4 sm:px-6 pb-6 space-y-4">
                                        {/* Key Input */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="0x..."
                                                className="w-full px-4 py-3 rounded-lg text-sm font-mono bg-slate-800/50 border border-slate-700/50 text-cyan-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>

                                        {/* Key Type Selection */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                                                Key Type
                                            </label>
                                            <div className="grid grid-cols-3 gap-2">
                                                <button className="px-3 py-2 text-xs font-medium rounded-lg border-2 border-indigo-500 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition-colors">
                                                    Management
                                                </button>
                                                <button className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300 transition-colors">
                                                    Action
                                                </button>
                                                <button className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300 transition-colors">
                                                    Claim
                                                </button>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <button className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all duration-200">
                                            Add Key
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
