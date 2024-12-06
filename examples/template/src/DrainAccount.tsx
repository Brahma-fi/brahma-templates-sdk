import { MouseEvent, useEffect, useState } from "react";
import { Address, encodeFunctionData, erc20Abi, zeroAddress } from "viem";
import { TAsset, TemplatesSDK, Transaction } from "brahma-templates-sdk";

import AssetsTable from "./AssetsTable";
import usePolling from "./usePolling";

const automationName = "Drain Account";

const apiKey = "your-api-key";

const sdk = new TemplatesSDK(apiKey);

export const DrainAccount = () => {
  const [assets, setAssets] = useState<TAsset[]>([]);
  const [address, setAddress] = useState<string>("");
  const [selectedAssets, setSelectedAssets] = useState<TAsset[]>([]);

  const [showIframePrompt, setShowIframePrompt] = useState(false);

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
    console.log("fetching assets...");
    setLoading(true);
    try {
      const clientFactory = await sdk.getClientFactory();
      console.log("Client factory response:", clientFactory);

      if (!clientFactory) {
        console.error("Client factory is undefined or null.");
        setShowIframePrompt(true);
        return;
      }

      const assets = clientFactory.assets;
      console.log("Assets obtained:", assets);

      const eoa = clientFactory.eoa;
      console.log("EOA obtained:", eoa);

      setAssets(assets);
      setAddress(eoa);
    } catch (error) {
      setShowIframePrompt(true);
      console.log("error", error);
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

      await sdk.builderCaller.addToTxnBuilder(
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

  usePolling(async () => {
    await fetchAssets();
  }, 10000);

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    if (assets.length > 0) {
      setSelectedAssets(assets);
    }
  }, [assets]);

  if (loading) {
    return <p style={{ fontSize: "14px", color: "#333" }}>Loading assets...</p>;
  }

  if (showIframePrompt) {
    return (
      <p style={{ fontSize: "14px", color: "red" }}>
        Please open this app inside the parent iframe.
      </p>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        border: "1px solid #ccc",
        width: "100%",
        padding: "0.4rem",
        borderRadius: "0.8rem",
      }}
    >
      <AssetsTable
        assets={assets}
        selectedAssets={selectedAssets}
        handleAssetSelect={handleAssetSelect}
        handleSelectAllAssets={handleSelectAllAssets}
      />
      <div style={{ marginTop: "1rem", display: "flex", alignItems: "center" }}>
        <span style={{ fontSize: "14px", marginRight: "0.5rem" }}>
          Transfer to Address:
        </span>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Transfer to Address"
          style={{
            marginRight: "0.5rem",
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "0.4rem",
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "0.4rem",
            backgroundColor: "#007bff",
            color: "#fff",
          }}
        >
          Transfer All
        </button>
      </div>
    </div>
  );
};
