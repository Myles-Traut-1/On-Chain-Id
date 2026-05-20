"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function Header() {
    return (
        <nav className="px-8 py-4.5 border-b border-zinc-100 flex flex-row justify-between items-center bg-white xl:min-h-19.25">
            <div className="flex items-center gap-2.5 md:gap-6">
                <a href="/" className="flex items-center gap-1 text-zinc-800">
                    <h1 className="font-bold text-2xl hidden md:block">On Chain ID</h1>
                </a>
            </div>

            <div className="flex items-center gap-4">
                <ConnectButton showBalance={false} />
            </div>
        </nav>
    )
}