import { Address } from "viem";

import {
  AutomationLogResponse,
  AutomationSubscription,
  Communicator,
  Methods,
} from "@/types";
import { axiosInstance, routes } from "../api";

export class AutomationContextFetcher {
  private readonly communicator: Communicator;

  constructor(communicator: Communicator, apiKey: string) {
    this.communicator = communicator;
  }

  async fetchAutomationLogs(
    automationId: string
  ): Promise<AutomationLogResponse[]> {
    try {
      if (!automationId) {
        throw new Error("Automation ID is required");
      }

      const response = await axiosInstance.get(
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
    consoleAddress: Address,
    chainId: number
  ): Promise<AutomationSubscription[]> {
    try {
      if (!consoleAddress || !chainId) {
        throw new Error("Console address and chain ID are required");
      }

      const response = await axiosInstance.get(
        `${routes.fetchAutomationSubscriptions}/${consoleAddress}/${chainId}`
      );

      if (!response.data.data) {
        throw new Error(
          "No subscriptions found for the given console address and chain ID"
        );
      }

      return response.data;
    } catch (err: any) {
      console.error(`Error fetching automation subscriptions: ${err.message}`);
      return [];
    }
  }
}
