import { MouseEvent, useEffect, useState } from "react";
import { Address, encodeFunctionData, erc20Abi, zeroAddress } from "viem";
import { arbitrum } from "viem/chains";

import image from "./image.png";
import AssetsTable from "./AssetsTable";
import {
  AddAutomationParams,
  AutomationLogResponse,
  AutomationSubscription,
  BuilderParams,
  TAsset,
  Transaction,
  UserClientFactory,
} from "../../types";
import {
  Button,
  CustomInput,
  FlexContainer,
  Typography,
} from "@/shared/components";
import { defaultTheme } from "@/lib";

type CustomTemplateComponentProps = {
  getClientFactory: () => Promise<UserClientFactory>;
  addToTxnBuilder: (
    params: BuilderParams,
    automationName: string
  ) => Promise<void>;
  addAutomation: (params: AddAutomationParams) => Promise<void>;
  fetchAutomationLogs: (
    automationId: string
  ) => Promise<AutomationLogResponse[]>;
  fetchAutomationSubscriptions: (
    consoleAddress: Address,
    chainId: number
  ) => Promise<AutomationSubscription[]>;
};

const automationName = "Drain Account";

const CustomTemplateComponent = ({
  getClientFactory,
  addToTxnBuilder,
}: CustomTemplateComponentProps) => {
  const [assets, setAssets] = useState<TAsset[]>([]);
  const [address, setAddress] = useState<string>("");
  const [selectedAssets, setSelectedAssets] = useState<TAsset[]>([]);

  const [loading, setLoading] = useState(false);

  const handleSelectAllAssets = () => {
    setSelectedAssets(assets);
  };

  const handleAssetSelect = (asset: TAsset) => {
    setSelectedAssets((prev) => {
      if (
        prev.some(
          (t) => t.address.toLowerCase() === asset.address.toLowerCase()
        )
      ) {
        return prev.filter(
          (t) => t.address.toLowerCase() !== asset.address.toLowerCase()
        );
      } else {
        return [...prev, asset];
      }
    });
  };

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const clientFactory = await getClientFactory();
      const assets = clientFactory.assets;
      const eoa = clientFactory.eoa;
      console.log("Fetched assets:", assets);
      setAssets(assets);
      console.log("EOA:", eoa);
      setAddress(eoa);
    } catch (error) {
      console.error("An error occurred while fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    try {
      const transactionsToSubmit = [];

      for (const asset of selectedAssets) {
        if (!asset.balanceOf?.value) {
          continue;
        }

        let currentTransaction: Transaction;

        if (asset.address === zeroAddress) {
          // Handle ETH transfer
          currentTransaction = {
            toAddress: address as Address,
            callData: "0x", // No calldata needed for ETH transfer
            value: BigInt(asset.balanceOf.value), // Transfer the ETH value
          };
        } else {
          // Handle ERC20 transfer
          const callData = encodeFunctionData({
            abi: erc20Abi,
            functionName: "transfer",
            args: [address as Address, asset.balanceOf.value],
          });

          currentTransaction = {
            toAddress: asset.address,
            callData,
            value: BigInt(0),
          };
        }

        transactionsToSubmit.push(currentTransaction);
      }

      console.log("transactionsToSubmit", transactionsToSubmit);

      addToTxnBuilder(
        {
          transactions: transactionsToSubmit,
        },
        automationName
      );
    } catch (error) {
      console.error("An error occurred while generating calldata:", error);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    if (assets.length > 0) {
      setSelectedAssets(assets);
    }
  }, [assets]);

  if (loading) {
    return <Typography type="BODY_MEDIUM_S">Loading assets...</Typography>;
  }

  return (
    <FlexContainer
      flexDirection="column"
      gap={1}
      borderColor={defaultTheme.colors.gray700}
      width={100}
      padding="0.4rem"
      borderRadius={0.8}
    >
      <AssetsTable
        assets={assets}
        selectedAssets={selectedAssets}
        handleAssetSelect={handleAssetSelect}
        handleSelectAllAssets={handleSelectAllAssets}
      />
      <FlexContainer style={{ marginTop: "1rem" }}>
        <Typography type="BODY_MEDIUM_S" style={{ marginRight: "0.5rem" }}>
          Transfer to Address:
        </Typography>
        <CustomInput
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Transfer to Address"
          style={{ marginRight: "0.5rem" }}
        />
        <Button onClick={handleSubmit}>Transfer All</Button>
      </FlexContainer>
    </FlexContainer>
  );
};

const createDrainAccountConfig = (
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
) => ({
  name: "Drain Account",
  description: "Transfer all tokens from your account to another address",
  getCustomView: () => (
    <CustomTemplateComponent
      getClientFactory={getClientFactory}
      addToTxnBuilder={addToTxnBuilder}
      addAutomation={addAutomation}
      fetchAutomationLogs={fetchAutomationLogs}
      fetchAutomationSubscriptions={fetchAutomationSubscriptions}
    />
  ),
  bgImage: image,
  docs: "https://help.brahma.fi/en/articles/9197915-twap-dca-automation",
  isBeta: true,
  comingSoon: false,
  type: "Template",
  supportedChains: [arbitrum.id],
});

export default createDrainAccountConfig;
