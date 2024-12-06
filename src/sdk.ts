import {
  InterfaceCommunicator,
  AutomationContextFetcher,
  BuilderCaller,
  PublicDeployer,
} from "./helpers";
import { Communicator, Methods, UserClientFactory } from "./types";

export default class TemplatesSDK {
  private readonly communicator: Communicator;
  private readonly apiKey: string;

  public automationContextFetcher: AutomationContextFetcher;
  public builderCaller: BuilderCaller;
  public publicDeployer: PublicDeployer;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API key is required");
    }

    this.communicator = new InterfaceCommunicator();
    this.apiKey = apiKey;
    this.automationContextFetcher = new AutomationContextFetcher(
      this.communicator,
      this.apiKey
    );
    this.builderCaller = new BuilderCaller(this.communicator, this.apiKey);
    this.publicDeployer = new PublicDeployer(this.communicator, this.apiKey);
  }

  async getClientFactory(): Promise<UserClientFactory> {
    const response = await this.communicator.send<
      Methods.getClientFactory,
      undefined,
      UserClientFactory
    >(Methods.getClientFactory, undefined);

    return response.data;
  }
}
