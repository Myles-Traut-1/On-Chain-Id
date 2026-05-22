"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function Header() {
    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700">
            <nav className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between min-h-20">
                <div className="flex items-center gap-8">
                    <a
                        href="/"
                        className="group transition-all duration-300"
                        aria-label="On Chain ID Home"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                <span className="text-white font-bold text-lg">◆</span>
                            </div>
                            <h1 className="font-bold text-2xl text-indigo-600 dark:text-indigo-400 hidden md:block group-hover:opacity-75 transition-opacity">
                                On Chain ID
                            </h1>
                        </div>
                    </a>
                </div>

                <div className="flex items-center gap-4">
                    <ConnectButton
                        showBalance={false}
                        accountStatus="avatar"
                        chainStatus="icon"
                    />
                </div>
            </nav>
        </header>
    )
}
