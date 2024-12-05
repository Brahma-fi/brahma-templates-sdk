import { TAsset } from "@/types";
import { Address } from "viem";

export type PreComputedAddressData = {
  precomputedAddress: Address;
  feeEstimate: string;
  feeEstimateSignature: string;
};

export type SafeTx = {
  to: string;
  value: number;
  data: string;
  operation: number;
  safeTxGas: number;
  baseGas: number;
  gasPrice: number;
  gasToken: string;
  refundReceiver: string;
  nonce: number;
};

export type TransferCalldataResponse = {
  signaturePayload: {
    domain: {
      verifyingContract: Address;
      chainId: string;
      name: string;
      salt: string;
      version: string;
    };
    message: {
      to: Address;
      baseGas: number;
      data: string;
      gasPrice: number;
      gasToken: Address;
      nonce: number;
      operation: number;
      refundReceiver: Address;
      safeTxGas: number;
      value: number;
    };
    primaryType: "SafeTx";
    types: {
      SafeTx: {
        name: string;
        type: string;
      }[];
    };
  };
  subAccountPolicyCommit: string;
  subscriptionDraftID: string;
};

export type AutomationSubscriptionLimits = {
  duration: number;
  tokenInputs: Record<Address, string>;
  tokenLimits: Record<Address, string>;
};

export type SafeTxMessage = {
  to: Address;
  baseGas: bigint;
  data: Address;
  gasPrice: bigint;
  gasToken: string;
  nonce: bigint;
  operation: number;
  refundReceiver: string;
  safeTxGas: bigint;
  value: bigint;
};

export type TaskIdStatusType =
  | "pending"
  | "executing"
  | "cancelled"
  | "successful"
  | "failed";

export type TaskStatusData = {
  taskId: string;
  metadata: {
    request: unknown;
    response: {
      isSuccessful: boolean;
      error: string | null;
      transactionHash: string | null;
    };
  };
  outputTransactionHash: string | null;
  status: TaskIdStatusType;
  createdAt: string;
};

export type Token = {
  asset: TAsset | null;
  amount: string;
};
