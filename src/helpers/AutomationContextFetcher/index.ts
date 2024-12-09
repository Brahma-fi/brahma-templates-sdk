import { Address } from "viem";

import { Communicator, Methods } from "@/types";
import { AutomationLogResponse, AutomationSubscription } from "./types";

export class AutomationContextFetcher {
  private readonly communicator: Communicator;

  constructor(communicator: Communicator, apiKey: string) {
    this.communicator = communicator;
  }

  async fetchAutomationLogs(
    automationId: string
  ): Promise<AutomationLogResponse[]> {
    const response = await this.communicator.send<
      Methods.fetchAutomationLogs,
      string,
      AutomationLogResponse[]
    >(Methods.fetchAutomationLogs, automationId);

    return response.data;
  }

  async fetchAutomationSubscriptions(
    consoleAddress: Address,
    chainId: number
  ): Promise<AutomationSubscription[]> {
    const messagePayload = {
      consoleAddress,
      chainId,
    };

    const response = await this.communicator.send<
      Methods.fetchAutomationSubscriptions,
      { consoleAddress: Address; chainId: number },
      AutomationSubscription[]
    >(Methods.fetchAutomationSubscriptions, messagePayload);

    return response.data;
  }
}
