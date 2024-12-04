import { Address } from "viem";
import createDrainAccountConfig from "./templates/drain-account";
import {
  AddAutomationParams,
  AutomationLogResponse,
  AutomationSubscription,
  BuilderParams,
  UserClientFactory,
} from "./types";

export enum TemplateToId {
  DRAIN_ACCOUNT_TEMPLATE = 100,
}

// This is to be used by just console.brahma.fi
export default class TemplatesSDK {
  private getClientFactory: () => Promise<UserClientFactory>;
  private addToTxnBuilder: (
    params: BuilderParams,
    automationName: string
  ) => Promise<void>;
  private addAutomation: (params: AddAutomationParams) => Promise<void>;
  private fetchAutomationLogs: (
    automationId: string
  ) => Promise<AutomationLogResponse[]>;
  private fetchAutomationSubscriptions: (
    consoleAddress: Address,
    chainId: number
  ) => Promise<AutomationSubscription[]>;

  private CUSTOM_TEMPLATES = Object.values(TemplateToId)
    .filter((value): value is TemplateToId => typeof value === "number")
    .map((id) => ({ id }));

  constructor(
    getClientFactory: () => Promise<UserClientFactory>,
    addToTxnBuilder: (
      params: BuilderParams,
      automationName: string
    ) => Promise<void>,
    addAutomation: (params: AddAutomationParams) => Promise<void>,
    fetchAutomationLogs: (
      automationId: string
    ) => Promise<AutomationLogResponse[]>,
    fetchAutomationSubscriptions: (
      consoleAddress: Address,
      chainId: number
    ) => Promise<AutomationSubscription[]>
  ) {
    this.getClientFactory = getClientFactory;
    this.addToTxnBuilder = addToTxnBuilder;
    this.addAutomation = addAutomation;
    this.fetchAutomationLogs = fetchAutomationLogs;
    this.fetchAutomationSubscriptions = fetchAutomationSubscriptions;
  }

  private getTemplatesConfig(): Record<TemplateToId, any> {
    return {
      [TemplateToId.DRAIN_ACCOUNT_TEMPLATE]: createDrainAccountConfig(
        this.getClientFactory,
        this.addToTxnBuilder,
        this.addAutomation,
        this.fetchAutomationLogs,
        this.fetchAutomationSubscriptions
      ),
    };
  }

  private getTemplateConfigById(templateId: TemplateToId) {
    return this.getTemplatesConfig()[templateId];
  }

  public getCustomTemplates() {
    return this.CUSTOM_TEMPLATES.map((template) => {
      const config = this.getTemplateConfigById(template.id);
      return {
        id: template.id,
        ...config,
      };
    });
  }
}
