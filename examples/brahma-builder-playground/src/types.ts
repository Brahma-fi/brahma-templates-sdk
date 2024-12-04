import { Address } from "viem";

import { SUPPORTED_CHAINS_IDS } from "./constants";

export type SupportedChainIds = (typeof SUPPORTED_CHAINS_IDS)[number];

export type BalanceOf = {
  decimals: number;
  formatted: string;
  symbol: string;
  value: bigint;
};

export type TAsset = {
  name: string;
  symbol?: string;
  icon?: React.ReactNode | string;
  address: Address;
  chainId: SupportedChainIds;
  logo: string;
  decimals: number;
  balanceOf?: BalanceOf;
  value: string;
  prices: {
    default: number;
    [key: string]: number;
  };
  apy?: number;
  assetSubtitle?: string;
  verified?: boolean;
  isImported?: boolean;
  core?: boolean;
};
