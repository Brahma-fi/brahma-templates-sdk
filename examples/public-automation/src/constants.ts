import { arbitrum, base, Chain } from "viem/chains";

export const SUPPORTED_CHAINS = [arbitrum] as const satisfies Chain[];

export const SUPPORTED_CHAINS_IDS = SUPPORTED_CHAINS.map((chain) => chain.id);

export const ARBITRUM_CHAIN_ID = arbitrum.id;

export const USER_REJECTED_REQUEST_CODE = 4001;

export const MULTICALL_CONTRACT_ADDRESS =
  "0xcA11bde05977b3631167028862bE2a173976CA11";

export const SCAM_TOKEN_WORDS = [
  "claim",
  "visit",
  "airdrop",
  "rewards",
  "http",
];
