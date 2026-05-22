'use client';

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, anvil } from "wagmi/chains";
import { http } from "wagmi";

// const anvilSepoliaFork = {
//     id: 11155111, // Match your anvil --chain-id
//     name: 'Anvil Sepolia Fork',
//     nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
//     rpcUrls: {
//         default: { http: ['http://localhost:8545'] },
//         public: { http: ['http://localhost:8545'] },
//     },
//     testnet: true
// };

export default getDefaultConfig({
    appName: "OnChainID",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [sepolia, anvil],
    ssr: true
});