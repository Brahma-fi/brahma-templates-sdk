import axios, { AxiosInstance } from "axios";
import {
  SubscribeAutomationParams,
  UpdateAutomationParams,
  VendorCancelAutomationParams,
} from "./types";
import {
  GenerateCalldataResponse,
  GeneratePayload,
} from "../CoreActions/types";
import routes from "@/routes";

export class AutomationContextFetcher {
  private readonly axiosInstance: AxiosInstance;

  constructor(apiKey: string, baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "x-api-key": apiKey,
      },
    });
  }

  async subscribeToAutomation(
    params: SubscribeAutomationParams
  ): Promise<GenerateCalldataResponse> {
    try {
      const response = await this.axiosInstance.post<GenerateCalldataResponse>(
        routes.generateCalldata,
        {
          id: "AUTOMATION",
          action: "SUBSCRIBE",
          params,
        } as GeneratePayload<SubscribeAutomationParams, "SUBSCRIBE">
      );

      return response.data;
    } catch (err: any) {
      console.error(`Error subscribing to automation: ${err.message}`);
      throw err;
    }
  }

  async updateAutomation(
    params: UpdateAutomationParams
  ): Promise<GenerateCalldataResponse> {
    try {
      const response = await this.axiosInstance.post<GenerateCalldataResponse>(
        routes.generateCalldata,
        {
          id: "AUTOMATION",
          action: "UPDATE",
          params,
        } as GeneratePayload<UpdateAutomationParams, "UPDATE">
      );

      return response.data;
    } catch (err: any) {
      console.error(`Error updating automation: ${err.message}`);
      throw err;
    }
  }

  async cancelAutomation(
    params: VendorCancelAutomationParams
  ): Promise<GenerateCalldataResponse> {
    try {
      const response = await this.axiosInstance.post<GenerateCalldataResponse>(
        routes.generateCalldata,
        {
          id: "AUTOMATION",
          action: "CANCEL",
          params,
        } as GeneratePayload<VendorCancelAutomationParams, "CANCEL">
      );

      return response.data;
    } catch (err: any) {
      console.error(`Error updating automation: ${err.message}`);
      throw err;
    }
  }
}
