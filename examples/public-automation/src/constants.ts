import { Chain } from 'viem'

const swell = {
    id: 1923,
    name: 'Swell',
    // iconUrl: 'https://brahma-static.s3.us-east-2.amazonaws.com/Asset/Blast.svg',
    testnet: false,
    nativeCurrency: {
        decimals: 18,
        name: 'Ethereum',
        symbol: 'ETH',
    },
    rpcUrls: {
        public: {
            http: ['https://swell-mainnet.alt.technology'],
        },
        default: {
            http: ['https://swell-mainnet.alt.technology'],
        },
        appOnly: {
            http: ['https://swell-mainnet.alt.technology'],
        },
    },
    blockExplorers: {
        etherscan: {
            name: 'Swellscan',
            url: 'https://explorer.swellnetwork.io/',
        },
        default: {
            name: 'Swellscan',
            url: 'https://explorer.swellnetwork.io/',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 305649,
        },
    },
} as const satisfies Chain

export const SUPPORTED_CHAINS = [swell] as const satisfies Chain[]

export const SUPPORTED_CHAINS_IDS = SUPPORTED_CHAINS.map((chain) => chain.id)

export const ARBITRUM_CHAIN_ID = swell.id

export const USER_REJECTED_REQUEST_CODE = 4001

export const MULTICALL_CONTRACT_ADDRESS =
    '0xcA11bde05977b3631167028862bE2a173976CA11'

export const SCAM_TOKEN_WORDS = ['claim', 'visit', 'airdrop', 'rewards', 'http']
