'use client';
import { useAccount } from "wagmi";
import { useState } from "react";

export default function IdCard(
    { identity, keys, verified }: { identity: string, keys: { key: string, type: string, purposes: string[] }[], verified: boolean }
) {
    const { chain } = useAccount();
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                    Your Identity
                </h3>
            </div>

            {/* Content sections */}
            <div className="space-y-6 flex-1">
                {/* Identity Address Section */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                            Identity Address
                        </p>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(identity);
                            }}
                            className="shrink-0 p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors duration-200 text-lg"
                            title="Copy address"
                        >
                            📋
                        </button>
                    </div>
                    <p className="text-sm font-mono text-cyan-300 break-all">
                        {identity}
                    </p>

                    {/* Management Keys */}
                    {keys.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-slate-700/50 space-y-3">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                Management Keys
                            </p>
                            <ul className="space-y-2">
                                {keys.map((item, index) => (
                                    <li key={index} className="text-xs font-mono text-cyan-300 bg-slate-900/50 rounded-lg p-2.5 break-all flex items-start gap-2">
                                        <span className="shrink-0 text-emerald-400 mt-0.5">•</span>
                                        <span>{item.key}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Verification Status - Minimalist Indicator with Tooltip */}
                            <div className="mt-4 relative">
                                <div
                                    className="flex items-center gap-2 cursor-help"
                                    onMouseEnter={() => setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                >
                                    <div className={`w-2 h-2 rounded-full ${verified ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                    <span className={`text-xs font-medium ${verified ? 'text-emerald-300' : 'text-amber-300'}`}>
                                        {verified ? 'Manager' : 'Not a manager'}
                                    </span>
                                </div>

                                {/* Tooltip */}
                                {showTooltip && verified && (
                                    <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg whitespace-nowrap text-xs text-slate-300 shadow-lg z-10 before:content-[''] before:absolute before:top-full before:left-2 before:border-4 before:border-slate-900 before:border-t-slate-700 before:border-r-transparent before:border-b-transparent before:border-l-transparent">
                                        Connected wallet is verified to manage this identity
                                    </div>
                                )}
                            </div>


                            {/* Status Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-emerald-900/30 rounded-2xl p-4 border border-emerald-700/50 backdrop-blur-sm">
                                    <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">
                                        Status
                                    </p>
                                    <p className="text-lg font-bold text-emerald-200">
                                        Active
                                    </p>
                                </div>
                                <div className="bg-cyan-900/30 rounded-2xl p-4 border border-cyan-700/50 backdrop-blur-sm">
                                    <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">
                                        Network
                                    </p>
                                    <p className="text-lg font-bold text-cyan-200">
                                        {chain ? chain.name : "Unknown"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
