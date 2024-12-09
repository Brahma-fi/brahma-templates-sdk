import { useEffect, useState } from "react";
import {
  AutomationLogResponse,
  AutomationSubscription,
  TAsset,
  TemplatesSDK,
} from "brahma-templates-sdk";
import { Address, zeroAddress } from "viem";

import { Token } from "@/types";
import {
  Button,
  ContentWrapper,
  dispatchToast,
  FlexContainer,
  HrLine,
  SwapInput,
  Typography,
} from "../components";
import usePolling from "@/hooks/usePolling";
import { defaultTheme } from "@/lib";
import { AddIcon } from "@/icons";
import SelectedTokens from "./SelectedTokens";
import { parseUnits } from "@/utils";

const HARDCODED_REGISTRY_ID = "f7b8c17b-1a8b-4707-a397-31f19057250b";

const API_KEY = "<your-api-key>";

const sdk = new TemplatesSDK(API_KEY);

const Strategy = () => {
  const [assets, setAssets] = useState<TAsset[]>([]);
  const [eoa, setEOA] = useState<Address>("" as Address);
  const [chainId, setChainId] = useState<number>(0);
  const [accountAddress, setAccountAddress] = useState<Address>("" as Address);
  const [automations, setAutomations] = useState<AutomationSubscription[]>([]);
  const [selectedAutomation, setSelectedAutomation] =
    useState<AutomationSubscription | null>(null);
  const [selectedAutomationLogs, setSelectedAutomationLogs] = useState<
    AutomationLogResponse[]
  >([]);

  const [showIframePrompt, setShowIframePrompt] = useState(false);

  const [loading, setLoading] = useState(false);

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

  // Initialize the template with details of the Brahma Account
  const fetchDetails = async () => {
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

      const chainId = clientFactory.chainId;
      console.log("Chain ID obtained:", eoa);

      const accountAddress = clientFactory.accountAddress;
      console.log("Account address obtained:", accountAddress);

      setAssets(assets);
      setEOA(eoa);
      setChainId(chainId);
      setAccountAddress(accountAddress);
    } catch (error) {
      setShowIframePrompt(true);
      console.log("error", error);
      console.error("An error occurred while fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  async function handleAddAutomation() {
    if (!selectedTokens.length) {
      dispatchToast({
        id: "console-deploy-error",
        title: "Error adding automation",
        type: "error",
        description: {
          value: "Missing required information for starting automation ",
        },
      });
      return;
    }

    try {
      const tokenInputs: Record<Address, string> = selectedTokens.reduce(
        (acc, token) => {
          if (token.asset && token.amount) {
            acc[token.asset.address] = parseUnits(
              token.amount,
              token.asset.decimals
            ).toString();
          }
          return acc;
        },
        {} as Record<Address, string>
      );

      const tokenLimits: Record<Address, string> = selectedTokens.reduce(
        (acc, token) => {
          if (token.asset && token.amount) {
            acc[token.asset.address] = token.amount;
          }
          return acc;
        },
        {} as Record<Address, string>
      );

      await sdk.builderCaller.addAutomation({
        feeAmount: "0",
        feeToken: zeroAddress,
        metadata: {},
        registryId: HARDCODED_REGISTRY_ID,
        tokenInputs,
        tokenLimits,
      });
    } catch (error) {
      setShowIframePrompt(true);
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAutomations() {
    if (!accountAddress) {
      dispatchToast({
        id: "console-deploy-error",
        title: "Brahma Account Address not found",
        type: "error",
      });
      return;
    }

    try {
      const automations =
        await sdk.automationContextFetcher.fetchAutomationSubscriptions(
          accountAddress,
          chainId
        );

      // filter by registry ID and status
      const activeAutomations = automations.filter(
        (automation) =>
          automation.registryId.toLowerCase() ===
            (HARDCODED_REGISTRY_ID || "").toLowerCase() &&
          automation.status === 2
      );

      setAutomations(activeAutomations);
    } catch (error) {
      setShowIframePrompt(true);
      console.log("error", error);
    }
  }

  usePolling(async () => {
    await fetchDetails();
  }, 10000);

  usePolling(async () => {
    await fetchAutomations();
  }, 10000);

  useEffect(() => {
    fetchDetails();
    fetchAutomations();
  }, []);

  useEffect(() => {
    if (!selectedAutomation) return;

    // Fetching automation logs for selected automation
    async function fetchSelectedAutomationLogs() {
      if (!selectedAutomation) {
        dispatchToast({
          id: "console-deploy-error",
          title: "There's no active automation to fetch logs",
          type: "error",
        });
        return;
      }

      try {
        // for every automation, fetch logs and append into new array with automation details and logs
        const logs =
          (await sdk.automationContextFetcher.fetchAutomationLogs(
            selectedAutomation.id
          )) || [];

        setSelectedAutomationLogs(logs);
      } catch (error) {
        setShowIframePrompt(true);
        console.log("error", error);
      }
    }

    fetchSelectedAutomationLogs();
  }, [selectedAutomation]);

  const filteredEoaAssetsForCurrentChain = assets.filter(
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

  const handleSelectAutomation = (automation: AutomationSubscription) => {
    setSelectedAutomation(automation);
  };

  if (loading) {
    return <p style={{ fontSize: "14px", color: "#333" }}>Loading assets...</p>;
  }

  // Please run the template Brahma Account itself as an embedded iFrame
  if (showIframePrompt) {
    return (
      <p style={{ fontSize: "18px", color: "red" }}>
        Please open this app inside the parent iframe.
      </p>
    );
  }

  return (
    <FlexContainer flexDirection="column">
      <FlexContainer padding="2rem" gap={10}>
        <FlexContainer width={100} flexDirection="column">
          <ContentWrapper>
            <Typography type="BODY_MEDIUM_S">
              Selected tokens to deposit.
            </Typography>
          </ContentWrapper>
          <SelectedTokens
            feeToken={feeToken}
            selectedTokens={selectedTokens}
            updateFeeToken={setFeeToken}
          />
          <ContentWrapper>
            <Button
              disabled={!selectedTokens.length}
              onClick={handleAddAutomation}
              buttonSize="L"
            >
              <Typography type="BODY_MEDIUM_S">Start Automation</Typography>
            </Button>
          </ContentWrapper>
        </FlexContainer>
        <FlexContainer flexDirection="column">
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
        </FlexContainer>
      </FlexContainer>
      <HrLine />
      <FlexContainer flexDirection="column" padding="2rem">
        <Typography type="BODY_MEDIUM_S">Active Automations :-</Typography>
        {automations.length > 0 ? (
          <>
            <FlexContainer flexDirection="column" gap={1}>
              {automations.map((automation) => (
                <FlexContainer
                  key={automation.id}
                  cursor="pointer"
                  bgColor={
                    selectedAutomation?.id === automation.id
                      ? defaultTheme.colors.gray700
                      : defaultTheme.colors.black
                  }
                  padding="1rem"
                  onClick={() => handleSelectAutomation(automation)}
                >
                  <Typography>Automation ID - {automation.id}</Typography>

                  {selectedAutomation?.id &&
                    selectedAutomationLogs.length > 0 && (
                      <FlexContainer flexDirection="column">
                        <Typography type="BODY_MEDIUM_S">
                          Logs - {selectedAutomation.id}
                        </Typography>
                        <FlexContainer flexDirection="column">
                          {selectedAutomationLogs.map((log, index) => (
                            <Typography type="BODY_MEDIUM_S" key={index}>
                              {log.message}
                            </Typography>
                          ))}
                        </FlexContainer>
                      </FlexContainer>
                    )}
                </FlexContainer>
              ))}
            </FlexContainer>
          </>
        ) : (
          <Typography type="BODY_MEDIUM_S">
            No active automations found
          </Typography>
        )}
      </FlexContainer>
    </FlexContainer>
  );
};

export default Strategy;
