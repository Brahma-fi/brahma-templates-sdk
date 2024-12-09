import { readContracts } from "@wagmi/core";
import { Address, erc20Abi, multicall3Abi, zeroAddress } from "viem";

import { MULTICALL_CONTRACT_ADDRESS, SUPPORTED_CHAINS_IDS } from "../constants";
import { SupportedChainIds, TAsset } from "../types";
import { formatUnits } from "./actions";
import { wagmiConfig } from "../wagmi";

type FetchContractBalance = {
  accountAddress: Address;
  assets: TAsset[];
};

type TokenCall = {
  abi: unknown;
  functionName: string;
  address?: Address;
  args?: readonly unknown[];
};

type CallType = {
  result: bigint;
  status: "success" | "failure";
};

type TokenMultiCall = TokenCall[];

const MULTI_CALL_FUNCTIONS = ["balanceOf"];

export const fetchAssetsBalanceMultiCall = async ({
  accountAddress,
  assets,
}: FetchContractBalance): Promise<TAsset[]> => {
  try {
    const filteredByDeployedChains = assets.filter((asset) => {
      return SUPPORTED_CHAINS_IDS.includes(asset.chainId);
    });

    const getBalanceOfCall = (
      tokenAddress: Address,
      chainId: SupportedChainIds
    ): TokenMultiCall => {
      const erc20Config = {
        abi: erc20Abi,
        address: tokenAddress,
        chainId,
      } as const;

      return [
        {
          ...erc20Config,
          functionName: MULTI_CALL_FUNCTIONS[0],
          args: [accountAddress],
        },
      ];
    };

    const getETHBalanceOfCall = (
      chainId: SupportedChainIds
    ): TokenMultiCall => {
      const callConfig = {
        abi: multicall3Abi,
        address: MULTICALL_CONTRACT_ADDRESS,
        chainId,
      } as const;

      return [
        {
          ...callConfig,
          functionName: "getEthBalance",
          args: [accountAddress],
        },
      ];
    };

    const tokenCalls: TokenMultiCall = [];
    filteredByDeployedChains
      .filter((asset) => asset.address.includes("0x"))
      .forEach((token) => {
        const tokenCall =
          token.address.toLowerCase() === zeroAddress.toLowerCase()
            ? getETHBalanceOfCall(token.chainId)
            : getBalanceOfCall(token.address, token.chainId);

        tokenCall.forEach((call) => {
          tokenCalls.push(call);
        });
      });

    const multiCallResult = await readContracts(wagmiConfig, {
      allowFailure: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      contracts: tokenCalls as any,
      multicallAddress: MULTICALL_CONTRACT_ADDRESS,
      batchSize: 0, // 0 is unlimited
    });

    const assetsWithBalance = [];
    for (
      let i = 0;
      i < multiCallResult.length;
      i += MULTI_CALL_FUNCTIONS.length
    ) {
      const assetWithBalance = formatMultiCallResult(
        multiCallResult[i] as CallType,
        filteredByDeployedChains[i]
      );
      assetsWithBalance.push(assetWithBalance);
    }

    return assetsWithBalance;
  } catch (err) {
    console.error("[ERROR] on balances multiCall", err);
    return [];
  }
};

const formatMultiCallResult = (
  call: CallType,
  selectedAsset: TAsset
): TAsset => {
  try {
    const assetBalanceOf = call.result ? call.result : BigInt(0);

    const asset: TAsset = {
      ...selectedAsset,
      balanceOf: {
        decimals: selectedAsset.decimals,
        formatted: formatUnits(assetBalanceOf, selectedAsset.decimals),
        symbol: selectedAsset.name,
        value: assetBalanceOf,
      },
    };
    return asset;
  } catch (err) {
    console.error("[ERROR] on formatMultiCallResult", err);
    return {
      ...selectedAsset,
      prices: selectedAsset.prices || { default: 0 },
      value: "0", // formatUnits(totalAssetValue, selectedAsset.decimals),
      balanceOf: {
        decimals: selectedAsset.decimals,
        formatted: "0.0", //formatUnits(assetBalanceOf, selectedAsset.decimals),
        symbol: selectedAsset.name,
        value: BigInt(0), // assetBalanceOf
      },
    };
  }
};
