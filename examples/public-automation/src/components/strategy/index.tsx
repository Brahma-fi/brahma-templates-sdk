import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Address, formatUnits } from "viem";
import { useWalletClient } from "wagmi";
import { wagmiConfig } from "@/wagmi";
import {
  sendTransaction,
  getBalance,
  waitForTransactionReceipt,
} from "@wagmi/core";
import useStore from "./store";
import { SupportedChainIds } from "@/types";
import { formatRejectMetamaskErrorMessage } from "@/utils";
import usePolling from "@/hooks/usePolling";
import {
  Button,
  FlexContainer,
  dispatchToast,
  Typography,
} from "../shared/components";
import { CheckCircle, LayoutDashboard } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

type StrategyPageProps = {
  eoa: Address;
  chainId: SupportedChainIds;
};

function StrategyPage({ eoa, chainId }: StrategyPageProps) {
  const { data: signer } = useWalletClient();
  const {
    feeEstimate,
    deploymentStatus,
    preComputedConsoleAddress,
    fetchDeploymentStatus,
    fetchPreComputedConsoleAddress,
    generateAndApproveSubAccount,
  } = useStore();

  const [isActivating, setIsActivating] = useState(false);
  const [fundsDeposited, setFundsDeposited] = useState(false);
  const [isAutomationActive, setIsAutomationActive] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  async function handleActivateAutomation() {
    const feeTokenAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

    try {
      setIsActivating(true);
      dispatchToast({
        id: "activation-start",
        title: "Activation Started",
        description: {
          value: "Step 1/2: Enabling automated claiming permissions...",
        },
        type: "info",
      });

      const result = await generateAndApproveSubAccount(
        eoa,
        chainId,
        feeTokenAddress,
        feeEstimate as any,
        [],
        []
      );

      if (result?.txHash) {
        setTxHash(result.txHash);
      }
    } catch (err: any) {
      console.error("Automation activation error:", err);
      dispatchToast({
        id: "activation-error",
        title: "Activation Failed",
        type: "error",
        description: {
          value:
            formatRejectMetamaskErrorMessage(err) ||
            "Failed to activate automation",
        },
      });
    } finally {
      setIsActivating(false);
    }
  }

  useEffect(() => {
    const feeTokenAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
    if (!signer) return;
    fetchPreComputedConsoleAddress(eoa, chainId, feeTokenAddress);
  }, [signer, eoa, chainId]);

  useEffect(() => {
    const checkBalance = async () => {
      if (!preComputedConsoleAddress || !feeEstimate) return;

      // If feeEstimate is 0, mark as deposited and return
      if (feeEstimate === "0") {
        setFundsDeposited(true);
        return;
      }

      try {
        const balance = await getBalance(wagmiConfig, {
          address: preComputedConsoleAddress as Address,
          blockTag: "latest",
          chainId,
          unit: "wei",
        });

        if (balance.value < BigInt(feeEstimate)) {
          dispatchToast({
            id: "deposit-required",
            title: "Setup Fee Required",
            description: {
              value: `Please confirm the transaction to proceed with automation setup`,
            },
            type: "info",
          });

          const tx = await sendTransaction(wagmiConfig, {
            to: preComputedConsoleAddress,
            value: BigInt(feeEstimate),
          });

          dispatchToast({
            id: "deposit-pending",
            title: "Setup in Progress",
            description: {
              value: "Step 1/2: Initializing automation setup...",
            },
            type: "loading",
          });

          await waitForTransactionReceipt(wagmiConfig, { hash: tx });

          dispatchToast({
            id: "deposit-success",
            title: "Setup Fee Confirmed",
            description: { value: "You can now proceed with activation" },
            type: "success",
          });

          setFundsDeposited(true);
        } else {
          setFundsDeposited(true);
        }
      } catch (error: any) {
        console.error("Setup error:", error);
        dispatchToast({
          id: "setup-error",
          title: "Setup Failed",
          description: {
            value:
              formatRejectMetamaskErrorMessage(error) ||
              "Failed to setup automation",
          },
          type: "error",
        });
      }
    };

    checkBalance();
  }, [preComputedConsoleAddress, feeEstimate]);

  usePolling(() => {
    if (!deploymentStatus?.taskId) return;
    if (
      ["successful", "failed", "cancelled"].includes(deploymentStatus.status)
    ) {
      if (deploymentStatus.status === "successful") {
        setIsAutomationActive(true);
        if (deploymentStatus.txHash) {
          setTxHash(deploymentStatus.txHash);
          dispatchToast({
            id: "automation-active",
            title: "Automation Active",
            description: {
              value: "Your wSwell rewards will now be claimed automatically",
            },
            type: "success",
          });
        }
      }
      return;
    }
    fetchDeploymentStatus(deploymentStatus.taskId);
  }, 5000);

  return (
    <FlexContainer flexDirection="column" width={100}>
      {/* Header with Wallet Button */}
      <FlexContainer
        justifyContent="space-between"
        alignItems="center"
        padding="2rem"
        style={{
          background:
            "linear-gradient(180deg, rgba(19,34,172,0.1) 0%, rgba(19,34,172,0) 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <img
          src="https://cdn.prod.website-files.com/6449b6fe52164e30db503746/66ff57f3aa9de72eae8aefd1_path-1-copy-48.svg"
          alt="Swell Logo"
          width={48}
          height={48}
        />
        <ConnectButton />
      </FlexContainer>

      {/* Main Content */}
      <FlexContainer
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "3rem 2rem",
          gap: "2rem",
        }}
        flexDirection="column"
      >
        {/* Title Section */}
        <FlexContainer flexDirection="column" gap={1}>
          <Typography
            type="TITLE_XL"
            style={{ color: "#FFFFFF", marginBottom: "0.5rem" }}
          >
            wSwell Auto-Claim Setup
          </Typography>
          <Typography type="BODY_MEDIUM_S" style={{ color: "#999999" }}>
            Enable automated claiming of your wSwell rewards
          </Typography>
        </FlexContainer>

        {/* Status Cards */}
        <FlexContainer flexDirection="column" gap={2}>
          {/* Connected Wallet */}
          <FlexContainer
            flexDirection="column"
            padding="1.5rem"
            style={{
              background: "rgba(19,34,172,0.1)",
              borderRadius: "16px",
              border: "1px solid rgba(19,34,172,0.2)",
            }}
          >
            <FlexContainer
              alignItems="center"
              gap={1}
              style={{ marginBottom: "0.75rem" }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#1322AC",
                }}
              />
              <Typography type="BODY_MEDIUM_S" style={{ color: "#FFFFFF" }}>
                Connected Wallet
              </Typography>
            </FlexContainer>
            <Typography
              type="BODY_MEDIUM_S"
              style={{ color: "#999999", wordBreak: "break-all" }}
            >
              {eoa}
            </Typography>
          </FlexContainer>

          {/* Automation Console */}
          <FlexContainer
            flexDirection="column"
            padding="1.5rem"
            style={{
              background: isAutomationActive
                ? "rgba(19,34,172,0.1)"
                : "rgba(32,34,38,0.5)",
              borderRadius: "16px",
              border: isAutomationActive
                ? "1px solid rgba(19,34,172,0.2)"
                : "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <FlexContainer
              alignItems="center"
              gap={1}
              style={{ marginBottom: "0.75rem" }}
            >
              {isAutomationActive ? (
                <CheckCircle size={16} color="#1322AC" />
              ) : (
                <LayoutDashboard size={16} color="#999999" />
              )}
              <Typography type="BODY_MEDIUM_S" style={{ color: "#FFFFFF" }}>
                {isAutomationActive
                  ? "Automation Active"
                  : "Automation Console"}
              </Typography>
            </FlexContainer>
            {preComputedConsoleAddress && (
              <Typography
                type="BODY_MEDIUM_S"
                style={{ color: "#999999", wordBreak: "break-all" }}
              >
                {preComputedConsoleAddress}
              </Typography>
            )}
            {txHash && (
              <Typography
                type="BODY_MEDIUM_S"
                style={{
                  color: "#999999",
                  marginTop: "0.5rem",
                  wordBreak: "break-all",
                }}
              >
                Transaction: {txHash}
              </Typography>
            )}
          </FlexContainer>

        </FlexContainer>

        {/* Action Button */}
        {!isAutomationActive && (
          <Button
            onClick={handleActivateAutomation}
            buttonSize="L"
            buttonType="primary"
            disabled={isActivating || !fundsDeposited}
            style={{
              width: "100%",
              height: "56px",
              background: "#1322AC",
              borderRadius: "12px",
              marginTop: "1rem",
            }}
          >
            <Typography type="BODY_MEDIUM_S" style={{ color: "#FFFFFF" }}>
              {isActivating ? "Activating..." : "Activate Automation"}
            </Typography>
          </Button>
        )}

        {/* Help Text */}
        <Typography
          type="BODY_MEDIUM_S"
          style={{ color: "#999999", textAlign: "center", marginTop: "1rem" }}
        >
          {isAutomationActive
            ? "Your wSwell rewards will now be claimed automatically"
            : "Activating automation requires two steps: enabling permissions and deploying your automation console"}
        </Typography>
      </FlexContainer>
    </FlexContainer>
  );
}

export default StrategyPage;
