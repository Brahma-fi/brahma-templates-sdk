import { create } from "zustand";
import { TemplatesSDK } from "brahma-templates-sdk-beta";
import { signTypedData,sendTransaction,waitForTransactionReceipt, readContract } from "@wagmi/core";
import { Address, fromHex, encodeFunctionData, } from "viem";

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
  generateAndApproveSubAccount: (
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

    const HARDCODED_REGISTRY_ID = "33238f96-1314-4f95-838f-d114bbd281ce";

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
            tokenInputs: {
              "0xCeeeeCeeeCeCeeCeCeCeeCCCeeeeCeeeeeeeCCeC":"0"
            },
            tokenLimits: {},
          },
          {
            userAddress:eoa,
            rewardToken:"0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae"
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
        {
          userAddress:eoa,
          rewardToken:"0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae"
        }
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
  generateAndApproveSubAccount: async (
    eoa,
    chainId,
    feeToken,
    feeEstimate,
    tokens,
    amounts
  ) => {
    const { preComputedConsoleAddress, feeEstimateSignature } = get();

    const HARDCODED_REGISTRY_ID = "33238f96-1314-4f95-838f-d114bbd281ce";

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
            tokenInputs: {
              "0xCeeeeCeeeCeCeeCeCeCeeCCCeeeeCeeeeeeeCCeC":"0"
            },
            tokenLimits: {},
          },
          {
            userAddress:eoa,
            rewardToken:"0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae"
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
      const deployData = await sdk.publicDeployer.computeDeploymentAddresses(
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
        {
          userAddress:eoa,
          rewardToken:"0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae"
        }
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
      const operatorStatus = await readContract(wagmiConfig,{
        address: "0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae" as Address,
        abi: [
          {
            inputs: [
              { internalType: "address", name: "", type: "address" },
              { internalType: "address", name: "", type: "address" }
            ],
            name: "operators",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function"
          }
        ],
        functionName: 'operators',
        args: [eoa, deployData.subAccountAddress as Address]
      });

      if (operatorStatus === BigInt(0)) {
     const tx = await sendTransaction(wagmiConfig,{
        to:"0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae" as Address,
        data: encodeFunctionData({
          abi: [
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "inputs": [],
                "name": "InvalidDispute",
                "type": "error"
            },
            {
                "inputs": [],
                "name": "InvalidLengths",
                "type": "error"
            },
            {
                "inputs": [],
                "name": "InvalidProof",
                "type": "error"
            },
            {
                "inputs": [],
                "name": "InvalidUninitializedRoot",
                "type": "error"
            },
            {
                "inputs": [],
                "name": "NoDispute",
                "type": "error"
            },
            {
                "inputs": [],
                "name": "NotGovernor",
                "type": "error"
            },
            {
                "inputs": [],
                "name": "NotTrusted",
                "type": "error"
            },
            {
                "inputs": [],
                "name": "NotWhitelisted",
                "type": "error"
            },
            {
                "inputs": [],
                "name": "UnresolvedDispute",
                "type": "error"
            },
            {
                "inputs": [],
                "name": "ZeroAddress",
                "type": "error"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "previousAdmin",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "newAdmin",
                        "type": "address"
                    }
                ],
                "name": "AdminChanged",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "beacon",
                        "type": "address"
                    }
                ],
                "name": "BeaconUpgraded",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "token",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "Claimed",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "_disputeAmount",
                        "type": "uint256"
                    }
                ],
                "name": "DisputeAmountUpdated",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint48",
                        "name": "_disputePeriod",
                        "type": "uint48"
                    }
                ],
                "name": "DisputePeriodUpdated",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "bool",
                        "name": "valid",
                        "type": "bool"
                    }
                ],
                "name": "DisputeResolved",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "_disputeToken",
                        "type": "address"
                    }
                ],
                "name": "DisputeTokenUpdated",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "reason",
                        "type": "string"
                    }
                ],
                "name": "Disputed",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint8",
                        "name": "version",
                        "type": "uint8"
                    }
                ],
                "name": "Initialized",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "bool",
                        "name": "isEnabled",
                        "type": "bool"
                    }
                ],
                "name": "OperatorClaimingToggled",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "operator",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "bool",
                        "name": "isWhitelisted",
                        "type": "bool"
                    }
                ],
                "name": "OperatorToggled",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "token",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "Recovered",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [],
                "name": "Revoked",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "bytes32",
                        "name": "merkleRoot",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "internalType": "bytes32",
                        "name": "ipfsHash",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint48",
                        "name": "endOfDisputePeriod",
                        "type": "uint48"
                    }
                ],
                "name": "TreeUpdated",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "eoa",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "bool",
                        "name": "trust",
                        "type": "bool"
                    }
                ],
                "name": "TrustedToggled",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "implementation",
                        "type": "address"
                    }
                ],
                "name": "Upgraded",
                "type": "event"
            },
            {
                "inputs": [],
                "name": "accessControlManager",
                "outputs": [
                    {
                        "internalType": "contract IAccessControlManager",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "canUpdateMerkleRoot",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address[]",
                        "name": "users",
                        "type": "address[]"
                    },
                    {
                        "internalType": "address[]",
                        "name": "tokens",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "amounts",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "bytes32[][]",
                        "name": "proofs",
                        "type": "bytes32[][]"
                    }
                ],
                "name": "claim",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "claimed",
                "outputs": [
                    {
                        "internalType": "uint208",
                        "name": "amount",
                        "type": "uint208"
                    },
                    {
                        "internalType": "uint48",
                        "name": "timestamp",
                        "type": "uint48"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "merkleRoot",
                        "type": "bytes32"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "disputeAmount",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "disputePeriod",
                "outputs": [
                    {
                        "internalType": "uint48",
                        "name": "",
                        "type": "uint48"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "disputeToken",
                "outputs": [
                    {
                        "internalType": "contract IERC20",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "reason",
                        "type": "string"
                    }
                ],
                "name": "disputeTree",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "disputer",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "endOfDisputePeriod",
                "outputs": [
                    {
                        "internalType": "uint48",
                        "name": "",
                        "type": "uint48"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getMerkleRoot",
                "outputs": [
                    {
                        "internalType": "bytes32",
                        "name": "",
                        "type": "bytes32"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "contract IAccessControlManager",
                        "name": "_accessControlManager",
                        "type": "address"
                    }
                ],
                "name": "initialize",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "lastTree",
                "outputs": [
                    {
                        "internalType": "bytes32",
                        "name": "merkleRoot",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "ipfsHash",
                        "type": "bytes32"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "onlyOperatorCanClaim",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "operators",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "proxiableUUID",
                "outputs": [
                    {
                        "internalType": "bytes32",
                        "name": "",
                        "type": "bytes32"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "tokenAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amountToRecover",
                        "type": "uint256"
                    }
                ],
                "name": "recoverERC20",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bool",
                        "name": "valid",
                        "type": "bool"
                    }
                ],
                "name": "resolveDispute",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "revokeTree",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_disputeAmount",
                        "type": "uint256"
                    }
                ],
                "name": "setDisputeAmount",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint48",
                        "name": "_disputePeriod",
                        "type": "uint48"
                    }
                ],
                "name": "setDisputePeriod",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "contract IERC20",
                        "name": "_disputeToken",
                        "type": "address"
                    }
                ],
                "name": "setDisputeToken",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    }
                ],
                "name": "toggleOnlyOperatorCanClaim",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "operator",
                        "type": "address"
                    }
                ],
                "name": "toggleOperator",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "eoa",
                        "type": "address"
                    }
                ],
                "name": "toggleTrusted",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "tree",
                "outputs": [
                    {
                        "internalType": "bytes32",
                        "name": "merkleRoot",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "ipfsHash",
                        "type": "bytes32"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "components": [
                            {
                                "internalType": "bytes32",
                                "name": "merkleRoot",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "ipfsHash",
                                "type": "bytes32"
                            }
                        ],
                        "internalType": "struct MerkleTree",
                        "name": "_tree",
                        "type": "tuple"
                    }
                ],
                "name": "updateTree",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "newImplementation",
                        "type": "address"
                    }
                ],
                "name": "upgradeTo",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "newImplementation",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                    }
                ],
                "name": "upgradeToAndCall",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            }
        ],
          functionName: 'toggleOperator',
          args: [eoa,deployData.subAccountAddress as Address]
        })
      })

      console.log(tx,"executed toggle operator")

    

      dispatchToast({
        id: "toggle-operator",
        title: "toggle operator ",
        description: {
          value: "toggled operator successfully. " + tx,
        },
        type: "success",
      });
    }else{
    dispatchToast({
      id: "toggle-operator-check",
      title: "toggle operator check",
      description: {
        value: "operator is already set ",
      },
      type: "success",
    });
  }

      // // Update state with taskId and set loading to false
      // set((state) => ({
      //   ...state,
      //   deploymentStatus: {
      //     status: "pending",
      //     taskId: deployData.taskId,
      //   },
      //   signature, // Update the state with the signature
      //   loading: false,
      // }));
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
