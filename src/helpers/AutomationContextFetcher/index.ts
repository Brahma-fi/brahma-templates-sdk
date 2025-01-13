import { Address } from "viem";
import axios, { AxiosInstance } from "axios";

import {
  AutomationLogResponse,
  AutomationSubscription,
  Communicator,
} from "@/types";
import { routes } from "../api";

export class AutomationContextFetcher {
  private readonly communicator: Communicator;
  private readonly axiosInstance: AxiosInstance;

  constructor(communicator: Communicator, apiKey: string, baseURL: string) {
    this.communicator = communicator;
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "x-api-key": apiKey,
      },
    });
  }

  async fetchAutomationLogs(
    automationId: string
  ): Promise<AutomationLogResponse[]> {
    try {
      if (!automationId) {
        throw new Error("Automation ID is required");
      }

      const response = await this.axiosInstance.get(
        `${routes.fetchAutomationLogs}/${automationId}`
      );

      if (!response.data.data) {
        throw new Error("No logs found for the given automation ID");
      }

      return response.data.data;
    } catch (err: any) {
      console.error(`Error fetching automation logs: ${err.message}`);
      return [];
    }
  }

  async fetchAutomationSubscriptions(
    accountAddress: Address,
    chainId: number
  ): Promise<AutomationSubscription[]> {
    try {
      if (!accountAddress || !chainId) {
        throw new Error("Brahma Account address and chain ID are required");
      }

      const response = await this.axiosInstance.get(
        `${routes.fetchAutomationSubscriptions}/${accountAddress}/${chainId}`
      );

      if (!response.data.data) {
        throw new Error(
          "No subscriptions found for the given account address and chain ID"
        );
      }

      return response.data;
    } catch (err: any) {
      console.error(`Error fetching automation subscriptions: ${err.message}`);
      return [];
    }
  }
}
