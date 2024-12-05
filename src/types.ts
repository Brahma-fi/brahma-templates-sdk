import { Address } from "viem";

export type Template = {
  name: string;
  description: React.ReactNode | string;
  bgImage: string;
  docs: string;
  comingSoon: boolean;
  type: "Template";
  getCustomView: () => React.ReactNode;
  supportedChains: number[];
  icon?: React.ReactNode;
  isBeta?: boolean;
  pageTitleIcon?: React.ReactNode;
};

export type TAsset = {
  name: string;
  symbol?: string;
  icon?: React.ReactNode | string;
  address: Address;
  chainId: number;
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
  actions: Action[];
  verified?: boolean;
  isImported?: boolean;
  core?: boolean;
};

type ActionCategory = "strategy" | "action" | "automation";

type Action = {
  id: number;
  name: string;
  logo: string;
  apy: number;
  chainId: number;
  category: ActionCategory;
  getTransactionCustomView?: (params?: any) => React.ReactNode;
  getTransactionExpandedCustomView?: (params?: any) => React.ReactNode;
  metadata?: {
    overview: string;
    supportedAssets?: string[];
    baseEntityId: number;
    canStack: boolean;
  };
};

type BalanceOf = {
  decimals: number;
  formatted: string;
  symbol: string;
  value: bigint;
};

export type AddAutomationParams = {
  tokenLimits: Record<`0x${string}`, string>;
  tokenInputs: Record<`0x${string}`, string>;
  registryId: string;
  feeToken: Address;
  feeAmount: string;
  metadata: Record<string, any>;
};

export type AutomationSubscription = {
  chainId: number;
  commitHash: string;
  createdAt: string;
  duration: number;
  feeAmount: string;
  feeToken: Address;
  id: string;
  metadata: {
    baseToken: string;
    every: string;
  };
  registryId: string;
  status: number; // 2 === active status
  subAccountAddress: Address;
  tokenInputs: Record<Address, string>;
  tokenLimits: Record<Address, string>;
};

export type AutomationLogResponse = {
  id: string;
  subaccount_address: Address;
  chain_id: number;
  metadata: {
    req: {
      to: string;
      data: string;
      value: string;
      chainID: number;
      operation: number;
      subaccount: Address;
    };
    taskID: string;
    transitionState: {
      prev: {
        feesAmount: string;
        inputAmount: string;
        targetVault: Address;
        generatedYield: string;
      } | null;
      current: {
        feesAmount: "1000";
        inputAmount: "7999";
        targetVault: Address;
        generatedYield: "-1";
      };
    };
  };
  message: string;
  sub_id: string;
  createdAt: string;
  outputTxHash: string;
};

export type UserClientFactory = {
  eoa: Address;
  consoleAddress: Address;
  chainId: number;
  assets: TAsset[];
};

export type Transaction = {
  toAddress: string;
  callData: string;
  value: bigint;
};

export type BuilderParams = {
  transactions: Transaction[];
};

export type AddToTxnBuilderParams = {
  params: BuilderParams;
  automationName: string;
};

export interface Communicator {
  send<M extends Methods, P = unknown, R = unknown>(
    method: M,
    params: P
  ): Promise<SuccessResponse<R>>;
}

export type SDKRequestData<M extends Methods = Methods, P = unknown> = {
  id: RequestId;
  params: P;
  env: {
    sdkVersion: string;
  };
  method: M;
};

export type SDKMessageEvent = MessageEvent<SDKRequestData>;

export enum Methods {
  getClientFactory = "getClientFactory",
  addToTxnBuilder = "addToTxnBuilder",
  addAutomation = "addAutomation",
  fetchAutomationLogs = "fetchAutomationLogs",
  fetchAutomationSubscriptions = "fetchAutomationSubscriptions",
}

export type RequestId = string;

export interface MethodToResponse {
  [Methods.getClientFactory]: UserClientFactory;
  [Methods.addToTxnBuilder]: void;
  [Methods.addAutomation]: void;
  [Methods.fetchAutomationLogs]: AutomationLogResponse[];
  [Methods.fetchAutomationSubscriptions]: AutomationSubscription[];
}

export type ErrorResponse = {
  id: RequestId;
  success: false;
  error: string;
  version?: string;
};

export type SuccessResponse<T = MethodToResponse[Methods]> = {
  id: RequestId;
  data: T;
  version?: string;
  success: true;
};
export type InterfaceMessageEvent = MessageEvent<Response>;

export type Response<T = MethodToResponse[Methods]> =
  | ErrorResponse
  | SuccessResponse<T>;
