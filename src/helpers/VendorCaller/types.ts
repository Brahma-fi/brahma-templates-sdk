import { Address } from "viem";
import { TAsset } from "@/types";

export type Account = {
  consoleAddress: Address;
  eoa: Address;
  chainId: number;
  createdAt: string;
};

export type Task = {
  id: string;
  payload: {
    executionCount: number;
    prevExecutionAt: string;
    prevExecutionID: string;
    runningExecutionWorkflowIDs: string[];
    nonce: number;
    params: {
      executorAddress: Address;
      subAccountAddress: Address;
      executorID: string;
      chainID: number;
      subscription: {
        chainId: number;
        commitHash: string;
        createdAt: string;
        duration: number;
        feeAmount: string;
        feeToken: Address;
        id: string;
        metadata: any;
        registryId: string;
        status: number;
        subAccountAddress: Address;
        tokenInputs: Record<string, string>;
        tokenLimits: Record<string, string>;
      };
      isHostedWorkflow: boolean;
    };
    schedule: {
      every: number;
      ID: string;
    };
    triggeredAt: string;
  };
};

export type TaskResponse = {
  data: {
    tasks: Task[];
    cursor: number;
  };
};

export type SubmitTaskPayload = {
  task: {
    skip: boolean;
    skipReason: string;
    executorSignature: string;
    executor: string;
    subaccount: string;
    executable: {
      callType: number;
      to: string;
      value: string;
      data: string;
    };
  };
};

export type SubmitTaskRequest = {
  id: string;
  registryId: string;
  payload: SubmitTaskPayload;
};

export type SubmitTaskResponse = {
  success: boolean;
  message?: string;
};

export type ExecutorDetails = {
  registryId: string;
  metadata: {
    type: string;
    defaultEvery: string;
    executionTTL: string;
  };
  signature: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  relayerAddresses: Address[];
};

export type KernelExecutorConfig = {
  type: "INTERVAL";
  defaultEvery: string;
  executionTTL: string;
};

export type ConsoleExecutorPayload = {
  config: {
    inputTokens: Address[];
    hopAddresses: Address[];
    feeInBPS: number;
    feeToken: Address;
    feeReceiver: Address;
    limitPerExecution: boolean;
  };
  executor: string;
  signature: string;
  chainId: number;
  timestamp: number;
  executorMetadata: {
    id: string;
    name: string;
    logo: string;
    metadata: any;
  };
};

export type ConsoleExecutorConfig = {
  timestamp: number;
  executor: string;
  inputTokens: Address[];
  hopAddresses: Address[];
  feeReceiver: Address;
  limitPerExecution: boolean;
  clientId: string;
};

export type GenerateExecutableTypedDataParams = {
  chainId: number;
  pluginAddress: Address;
  operation: number;
  to: Address;
  account: Address;
  executor: Address;
  value: string;
  nonce: string;
  data: string;
};

export enum WorkflowExecutionStatus {
  UNSPECIFIED = 0,
  RUNNING = 1,
  COMPLETED = 2,
  FAILED = 3,
  CANCELED = 4,
  TERMINATED = 5,
  CONTINUED_AS_NEW = 6,
  TIMED_OUT = 7,
}

export type WorkflowStateResponse = {
  status: WorkflowExecutionStatus;
  out: {
    metadata: any;
    message: string;
    createdAt: string;
    subAccountAddress: Address;
    chainId: number;
    subId: string;
    outputTxHash: string;
  } | null;
};

export type SwapQuoteRoute = {
  pid: number;
  dex: string;
  toAmount: string;
};

export type SwapQuoteRoutes = {
  data: SwapQuoteRoute[];
  error?: string;
};

export type GetBridgingRoutes = {
  chainIdIn: number;
  chainIdOut: number;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  slippage: number;
  ownerAddress: string;
  recipient: Address;
};

type Protocol = {
  icon: string;
  name: string;
};

export type PathItem = {
  fromAmount: string;
  fromChainId: number;
  fromTokenAddress: string;
  pathAction: "bridge" | "swap";
  protocol: Protocol;
  toAmount: string;
  toChainId: number;
  toTokenAddress: string;
};

export type TxBuildObject = {
  fromAmount: string;
  inputValueInUsd: number;
  outputValueInUsd: number;
  receivedValueInUsd: number;
  recipient: string;
  routeId: string;
  sender: string;
  serviceTime: number;
  toAmount: string;
  totalGasFeesInUsd: number;
};

export type GetRoutingResponse = {
  duration: number;
  pathItems: PathItem[];
  pid: number;
  toAmount: string;
  txBuildObject: TxBuildObject;
}[];

export type BridgingChainStatus = "pending" | "success" | "failed" | "invalid";

export type GetBridgingStatus = {
  destinationStatus: BridgingChainStatus;
  destinationTransactionHash: Address;
  sourceStatus: BridgingChainStatus;
  sourceTransactionHash: Address;
};
