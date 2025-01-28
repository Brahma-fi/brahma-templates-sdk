import axios, { AxiosInstance } from "axios";
import { Address } from "viem";

import routes from "@/routes";

import {
  ActionNameToId,
  BridgeParams,
  GenerateCalldataResponse,
  GeneratePayload,
  SendParams,
  SwapParams,
} from "./types";

export class CoreActions {
  private readonly axiosInstance: AxiosInstance;

  constructor(apiKey: string, baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "x-api-key": apiKey,
      },
    });
  }

  async send(
    chainId: number,
    accountAddress: Address,
    params: SendParams
  ): Promise<GenerateCalldataResponse> {
    try {
      const response = await this.axiosInstance.post<GenerateCalldataResponse>(
        routes.generateCalldata,
        {
          id: "INTENT",
          action: "BUILD",
          params: {
            id: ActionNameToId.send,
            chainId: chainId,
            consoleAddress: accountAddress,
            params,
          },
        } as GeneratePayload<SendParams, "BUILD">
      );

      return response.data;
    } catch (err: any) {
      console.error(`Error generating calldata: ${err.message}`);
      throw err;
    }
  }

  async swap(
    chainId: number,
    accountAddress: Address,
    params: SwapParams
  ): Promise<GenerateCalldataResponse> {
    try {
      const response = await this.axiosInstance.post<GenerateCalldataResponse>(
        routes.generateCalldata,
        {
          id: "INTENT",
          action: "BUILD",
          params: {
            id: ActionNameToId.swap,
            chainId: chainId,
            consoleAddress: accountAddress,
            params,
          },
        } as GeneratePayload<SwapParams, "BUILD">
      );

      return response.data;
    } catch (err: any) {
      console.error(`Error generating calldata: ${err.message}`);
      throw err;
    }
  }

  async bridge(
    chainId: number,
    accountAddress: Address,
    params: BridgeParams
  ): Promise<GenerateCalldataResponse> {
    try {
      const response = await this.axiosInstance.post<GenerateCalldataResponse>(
        routes.generateCalldata,
        {
          id: "INTENT",
          action: "BUILD",
          params: {
            id: ActionNameToId.bridging,
            chainId: chainId,
            consoleAddress: accountAddress,
            params,
          },
        } as GeneratePayload<BridgeParams, "BUILD">
      );

      return response.data;
    } catch (err: any) {
      console.error(`Error generating calldata: ${err.message}`);
      throw err;
    }
  }
}
