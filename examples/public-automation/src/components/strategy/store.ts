import { create } from "zustand";
import { TemplatesSDK } from "brahma-templates-sdk-beta";
import { signTypedData, sendTransaction, waitForTransactionReceipt, readContract } from "@wagmi/core";
import { Address, fromHex, encodeFunctionData } from "viem";
import { TaskIdStatusType } from "./types";
import { SupportedChainIds, TAsset } from "@/types";
import { fetchAssetsBalanceMultiCall, sortAssets } from "@/utils";
import { SCAM_TOKEN_WORDS, OPERATOR_ADDRESS } from "@/constants";
import { wagmiConfig } from "@/wagmi";
import { dispatchToast } from "../shared/components";

const API_KEY = "<your-api-key>";
const HARDCODED_REGISTRY_ID = "33238f96-1314-4f95-838f-d114bbd281ce";
const REWARD_TOKEN = "0xda1F8EA667dc5600F5f654DF44b47F1639a83DD1";
const REWARD_INTERVAL = "3600";

const sdk = new TemplatesSDK(API_KEY);

type Store = {
  loading: boolean;
  deploymentStatus: {
    status: TaskIdStatusType;
    taskId: string;
    txHash?: string;
  } | null;
  signature: string | null;
  preComputedConsoleAddress: Address | null;
  balances: { data: TAsset[]; loading: boolean };
  eoaBalances: { data: TAsset[]; loading: boolean };
  feeEstimateSignature: string | null;
  feeEstimate: string | null;
  fetchPreComputedConsoleAddress: (owner: Address, chainId: SupportedChainIds, feeToken: Address) => Promise<void>;
  generateAndApproveSubAccount: (eoa: Address, chainId: SupportedChainIds, feeToken: Address, feeEstimate: string, tokens: Address[], amounts: string[]) => Promise<{ txHash?: string }>;
  fetchDeploymentStatus: (taskId: string) => Promise<void>;
  fetchPreComputedConsoleBalances: (assets: TAsset[]) => Promise<void>;
  fetchEoaAssets: (eoa: Address, assets: TAsset[]) => Promise<void>;
};

const useStore = create<Store>((set, get) => ({
  loading: false,
  deploymentStatus: null,
  balances: { data: [], loading: false },
  eoaBalances: { data: [], loading: false },
  preComputedConsoleAddress: null,
  signature: null,
  feeEstimate: null,
  feeEstimateSignature: null,

  fetchPreComputedConsoleAddress: async (owner, chainId, feeToken) => {
    set((state) => ({ ...state, loading: true }));
    try {
      const data = await sdk.publicDeployer.fetchPreComputeAddress(owner, chainId, feeToken);

      if (!data?.feeEstimate || !data?.feeEstimateSignature || !data?.precomputedAddress) {
        throw new Error("Invalid response from fetchPreComputeAddress");
      }

      set((state) => ({
        ...state,
        feeEstimate: data.feeEstimate,
        feeEstimateSignature: data.feeEstimateSignature,
        preComputedConsoleAddress: data.precomputedAddress,
      }));
    } catch (err: any) {
      dispatchToast({
        id: "compute-address-error",
        title: "Setup Failed",
        description: { value: err?.message || "Failed to compute automation address" },
        type: "error",
      });
      throw err;
    } finally {
      set((state) => ({ ...state, loading: false }));
    }
  },

  generateAndApproveSubAccount: async (eoa, chainId, feeToken, feeEstimate, tokens, amounts) => {
    const { preComputedConsoleAddress, feeEstimateSignature } = get();
    if (!preComputedConsoleAddress) throw new Error("Console address not computed");

    set((state) => ({ ...state, loading: true }));
    try {
      // Step 1: Generate automation data
      dispatchToast({
        id: "generate-data",
        title: "Setup in Progress",
        description: { value: "Generating automation data..." },
        type: "loading",
      });

      const generateData = await sdk.publicDeployer.generateAutomationSubAccount(
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
          tokenInputs: { "0xCeeeeCeeeCeCeeCeCeCeeCCCeeeeCeeeeeeeCCeC": "0" },
          tokenLimits: { [REWARD_TOKEN]: "100000" },
        },
        {
          every: REWARD_INTERVAL,
          userAddress: eoa,
          rewardToken: REWARD_TOKEN,
        }
      );

      if (!generateData || !feeEstimateSignature) {
        throw new Error("Failed to generate automation data");
      }

      // Step 2: Get signature
      const { signaturePayload, subAccountPolicyCommit, subscriptionDraftID } = generateData;
      const signature = await signTypedData(wagmiConfig, {
        domain: {
          verifyingContract: signaturePayload.domain.verifyingContract,
          chainId: fromHex(signaturePayload.domain.chainId as Address, "number"),
        },
        types: signaturePayload.types,
        primaryType: signaturePayload.primaryType,
        message: signaturePayload.message,
      });

      if (!signature) throw new Error("User rejected signature");

      // Step 3: Compute deployment addresses
      const deployData = await sdk.publicDeployer.computeDeploymentAddresses(
        eoa,
        chainId,
        HARDCODED_REGISTRY_ID,
        subscriptionDraftID,
        subAccountPolicyCommit,
        feeToken,
        tokens,
        amounts,
        signature,
        feeEstimateSignature,
        feeEstimate,
        {
          every: REWARD_INTERVAL,
          userAddress: eoa,
          rewardToken: REWARD_TOKEN,
        }
      );

      if (!deployData?.subAccountAddress) throw new Error("Failed to compute deployment addresses");

      // Step 4: Check and set operator
      const operatorStatus = await readContract(wagmiConfig, {
        address: OPERATOR_ADDRESS as Address,
        abi: [{
          inputs: [
            { internalType: "address", name: "", type: "address" },
            { internalType: "address", name: "", type: "address" }
          ],
          name: "operators",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function"
        }],
        functionName: 'operators',
        args: [eoa, deployData.subAccountAddress as Address]
      });

      if (operatorStatus === BigInt(0)) {
        dispatchToast({
          id: "toggle-operator",
          title: "Setup in Progress",
          description: { value: "Enabling automated claiming..." },
          type: "loading",
        });

        const tx = await sendTransaction(wagmiConfig, {
          to: OPERATOR_ADDRESS as Address,
          data: encodeFunctionData({
            abi: [{
              inputs: [
                { internalType: "address", name: "user", type: "address" },
                { internalType: "address", name: "operator", type: "address" }
              ],
              name: "toggleOperator",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function"
            }],
            functionName: 'toggleOperator',
            args: [eoa, deployData.subAccountAddress as Address]
          })
        });

        const receipt = await waitForTransactionReceipt(wagmiConfig, { hash: tx });
        if (receipt.status !== 'success') throw new Error("Failed to enable automated claiming");
      }

      // Step 5: Deploy automation
      dispatchToast({
        id: "deploy-automation",
        title: "Setup in Progress",
        description: { value: "Deploying automation console..." },
        type: "loading",
      });

      const finalDeployData = await sdk.publicDeployer.deployBrahmaAccount(
        eoa,
        chainId,
        HARDCODED_REGISTRY_ID,
        subscriptionDraftID,
        subAccountPolicyCommit,
        feeToken,
        tokens,
        amounts,
        signature,
        feeEstimateSignature,
        feeEstimate,
        {
          every: REWARD_INTERVAL,
          userAddress: eoa,
          rewardToken: REWARD_TOKEN
        }
      );

      if (!finalDeployData?.taskId) throw new Error("Failed to deploy automation");

      set((state) => ({
        ...state,
        deploymentStatus: {
          status: "pending",
          taskId: finalDeployData.taskId,
         
        },
        signature,
      }));

      return { taskId: finalDeployData.taskId };
    } catch (err: any) {
      dispatchToast({
        id: "setup-error",
        title: "Setup Failed",
        description: { value: err?.message || "Failed to setup automation" },
        type: "error",
      });
      throw err;
    } finally {
      set((state) => ({ ...state, loading: false }));
    }
  },

  fetchDeploymentStatus: async (taskId) => {
    try {
      const data = await sdk.publicDeployer.fetchDeploymentStatus(taskId);
      if (!data) throw new Error("Invalid deployment status response");
      console.log("realyData",data)
      const statusMessages = {
        pending: "Setup in progress...",
        executing: "Finalizing setup...",
        successful: "wSwell auto-claim is now active",
        failed: "Setup failed",
        cancelled: "Setup was cancelled",
      };

      const messageType = data.status === 'successful' ? 'success' : 
                         data.status === 'failed' || data.status === 'cancelled' ? 'error' : 
                         'loading';

      // Show toast and open explorer
      if (data.status === 'successful' && data.outputTransactionHash) {
        window.open(`https://explorer.swellnetwork.io/tx/${data.outputTransactionHash}`, '_blank');
         // Trigger indexer
         try {
          await fetch(`https://dev.console.fi/v1/vendor/indexer/process/${data.outputTransactionHash}/1923`, {
            method: 'POST',
            headers: {
              'x-api-key': 'f27abba2-0749-4d95-aa3d-3c6beb95f59a'
            }
          });
        } catch (err) {
          console.error('Failed to trigger indexer:', err);
        }
      }
      
      dispatchToast({
        id: `deployment-${data.status}`,
        title: "Automation Status",
        description: { value: statusMessages[data.status] || "Unknown status" },
        type: messageType,
      });

      set((state) => ({
        ...state,
        deploymentStatus: {
          status: data.status,
          taskId,
          txHash: data.outputTransactionHash,
        },
      }));
    } catch (err: any) {
      console.error("Deployment status error:", err);
    }
  },

  fetchPreComputedConsoleBalances: async (assets) => {
    const { preComputedConsoleAddress } = get();
    if (!preComputedConsoleAddress) throw new Error("Console address not found");

    set((state) => ({ balances: { ...state.balances, loading: true } }));
    try {
      const balances = await fetchAssetsBalanceMultiCall({
        assets,
        accountAddress: preComputedConsoleAddress,
      });

      const filteredAssets = sortAssets(
        balances.filter((asset) => {
          const hasBalance = !asset.balanceOf || asset.balanceOf.value !== BigInt(0);
          const isNotScam = !SCAM_TOKEN_WORDS.some(word => 
            asset.name.toLowerCase().includes(word)
          );
          return hasBalance && isNotScam;
        })
      );

      set({ balances: { data: filteredAssets, loading: false } });
    } catch (err) {
      set({ balances: { data: [], loading: false } });
      throw err;
    }
  },

  fetchEoaAssets: async (eoa, assets) => {
    set((state) => ({ eoaBalances: { ...state.eoaBalances, loading: true } }));
    try {
      const balances = await fetchAssetsBalanceMultiCall({
        assets,
        accountAddress: eoa,
      });

      const filteredAssets = sortAssets(
        balances.filter((asset) => {
          const hasBalance = !asset.balanceOf || asset.balanceOf.value !== BigInt(0);
          const isNotScam = !SCAM_TOKEN_WORDS.some(word => 
            asset.name.toLowerCase().includes(word)
          );
          return hasBalance && isNotScam;
        })
      );

      set({ eoaBalances: { data: filteredAssets, loading: false } });
    } catch (err) {
      set({ eoaBalances: { data: [], loading: false } });
      throw err;
    }
  },
}));

export default useStore;