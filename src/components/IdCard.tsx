'use client';
import { useAccount } from "wagmi";
import { type Key } from "@onchain-id/identity-sdk/dist/identity/Key.interface";

export default function IdCard(
    { identity, keys }: { identity: string, keys: Key[] }
) {
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
