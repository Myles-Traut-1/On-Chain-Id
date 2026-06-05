export const claims = [
        {
                id: 1,
                type: "Email",
                value: "user@example.com",
                issuer: "0x1234...5678",
                verified: true
        },
        {
                id: 2,
                type: "Phone",
                value: "+1 (555) 123-4567",
                issuer: "0x8765...4321",
                verified: true
        },
        {
                id: 3,
                type: "KYC",
                value: "Verified Individual",
                issuer: "0xabcd...ef01",
                verified: false
        },
        {
                id: 4,
                type: "Accreditation",
                value: "Accredited Investor",
                issuer: "0x2468...1357",
                verified: true
        }
] as any[];