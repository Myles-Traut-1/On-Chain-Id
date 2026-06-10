'use client';

import { claims } from "../mocks/claims_array";

export default function IdCard(
    { identity }: { identity: string }
) {
    return (
        <div className="w-full h-full flex flex-col">
            {/* Content sections */}
            <div className="space-y-6 flex-1 flex flex-col min-h-0">
                {/* Identity Address Section */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm shrink-0">
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
                </div>

                {/* Claims Section */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm flex-1 min-h-0 flex flex-col">
                    <div className="flex items-center justify-between gap-3 mb-4 shrink-0">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                Claims
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {claims.length} credential{claims.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-sm shrink-0">
                            ✓
                        </div>
                    </div>

                    {/* Claims List */}
                    <div className="space-y-2 overflow-y-auto flex-1">
                        {claims.map((claim) => (
                            <div
                                key={claim.id}
                                className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30 hover:border-slate-700/60 hover:bg-slate-900/70 transition-all duration-200 group"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xs sm:text-sm font-semibold text-white">
                                                Coming Soon
                                            </h4>
                                            {/* {claim.verified && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                    Verified
                                                </span>
                                            )}
                                            {!claim.verified && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                                    Pending
                                                </span>
                                            )} */}
                                        </div>
                                        {/* <p className="text-xs text-slate-300 mt-1 truncate">
                                            {claim.value}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1 truncate">
                                            Issuer: {claim.issuer}
                                        </p> */}
                                    </div>
                                    <button
                                        className="shrink-0 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-800/50 rounded text-slate-400 hover:text-slate-300"
                                        title="View details"
                                    >
                                        →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty state fallback */}
                    {claims.length === 0 && (
                        <div className="flex items-center justify-center h-32 text-center">
                            <div>
                                <p className="text-sm text-slate-400 mb-2">No claims yet</p>
                                <p className="text-xs text-slate-500">Add your first claim to get started</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
