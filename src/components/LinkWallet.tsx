import { useLinkWallet } from "../hooks/useLinkWallet";
import { useAccount } from "wagmi";
import { useState } from "react";
import ErrorAlert from "./ErrorAlert";

export default function LinkWallet() {
    const { address } = useAccount();
    const { linkWallet, loading, error } = useLinkWallet();
    const [dismissedError, setDismissedError] = useState(false);
    const [inputAddress, setInputAddress] = useState("");

    if (error && !dismissedError) {
        return (
            <div className="w-full">
                <ErrorAlert
                    error={error}
                    onDismiss={() => setDismissedError(true)}
                    showDetails={false}
                />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center py-12">
                <div className="flex gap-2 mb-4">
                    <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" />
                </div>
                <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest">
                    Linking Wallet…
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="mb-6">
                <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest">
                    ⛓ Link Wallet
                </p>
                <p className="text-sm text-slate-400 mt-2">
                    Enter the wallet address you want to link to your identity.
                </p>
            </div>

            {/* Content sections */}
            <div className="space-y-6 flex-1 flex flex-col">
                {/* Input Section */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                        Wallet Address
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={inputAddress}
                            onChange={(e) => setInputAddress(e.target.value)}
                            placeholder="0x..."
                            className="flex-1 min-w-0 px-4 py-3 rounded-xl text-sm font-mono bg-slate-900/50 border border-slate-600/50 text-cyan-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                        <button
                            onClick={() => inputAddress && linkWallet(inputAddress)}
                            disabled={!inputAddress}
                            className="shrink-0 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            Link Wallet
                        </button>
                    </div>
                </div>

                {/* Linked Wallet Info */}
                <div className="bg-purple-900/30 rounded-2xl p-4 border border-purple-700/50 backdrop-blur-sm">
                    <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-3">
                        Linked Wallets
                    </p>
                    <p className="text-lg font-bold text-purple-200 font-mono break-all">
                        TODO: Show linked wallets here
                    </p>
                </div>
            </div>
        </div>
    );
}
