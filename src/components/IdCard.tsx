import { IdentitySDK } from "@onchain-id/identity-sdk";

export default function IdCard(
    { identity, keys, verified }: { identity: string, keys: { key: string, type: string, purposes: string[] }[], verified: boolean }
) {
    return (
        <div className="flex justify-center">
            <div className="w-full overflow-x-auto">
                {/* Success Card - ID Card Style */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-emerald-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                    <div className="relative">
                        {/* Card Background */}
                        <div className="w-fit min-w-full bg-emerald-50 dark:bg-emerald-950 rounded-3xl overflow-hidden border-2 border-emerald-200 dark:border-emerald-800 shadow-2xl">
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
                                        <div className="min-w-0 flex-1 text-sm sm:text-base font-mono text-slate-900 dark:text-cyan-300 whitespace-nowrap">
                                            {identity}
                                            <div className="mt-2">
                                                {keys.length > 0 && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                                            Management Keys
                                                        </p>
                                                        <ul className="max-w-full text-xs font-mono text-slate-900 dark:text-cyan-300 list-disc list-inside space-y-1">
                                                            {keys.map((item, index) => (
                                                                <li key={index} className="whitespace-nowrap">
                                                                    {item.key}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                                            {verified ? "Your connected wallet is a manager of this identity" : "Your connected wallet is NOT a manager of this identity"}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(identity);
                                            }}
                                            className="shrink-0 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
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
    );
}