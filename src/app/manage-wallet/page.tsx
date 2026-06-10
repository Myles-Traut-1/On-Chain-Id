'use client';

import LinkWallet from "../../components/LinkWallet";
import AddKeys from "../../components/AddKeys";

import { useIdentity } from "../../hooks/useIdentity";
import { useGetIdentityDetails } from "../../hooks/useGetIdentityDetails";
import { useManageWallet } from "../../hooks/useManageWallet";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";


export default function ManageWalletPage() {
    const router = useRouter();
    const { address, status, isConnecting, isReconnecting } = useAccount();
    const { identity, linkedWallets, refetchWallets } = useIdentity(address);
    const { verified, loading: verifyLoading } = useGetIdentityDetails(address, identity);

    const [expandedSection, setExpandedSection] = useState<'wallet' | 'key' | 'purpose' | null>('wallet');
    const [initialConnectionWindowPassed, setInitialConnectionWindowPassed] = useState(false);

    const onLinked = useCallback(() => {
        refetchWallets(identity);
    }, [refetchWallets, identity]);

    const { unlinkWallet } = useManageWallet(onLinked, undefined);

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
        if (verifyLoading) return;
        if (!verified) {
            router.replace('/');
        }
    }, [initialConnectionWindowPassed, isConnecting, isReconnecting, status, verified, verifyLoading, router]);

    if (verifyLoading || !verified) {
        return (
            <div className="h-[calc(100vh-80px)] bg-slate-950 overflow-hidden flex items-center justify-center px-6">
                <div className="relative group w-full max-w-sm">
                    <div className="absolute inset-0 bg-linear-to-b from-purple-600 to-indigo-700 rounded-2xl blur-lg opacity-20" />
                    <div className="relative bg-slate-900 rounded-2xl border border-purple-600/40 shadow-lg px-8 py-10 flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="h-12 w-12 rounded-full border-2 border-purple-500/20" />
                            <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-transparent border-t-purple-400 border-r-indigo-400 animate-spin" />
                        </div>
                        <p className="text-sm font-medium text-slate-200 tracking-wide">Verifying identity...</p>
                    </div>
                </div>
            </div>
        );
    }

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
                                    <AddKeys idAddress={identity} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
