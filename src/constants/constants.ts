import { isAddress } from 'viem';

interface constantsConfig {
    idFactory: `0x${string}`;
    gateway: `0x${string}`;
    implementationAuthority: `0x${string}`;
}

const envAddressConfig = {
    idFactory: {
        envName: 'NEXT_PUBLIC_ID_FACTORY',
        value: process.env.NEXT_PUBLIC_ID_FACTORY,
    },
    gateway: {
        envName: 'NEXT_PUBLIC_GATEWAY',
        value: process.env.NEXT_PUBLIC_GATEWAY,
    },
    implementationAuthority: {
        envName: 'NEXT_PUBLIC_IMPL_AUTHORITY',
        value: process.env.NEXT_PUBLIC_IMPL_AUTHORITY,
    },
} as const satisfies Record<keyof constantsConfig, { envName: string; value: string | undefined }>;

function requireEnvAddress(key: keyof typeof envAddressConfig): `0x${string}` {
    const { envName, value } = envAddressConfig[key];
    if (!value || !isAddress(value)) throw new Error(`Missing or invalid env var: ${envName}`);
    return value as `0x${string}`;
}

export const constants: constantsConfig = {
    idFactory: requireEnvAddress('idFactory'),
    gateway: requireEnvAddress('gateway'),
    implementationAuthority: requireEnvAddress('implementationAuthority'),
};

export const addressZero = "0x0000000000000000000000000000000000000000";