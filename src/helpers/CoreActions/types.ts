import { Address } from "viem";
import { PathItem, SwapQuoteRoute, TAsset, TxBuildObject } from "@/types";

type ActionType = "SUBSCRIBE" | "UPDATE" | "CANCEL" | "BUILD";

export enum ActionNameToId {
  send = 301,
  swap = 309,
  bridging = 326,
}

export type GeneratePayload<T, A extends ActionType> = A extends "BUILD"
  ? {
      id: string;
      action: "BUILD";
      params: {
        id: ActionNameToId;
        chainId: number;
        consoleAddress: Address;
        params: T;
      };
    }
  : {
      id: "AUTOMATION";
      action: A;
      params: T;
    };

export type GenerateCalldataResponse = {
  data: {
    transactions: {
      to: Address;
      data: string;
      value: string;
      operation: number;
    }[];
    metadata: any | null;
  };
};

export type SendParams = {
  to: Address;
  amount: string;
  tokenAddress: Address;
};

export type SwapParams = {
  amountIn: string;
  tokenIn: Address;
  tokenOut: Address;
  slippage: number;
  chainId: number;
  route: SwapQuoteRoute;
};

export type BridgingRoute = {
  uuid: string;
  pid: number;
  protocolIcon: string;
  protocolName: string;
  routePercentageChange: string;
  isBestRoute: boolean;
  tokenOut: TAsset;
  tokenOutAmount: string;
  tokenOutAmountInUSD: string;
  gasUsed: string;
  serviceTime: number;
  txBuildObject: TxBuildObject;
  pathItems: PathItem[];
  bridge: string | null;
};

export type BridgeParams = {
  chainIdIn: number;
  chainIdOut: number;
  tokenIn: Address;
  tokenOut: Address;
  amount: string;
  route: BridgingRoute;
  recipient: Address;
  ownerAddress: Address;
};
