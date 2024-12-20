import { Address } from "viem";

import {
  AutomationSubscriptionLimits,
  PreComputedAddressData,
  TaskStatusData,
  TransferCalldataResponse,
  Communicator,
} from "@/types";
import { axiosInstance, routes } from "../api";

export class PublicDeployer {
  private readonly communicator: Communicator;

  constructor(communicator: Communicator, apiKey: string) {
    this.communicator = communicator;
  }

  /**
   * Fetches the precomputed address data for a given owner, chain ID, and fee token.
   * @param {Address} owner - The address of the owner.
   * @param {number} chainId - Chain ID for connected network.
   * @param {Address} feeToken - The address of the fee token.
   * @returns {Promise<PreComputedAddressData | null>} The precomputed address data or null if an error occurs.
   */
  async fetchPreComputeAddress(
    owner: Address,
    chainId: number,
    feeToken: Address
  ): Promise<PreComputedAddressData | null> {
    const payload = { owner, chainID: chainId, feeToken };

    try {
      const response = await axiosInstance.post(
        routes.fetchPreComputeAddress,
        payload
      );
      return response.data.data;
    } catch (err) {
      console.error("Error fetching precompute address:", err);
      return null;
    }
  }

  /**
   * Generates an automation sub-account for a given set of parameters.
   * @param {Address} owner - The address of the owner.
   * @param {Address} precomputedConsoleAddress - The precomputed account address (from /pre-compute response)
   * @param {number} chainID - Chain ID for connected network.
   * @param {string} registryID - The registry ID. (Hardcoded)
   * @param {Address} feeToken - The address of the fee token. (from /pre-compute response)
   * @param {string} feeEstimate - The estimated fee.
   * @param {Address[]} tokens - The list of token addresses.
   * @param {string[]} amounts - The list of token amounts.
   * @param {AutomationSubscriptionLimits} automationSubscriptionLimits - The subscription limits.
   * @returns {Promise<TransferCalldataResponse | null>} The transfer calldata response or null if an error occurs.
   */
  async generateAutomationSubAccount(
    owner: Address,
    precomputedConsoleAddress: Address,
    chainID: number,
    registryID: string,
    feeToken: Address,
    feeEstimate: string,
    tokens: Address[],
    amounts: string[],
    automationSubscriptionLimits: AutomationSubscriptionLimits
  ): Promise<TransferCalldataResponse | null> {
    const payload = {
      owner,
      precomputedConsoleAddress,
      automationSubscriptionLimits,
      chainID,
      registryID,
      feeToken,
      feeEstimate,
      tokens,
      amounts,
    };
    try {
      const response = await axiosInstance.post(
        routes.fetchDeployerSignature,
        payload
      );
      return response.data.data;
    } catch (err) {
      console.error("Error generating automation sub-account:", err);
      return null;
    }
  }

  /**
   * Deploys a account and sub-account with the given parameters.
   * @param {Address} owner - The address of the owner.
   * @param {number} chainID - The ID of the blockchain network.
   * @param {string} registryID - The registry ID. (Hardcoded)
   * @param {string} subscriptionDraftID - The subscription draft ID. (from /signature response)
   * @param {string} subAccountPolicyCommit - The sub-account policy commit. (from /signature response)
   * @param {Address} feeToken - The address of the fee token.
   * @param {Address[]} tokens - The list of token addresses.
   * @param {string[]} amounts - The list of token amounts.
   * @param {string} subAccountChainerSignature - The sub-account chainer signature. (from /signature response)
   * @param {string} feeEstimateSignature - The fee estimate signature. (from /pre-compute response)
   * @param {string} feeEstimate - The estimated fee. (from /pre-compute response)
   * @param {Record<string, unknown>} metadata - Additional metadata.
   * @returns {Promise<{ taskId: string } | null>} The task ID or null if an error occurs.
   */
  async deployBrahmaAccount(
    owner: Address,
    chainID: number,
    registryID: string,
    subscriptionDraftID: string,
    subAccountPolicyCommit: string,
    feeToken: Address,
    tokens: Address[],
    amounts: string[],
    subAccountChainerSignature: string,
    feeEstimateSignature: string,
    feeEstimate: string,
    metadata: Record<string, unknown>
  ): Promise<{ taskId: string } | null> {
    const payload = {
      owner,
      chainID,
      registryID,
      subscriptionDraftID,
      subAccountPolicyCommit,
      feeToken,
      tokens,
      amounts,
      subAccountChainerSignature,
      feeEstimateSignature,
      feeEstimate,
      metadata,
    };

    try {
      const response = await axiosInstance.post(
        routes.deployPublicStrategy,
        payload
      );
      return response.data.data;
    } catch (err) {
      console.error("Error deploying account and sub-account:", err);
      return null;
    }
  }

  /**
   * Fetches the status of a task by its ID.
   * @param {string} taskId - The ID of the task. (from /deploy endpoint)
   * @returns {Promise<TaskStatusData>} The task status data.
   * @throws Will throw an error if the request fails.
   */
  async fetchDeploymentStatus(taskId: string): Promise<TaskStatusData> {
    try {
      const response = await axiosInstance.get(
        `${routes.fetchTaskStatus}/${taskId}`
      );
      return response.data.data;
    } catch (err) {
      console.error("Error fetching task status:", err);
      throw err;
    }
  }
}
