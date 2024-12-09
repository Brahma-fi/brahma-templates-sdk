import React, { useEffect, useMemo, useState } from "react";
import { Address, erc20Abi, zeroAddress } from "viem";
import { useWalletClient } from "wagmi";

import useStore from "./store";
import { Token } from "./types";
import Header from "./Header";
import SelectedTokens from "./SelectedTokens";
import FeeInformation from "./FeeInformation";
import DeploymentStatus from "./DeploymentStatus";
import { SupportedChainIds, TAsset } from "@/types";
import useBoolean from "@/hooks/useBoolean";
import { formatRejectMetamaskErrorMessage, parseUnits } from "@/utils";
import usePolling from "@/hooks/usePolling";
import {
  ActionIconWrapper,
  Button,
  ContentWrapper,
  dispatchToast,
  FlexContainer,
  GrayBoundaryBlackWrapper,
  HrLine,
  InformationBar,
  SwapInput,
  Typography,
} from "../shared/components";
import { defaultTheme } from "@/lib";
import { AddIcon, CropFreeIcon, RefreshIcon, TickIcon } from "@/icons";
import assetsList from "@/arb.json";

type StrategyPageProps = {
  eoa: Address;
  chainId: SupportedChainIds;
};

function StrategyPage({ eoa, chainId }: StrategyPageProps) {
  const { data: signer } = useWalletClient();

  const {
    eoaBalances: eoaAssets,
    balances: accountAssets,
    feeEstimate,
    deploymentStatus,
    preComputedConsoleAddress,
    fetchEoaAssets,
    fetchDeploymentStatus,
    generateAndDeploySubAccount,
  } = useStore();

  const assets: TAsset[] = useMemo(() => {
    return assetsList.map((cAsset) => ({
      ...cAsset,
      chainId: cAsset.chainId as SupportedChainIds,
      address: cAsset.address as Address,
      verified: cAsset.isVerified,
      actions: [],
      value: "0",
      prices: { default: 0 },
    }));
  }, [assetsList]);

  const [tokenIn, setTokenIn] = useState<Token>({
    amount: "",
    asset: null,
  });

  const [feeToken, setFeeToken] = useState<Token | null>({
    amount: "",
    asset: null,
  });

  const [selectedTokens, setSelectedTokens] = useState<Token[]>([]);

  function updateTokenInValue(value: string) {
    setTokenIn((prev) => ({
      ...prev,
      amount: value,
    }));
  }

  function selectTokenInHandler(asset: TAsset) {
    setTokenIn({
      asset,
      amount: "",
    });
  }

  function addToSelectedTokens(token: Token) {
    setSelectedTokens((prev) => {
      const isTokenAlreadySelected = prev.some(
        (t) => t.asset?.address === token.asset?.address
      );
      if (!isTokenAlreadySelected) {
        return [...prev, token];
      }
      return prev;
    });
  }

  const { value: fundsDeposited, setValue: setFundsDeposited } =
    useBoolean(false);
  const { value: fundsDepositedLoading, setValue: setFundsDepositedLoading } =
    useBoolean(false);

  const { value: consoleDeployedLoading, setValue: setConsoleDeployedLoading } =
    useBoolean(false);

  const isFeeGreaterThanDeposit = useMemo(() => {
    if (fundsDeposited || !feeEstimate || !feeToken) return false;
    const feeTokenAmount =
      feeToken && feeEstimate && feeToken.amount
        ? parseUnits(feeToken.amount, feeToken?.asset?.decimals)
        : BigInt(0);
    const reducedAmount = feeTokenAmount - BigInt(feeEstimate);
    return reducedAmount < 0;
  }, [fundsDeposited, feeEstimate, feeToken]);

  async function handleDepositFunds() {
    if (
      !signer ||
      !eoa ||
      !preComputedConsoleAddress ||
      selectedTokens.length === 0
    ) {
      console.error("Missing required information for deposit");
      return;
    }

    setFundsDepositedLoading(true);
    try {
      for (const token of selectedTokens) {
        if (token.asset?.address === zeroAddress) {
          // Handle ETH transfer
          await signer.sendTransaction({
            to: preComputedConsoleAddress as Address,
            value: parseUnits(token.amount, token.asset?.decimals),
          });
        } else {
          // Handle ERC20 transfer
          await signer.writeContract({
            abi: erc20Abi,
            address: token?.asset?.address as Address,
            functionName: "transfer",
            args: [
              preComputedConsoleAddress as Address,
              parseUnits(token.amount, token.asset?.decimals),
            ],
          });
        }
      }
      setFundsDeposited(true); // Moved here to ensure all deposits succeed
      dispatchToast({
        id: "funds-deposited",
        title: "Funds Deposited",
        type: "success",
        description: {
          value: "Funds have been deposited to the pre-computed account",
        },
      });
    } catch (err: any) {
      console.log({ err });
      setFundsDeposited(false);
      dispatchToast({
        id: "funds-error",
        title:
          formatRejectMetamaskErrorMessage(err) || "Error depositing funds",
        type: "error",
        description: {
          value: "An error occurred while depositing funds",
        },
      });
    } finally {
      setFundsDepositedLoading(false);
    }
  }

  async function handleDeployConsole() {
    if (
      !feeToken?.asset?.address ||
      !preComputedConsoleAddress ||
      !selectedTokens.length ||
      !feeEstimate
    ) {
      dispatchToast({
        id: "console-deploy-error",
        title: "Error deploying console",
        type: "error",
        description: {
          value: "Missing required information for account deployment",
        },
      });
      return;
    }

    // Check if the account assets have a balance greater than the feeEstimate for the fee token
    const feeTokenAddress = feeToken.asset.address.toLowerCase() as Address;
    const feeTokenBalance =
      accountAssets.data.find(
        (token) => token?.address.toLowerCase() === feeTokenAddress
      )?.balanceOf?.value || BigInt(0);

    if (feeTokenBalance < BigInt(feeEstimate)) {
      dispatchToast({
        id: "console-deploy-error",
        title: "Error deploying console",
        type: "error",
        description: {
          value: "Insufficient balance for the fee token",
        },
      });
      return;
    }

    if (
      !fundsDeposited &&
      accountAssets.data.some((token) => {
        const tokenAmount = token?.balanceOf?.value || BigInt(0);
        return tokenAmount <= 0;
      })
    ) {
      dispatchToast({
        id: "console-deploy-error",
        title: "Error deploying account",
        type: "error",
        description: {
          value: "Token amount cannot be zero",
        },
      });
      return;
    }

    const tokens = accountAssets.data.map((asset) => asset?.address as Address);
    const amounts = accountAssets.data.map((token) => {
      const tokenAmount = token.balanceOf?.value || BigInt(0);
      // Reduce the amount by feeEstimate if the token address matches feeTokenAddress
      const adjustedAmount =
        token?.address.toLowerCase() === feeTokenAddress
          ? tokenAmount - BigInt(feeEstimate)
          : tokenAmount;
      return adjustedAmount.toString();
    });

    setConsoleDeployedLoading(true);
    try {
      await generateAndDeploySubAccount(
        eoa,
        chainId,
        feeTokenAddress,
        feeEstimate,
        tokens,
        amounts
      );
    } catch (err: any) {
      console.error("Error deploying Brahma Account:", err);
      dispatchToast({
        id: "deploy-error",
        title: "Error deploying Account",
        type: "error",
        description: {
          value: "An error occurred during Brahma Account deployment",
        },
      });
    } finally {
      setConsoleDeployedLoading(false);
    }
  }

  const isDepositButtonDisabled =
    fundsDeposited ||
    !feeEstimate ||
    !feeToken?.asset ||
    selectedTokens.some((token) => {
      const tokenAmount = parseUnits(token.amount, token?.asset?.decimals);
      return tokenAmount <= 0;
    });

  const isDeployButtonDisabled = !fundsDeposited || consoleDeployedLoading;

  function handleRefresh() {
    setSelectedTokens([]);
    setFeeToken(null);
    setTokenIn({
      amount: "",
      asset: null,
    });
    setFundsDeposited(false);
  }

  useEffect(() => {
    function updateFeeToken() {
      if (!selectedTokens.length) return;
      setFeeToken(selectedTokens[0]);
    }

    updateFeeToken();
  }, [selectedTokens, tokenIn]);

  usePolling(() => {
    fetchEoaAssets(eoa, assets);
  }, 3000);

  useEffect(() => {
    fetchEoaAssets(eoa, assets);
  }, []);

  usePolling(() => {
    if (!deploymentStatus || !deploymentStatus.taskId) return;
    if (
      deploymentStatus.status === "successful" ||
      deploymentStatus.status === "failed" ||
      deploymentStatus.status === "cancelled"
    )
      return;
    fetchDeploymentStatus(deploymentStatus.taskId);
  }, 5000);

  const filteredEoaAssetsForCurrentChain = eoaAssets.data.filter(
    (asset) =>
      asset.chainId === chainId &&
      !selectedTokens.some(
        (token) =>
          token.asset?.address.toLowerCase() === asset.address.toLowerCase()
      )
  );

  const getMaxTokenBalanceAvailable: bigint = tokenIn.asset
    ? tokenIn.asset.balanceOf?.value || BigInt(0)
    : BigInt(0);

  return (
    <FlexContainer>
      <FlexContainer
        justifyContent="space-between"
        flexDirection="column"
        alignItems="center"
        width={100}
        height={100}
      >
        <Header />

        <FlexContainer
          justifyContent="space-between"
          width={100}
          padding="5rem 15rem"
          height={100}
        >
          <FlexContainer
            style={{
              flex: "0.7",
            }}
          >
            <GrayBoundaryBlackWrapper
              style={{
                width: "100%",
                height: "100%",
                maxWidth: "85rem",
              }}
              padding="0.4rem"
            >
              <FlexContainer
                bgColor={defaultTheme.colors.gray800}
                width={100}
                padding="1rem"
                flexDirection="column"
                gap={1}
              >
                <FlexContainer
                  width={100}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography type="TITLE_L">Strategy</Typography>

                  <ActionIconWrapper onClick={handleRefresh} size="M">
                    <RefreshIcon />
                  </ActionIconWrapper>
                </FlexContainer>

                <HrLine />

                <FlexContainer gap={1} alignItems="center">
                  <Typography type="BODY_MEDIUM_S">
                    Connected Wallet:
                  </Typography>
                  <Typography type="BODY_MEDIUM_S">{eoa}</Typography>
                </FlexContainer>

                <HrLine />

                {/* This is the template which will run in the iframe once Brahma account is deployed */}
                <SelectedTokens
                  feeToken={feeToken}
                  selectedTokens={selectedTokens}
                  updateFeeToken={setFeeToken}
                />

                <FeeInformation
                  eoa={eoa}
                  chainId={chainId}
                  feeToken={feeToken}
                  isFeeGreaterThanDeposit={isFeeGreaterThanDeposit}
                  selectedTokens={selectedTokens}
                  tokenIn={tokenIn}
                  setFundsDeposited={setFundsDeposited}
                />

                {deploymentStatus && preComputedConsoleAddress ? (
                  <DeploymentStatus />
                ) : (
                  fundsDeposited && (
                    <InformationBar accent="success">
                      You have sufficient funds in the pre-computed account to
                      cover the deployment fee. You can continue without
                      depositing additional funds.
                    </InformationBar>
                  )
                )}
              </FlexContainer>
            </GrayBoundaryBlackWrapper>
          </FlexContainer>
          <FlexContainer
            style={{
              flex: "0.3",
            }}
            flexDirection="column"
            gap={1}
          >
            <GrayBoundaryBlackWrapper padding="0.2rem">
              <ContentWrapper>
                <Typography type="BODY_MEDIUM_S">
                  Strategy will automatically create a Brahma Account
                </Typography>
              </ContentWrapper>
              <ContentWrapper>
                <FlexContainer
                  width={100}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography type="BODY_MEDIUM_S">Deposit</Typography>
                </FlexContainer>
                <SwapInput
                  showInputPresets={true}
                  disabled={!eoa}
                  inputValue={tokenIn.amount}
                  setInputValue={(value) => updateTokenInValue(value)}
                  selectedAsset={tokenIn.asset}
                  setSelectedAsset={selectTokenInHandler}
                  getMaxTokenBalanceAvailable={getMaxTokenBalanceAvailable}
                  availableAssets={filteredEoaAssetsForCurrentChain}
                />
              </ContentWrapper>
              <ContentWrapper>
                <Button
                  onClick={() => {
                    if (!tokenIn.asset || !tokenIn.amount) {
                      dispatchToast({
                        id: "deposit-asset-missing",
                        title: "Deposit token cannot be empty",
                        description: {
                          value: "Please select an asset and amount",
                        },
                        type: "error",
                      });
                      return;
                    }
                    addToSelectedTokens(tokenIn);
                    setTokenIn({
                      amount: "",
                      asset: null,
                    });
                  }}
                  buttonSize="L"
                >
                  <AddIcon color={defaultTheme.colors.white} />
                  <Typography type="BODY_MEDIUM_S">Add Token</Typography>
                </Button>
              </ContentWrapper>
            </GrayBoundaryBlackWrapper>
            <Typography type="BODY_MEDIUM_S">
              2-step process. Make sure to complete both actions.
            </Typography>
            <FlexContainer width={100} gap={1.6}>
              <FlexContainer
                borderColor={defaultTheme.colors.gray700}
                borderRadius={0.8}
                padding="1.4rem"
              >
                {fundsDeposited ? (
                  <TickIcon
                    color={defaultTheme.colors.success}
                    width={16}
                    height={16}
                  />
                ) : (
                  <CropFreeIcon />
                )}
              </FlexContainer>
              <Button
                onClick={handleDepositFunds}
                buttonSize="L"
                buttonType="primary"
                disabled={isDepositButtonDisabled || fundsDepositedLoading}
              >
                <Typography type="BODY_MEDIUM_S">
                  {fundsDepositedLoading ? "Depositing ..." : "Deposit Funds"}
                </Typography>
              </Button>
            </FlexContainer>
            <FlexContainer width={100} gap={1.6}>
              <FlexContainer
                borderColor={defaultTheme.colors.gray700}
                borderRadius={0.8}
                padding="1.4rem"
              >
                <CropFreeIcon />
              </FlexContainer>
              <Button
                onClick={handleDeployConsole}
                buttonSize="L"
                buttonType="primary"
                disabled={isDeployButtonDisabled || consoleDeployedLoading}
              >
                <Typography type="BODY_MEDIUM_S">
                  {consoleDeployedLoading
                    ? "Deploying ..."
                    : "Deploy Brahma Account"}
                </Typography>
              </Button>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
}

export default StrategyPage;
