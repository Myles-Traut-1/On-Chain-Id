'use client';

import LinkWallet from "../../components/LinkWallet";

import { useIdentity } from "../../hooks/useIdentity";
import { useCallback } from "react";
import { useAccount } from "wagmi";

export default function ManageWalletPage() {
    const { address } = useAccount();
    const { identity, linkedWallets, refetchWallets } = useIdentity(address);

    const onLinked = useCallback(() => {
        refetchWallets(identity);
    }, [refetchWallets, identity]);

    return (
        <div className="relative group h-full">
            <div className="absolute inset-0 bg-linear-to-b from-purple-600 to-indigo-700 rounded-3xl blur-xl opacity-25 group-hover:opacity-35 transition-opacity duration-300" />
            <div className="relative bg-slate-900 rounded-3xl p-8 sm:p-10 border border-purple-600/40 shadow-xl h-full overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-purple-500 to-indigo-500" />
                <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                            Manage Identity
                        </h2>
                    </div>
                    <p className="text-slate-400 mb-8 font-light">
                        Link and manage connected wallets for your identity
                    </p>
                    <LinkWallet onLinked={onLinked} />
                    {linkedWallets.length > 0 && (
                        <div className="bg-purple-900/30 rounded-2xl p-4 border border-purple-700/50 backdrop-blur-sm mt-5">
                            <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-3">
                                Linked Wallets
                            </p>
                            <ul className="space-y-3">
                                {linkedWallets.map((wallet, index) => (
                                    <li key={index} className="text-sm font-mono text-cyan-300 bg-slate-900/50 rounded-lg p-3 break-all flex items-center gap-2">
                                        <span className="shrink-0 text-emerald-400">•</span>
                                        <span>{wallet}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}