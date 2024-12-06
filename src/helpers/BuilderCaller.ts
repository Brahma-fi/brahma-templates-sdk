import {
  Communicator,
  Methods,
  AddAutomationParams,
  AddToTxnBuilderParams,
  BuilderParams,
} from "../types";

export class BuilderCaller {
  private readonly communicator: Communicator;

  constructor(communicator: Communicator, apiKey: string) {
    this.communicator = communicator;
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

  async addAutomation(params: AddAutomationParams): Promise<void> {
    // Implementation for adding automation
  }

  async cancelAutomation(): Promise<void> {
    // Implementation for canceling automation
  }
}
