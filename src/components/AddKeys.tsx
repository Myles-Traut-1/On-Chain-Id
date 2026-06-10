'use client';

import { useState, useEffect } from "react";
import { useManageKeys } from "../hooks/useManageKeys";

export default function AddKeys({ idAddress, onKeyAdded }: { idAddress: string, onKeyAdded?: () => void }) {
    const { loading, error, addManagementKey } = useManageKeys(onKeyAdded);
    const [keyAddress, setKeyAddress] = useState("");

    return (
        <div className="px-4 sm:px-6 pb-6 space-y-4">
            {/* Key Input */}
            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                    Address
                </label>
                <input
                    type="text"
                    placeholder="0x..."
                    value={keyAddress}
                    onChange={(e) => setKeyAddress(e.target.value)}
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
                </div>
            </div>

            {/* Submit Button */}
            <button
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all duration-200"
                disabled={!keyAddress}
                onClick={() => addManagementKey(idAddress, keyAddress)}>
                Add Key
            </button>
        </div>
    )
}