import { Address } from "viem";
import InterfaceCommunicator from "./communicator";
import {
  AddAutomationParams,
  AddToTxnBuilderParams,
  AutomationLogResponse,
  AutomationSubscription,
  BuilderParams,
  Communicator,
  Methods,
  UserClientFactory,
} from "./types";

export default class TestSDK {
  private readonly communicator: Communicator;

  constructor() {
    this.communicator = new InterfaceCommunicator();
  }

  async addAutomation(params: AddAutomationParams): Promise<void> {
    console.log("params", params);

    const response = await this.communicator.send<
      Methods.addAutomation,
      AddAutomationParams,
      void
    >(Methods.addAutomation, params);

    return response.data;
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

  async getClientFactory(): Promise<UserClientFactory> {
    const response = await this.communicator.send<
      Methods.getClientFactory,
      undefined,
      UserClientFactory
    >(Methods.getClientFactory, undefined);

    return response.data;
  }

  async addToTxnBuilder(
    params: BuilderParams,
    automationName: string
  ): Promise<void> {
    if (!params || !params.transactions.length) {
      throw new Error("No transactions were passed");
    }

    const messagePayload = {
      params,
      automationName,
    };

    const response = await this.communicator.send<
      Methods.addToTxnBuilder,
      AddToTxnBuilderParams,
      void
    >(Methods.addToTxnBuilder, messagePayload);

    return response.data;
  }
}
