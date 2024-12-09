import { create } from "zustand";
import { TemplatesSDK } from "brahma-templates-sdk";
import { signTypedData } from "@wagmi/core";
import { Address, fromHex } from "viem";

import { TaskIdStatusType } from "./types";
import { SupportedChainIds, TAsset } from "@/types";
import { fetchAssetsBalanceMultiCall, sortAssets } from "@/utils";
import { SCAM_TOKEN_WORDS } from "@/constants";
import { wagmiConfig } from "@/wagmi";
import { dispatchToast } from "../shared/components";

const API_KEY = "<your-api-key>";

const sdk = new TemplatesSDK(API_KEY);

type Store = {
  loading: boolean;
  deploymentStatus: {
    status: TaskIdStatusType;
    taskId: string;
  } | null;
  signature: string | null;
  preComputedConsoleAddress: Address | null;
  balances: {
    data: TAsset[];
    loading: boolean;
  };
  eoaBalances: {
    data: TAsset[];
    loading: boolean;
  };
  feeEstimateSignature: string | null;
  feeEstimate: string | null;
  fetchPreComputedConsoleAddress: (
    owner: Address,
    chainId: SupportedChainIds,
    feeToken: Address
  ) => Promise<void>;
  generateAndDeploySubAccount: (
    eoa: Address,
    chainId: SupportedChainIds,
    feeToken: Address,
    feeEstimate: string,
    tokens: Address[],
    amounts: string[]
  ) => Promise<void>;
  fetchDeploymentStatus: (taskId: string) => Promise<void>;
  fetchPreComputedConsoleBalances: (assets: TAsset[]) => Promise<void>;
  fetchEoaAssets: (eoa: Address, assets: TAsset[]) => Promise<void>;
};

const useStore = create<Store>((set, get) => ({
  loading: false,
  deploymentStatus: null,
  balances: {
    data: [],
    loading: false,
  },
  eoaBalances: {
    data: [],
    loading: false,
  },
  preComputedConsoleAddress: null,
  signature: null,
  preComputedConsole: null,
  feeEstimate: null,
  feeEstimateSignature: null,
  fetchPreComputedConsoleAddress: async (owner, chainId, feeToken) => {
    set((state) => ({ ...state, loading: true }));
    try {
      const data = await sdk.publicDeployer.fetchPreComputeAddress(
        owner,
        chainId,
        feeToken
      );

      if (
        !data ||
        !data.feeEstimate ||
        !data.feeEstimateSignature ||
        !data.precomputedAddress
      ) {
        throw new Error("Invalid data received from fetchPreComputeAddress");
      }

      set((state) => ({
        ...state,
        loading: false,
        feeEstimate: data.feeEstimate,
        feeEstimateSignature: data.feeEstimateSignature,
        preComputedConsoleAddress: data.precomputedAddress,
      }));
    } catch (err: any) {
      console.log(`Error fetching precompute address: ${err}`);
      dispatchToast({
        id: "fetch-precompute-address-error",
        title: "Error fetching precompute address",
        description: {
          value:
            err?.message ||
            "An error occurred while fetching precompute address",
        },
        type: "error",
      });
      set((state) => ({ ...state, loading: false })); // Ensure loading is set to false on error
    }
  },
  generateAndDeploySubAccount: async (
    eoa,
    chainId,
    feeToken,
    feeEstimate,
    tokens,
    amounts
  ) => {
    const { preComputedConsoleAddress, feeEstimateSignature } = get();

    const HARDCODED_REGISTRY_ID = "f7b8c17b-1a8b-4707-a397-31f19057250b";

    if (!preComputedConsoleAddress) {
      dispatchToast({
        id: "fetch-precomputed-account-address-error",
        title: "Error fetching precomputed account address",
        description: {
          value: "Precomputed account address not found",
        },
        type: "error",
      });
      return;
    }

    set((state) => ({ ...state, loading: true }));
    try {
      // Generate Automation SubAccount
      const generateData =
        await sdk.publicDeployer.generateAutomationSubAccount(
          eoa,
          preComputedConsoleAddress,
          chainId,
          HARDCODED_REGISTRY_ID,
          feeToken,
          feeEstimate,
          tokens,
          amounts,
          {
            duration: 0,
            tokenInputs: {},
            tokenLimits: {},
          }
        );

      if (!generateData || !feeEstimateSignature) {
        dispatchToast({
          id: "fetch-signature-error",
          title: "Error fetching signature",
          description: {
            value: "An error occurred while fetching signature",
          },
          type: "error",
        });
        return;
      }

      const {
        signaturePayload: { domain, message, types, primaryType },
        subAccountPolicyCommit,
        subscriptionDraftID,
      } = generateData;

      const signature = await signTypedData(wagmiConfig, {
        domain: {
          verifyingContract: domain.verifyingContract,
          chainId: fromHex(domain.chainId as Address, "number"),
        },
        types,
        primaryType,
        message,
      });

      if (!signature) {
        dispatchToast({
          id: "upgrade-console-error",
          type: "error",
          title: "Error",
          description: {
            value: "User rejected the transaction",
          },
        });
        return;
      }

      // Deploy Brahma Account
      const deployData = await sdk.publicDeployer.deployBrahmaAccount(
        eoa,
        chainId,
        HARDCODED_REGISTRY_ID,
        subscriptionDraftID,
        subAccountPolicyCommit,
        feeToken,
        tokens,
        amounts,
        signature, // Use the signature obtained from the previous step
        feeEstimateSignature,
        feeEstimate,
        {}
      );

      if (!deployData) {
        dispatchToast({
          id: "deploy-account-error",
          title: "Error deploying account and sub-account",
          description: {
            value: "An error occurred during deployment",
          },
          type: "error",
        });
        return;
      }

      dispatchToast({
        id: "deployment-status-pending",
        title: "Deployment Status",
        description: {
          value: "The deployment is currently pending.",
        },
        type: "loading",
      });

      // Update state with taskId and set loading to false
      set((state) => ({
        ...state,
        deploymentStatus: {
          status: "pending",
          taskId: deployData.taskId,
        },
        signature, // Update the state with the signature
        loading: false,
      }));
    } catch (err: any) {
      console.error("Error in generate and deploy sub-account:", err);
      dispatchToast({
        id: "generate-deploy-error",
        title: "Error in generate and deploy sub-account",
        description: {
          value: err?.message || "An error occurred during the process",
        },
        type: "error",
      });
    }
  },
  fetchDeploymentStatus: async (taskId) => {
    try {
      const data = await sdk.publicDeployer.fetchDeploymentStatus(taskId);

      if (!data) {
        dispatchToast({
          id: "fetch-deployment-status-error",
          title: "Error fetching deployment status",
          description: {
            value: "An error occurred while fetching deployment status",
          },
          type: "error",
        });
        return;
      }

      switch (data.status) {
        case "pending":
          dispatchToast({
            id: "deployment-status-pending",
            title: "Deployment Status",
            description: {
              value: "The deployment is currently pending.",
            },
            type: "loading",
          });
          break;
        case "executing":
          dispatchToast({
            id: "deployment-status-executing",
            title: "Deployment Status",
            description: {
              value: "The deployment is currently executing.",
            },
            type: "loading",
          });
          break;
        case "cancelled":
          dispatchToast({
            id: "deployment-status-cancelled",
            title: "Deployment Status",
            description: {
              value: "The deployment has been cancelled.",
            },
            type: "error",
          });
          break;
        case "successful":
          dispatchToast({
            id: "deployment-status-successful",
            title: "Deployment Status",
            description: {
              value:
                "Your account and sub-account have been deployed successfully",
            },
            type: "success",
          });
          break;
        case "failed":
          dispatchToast({
            id: "deployment-status-failed",
            title: "Deployment Status",
            description: {
              value: "The deployment has failed.",
            },
            type: "error",
          });
          break;
        default:
          dispatchToast({
            id: "deployment-status-unknown",
            title: "Deployment Status",
            description: {
              value: "The deployment status is unknown.",
            },
            type: "error",
          });
          break;
      }

      set((state) => ({
        ...state,
        deploymentStatus: {
          status: data.status,
          taskId: taskId,
        },
      }));
    } catch (err: any) {
      console.error("Error fetching deployment status:", err);
      dispatchToast({
        id: "fetch-deployment-status-error",
        title: "Error fetching deployment status",
        description: {
          value:
            err?.message ||
            "An error occurred while fetching deployment status",
        },
        type: "error",
      });
    }
  },
  fetchPreComputedConsoleBalances: async (assets) => {
    const { preComputedConsoleAddress } = get();

    if (!preComputedConsoleAddress) {
      dispatchToast({
        id: "fetch-precomputed-account-balances-error",
        title: "Error fetching precomputed account balances",
        description: {
          value: "Precomputed account address not found",
        },
        type: "error",
      });
      return;
    }

    set((state) => ({ balances: { ...state.balances, loading: true } }));

    const balances = await fetchAssetsBalanceMultiCall({
      assets: assets,
      accountAddress: preComputedConsoleAddress,
    });

    const scamTokenAddresses = ["0x33567e90505edde4c6331e12e01860301115ba84"];

    const filteredUserAssets = sortAssets(
      balances.filter((asset) => {
        const isNonZeroBalance =
          !asset.balanceOf || asset.balanceOf.value !== BigInt(0);

        const containsScamWords = SCAM_TOKEN_WORDS.some((scamWord) =>
          asset.name.toLowerCase().includes(scamWord)
        );

        const containsScamAddresses = scamTokenAddresses.includes(
          asset.address.toLowerCase()
        );

        return isNonZeroBalance && !containsScamWords && !containsScamAddresses;
      })
    );

    set({
      balances: {
        data: filteredUserAssets,
        loading: false,
      },
    });
  },
  fetchEoaAssets: async (eoa, assets) => {
    try {
      set((state) => ({ balances: { ...state.balances, loading: true } }));

      const balances = await fetchAssetsBalanceMultiCall({
        assets: assets,
        accountAddress: eoa,
      });

      const scamTokenAddresses = ["0x33567e90505edde4c6331e12e01860301115ba84"];

      const filteredUserAssets = sortAssets(
        balances.filter((asset) => {
          const isNonZeroBalance =
            !asset.balanceOf || asset.balanceOf.value !== BigInt(0);

          const containsScamWords = SCAM_TOKEN_WORDS.some((scamWord) =>
            asset.name.toLowerCase().includes(scamWord)
          );

          const containsScamAddresses = scamTokenAddresses.includes(
            asset.address.toLowerCase()
          );

          return (
            isNonZeroBalance && !containsScamWords && !containsScamAddresses
          );
        })
      );

      set({
        eoaBalances: {
          data: filteredUserAssets,
          loading: false,
        },
      });
    } catch (err) {
      console.error("error on fetching eoa assets", err);
      set({ balances: { data: [], loading: false } });
    }
  },
}));

export default useStore;
