'use client';

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, anvil } from "wagmi/chains";

export default getDefaultConfig({
    appName: "OnChainID",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [sepolia, anvil],
    ssr: true
});