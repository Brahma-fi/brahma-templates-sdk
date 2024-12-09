import React, { useEffect } from "react";
import { Address } from "viem";

import useStore from "../store";
import { Token } from "../types";
import { SupportedChainIds, TAsset } from "@/types";
import usePolling from "@/hooks/usePolling";
import { formatUnits, parseUnits, sliceDecimalString } from "@/utils";
import {
  FlexContainer,
  HrLine,
  InformationBar,
  Typography,
} from "@/components/shared/components";
import { defaultTheme } from "@/lib";

type FeeInformationProps = {
  eoa: Address;
  chainId: SupportedChainIds;
  tokenIn: Token;
  selectedTokens: Token[];
  feeToken: Token | null;
  isFeeGreaterThanDeposit: boolean;
  setFundsDeposited: React.Dispatch<React.SetStateAction<boolean>>;
};

const FeeInformation: React.FC<FeeInformationProps> = ({
  eoa,
  chainId,
  tokenIn,
  feeToken,
  selectedTokens,
  isFeeGreaterThanDeposit,
  setFundsDeposited,
}) => {
  const [
    preComputedConsoleAddress,
    feeEstimate,
    balances,
    fetchPreComputedConsoleAddress,
    fetchPreComputedConsoleBalances,
  ] = useStore((store) => [
    store.preComputedConsoleAddress,
    store.feeEstimate,
    store.balances,
    store.fetchPreComputedConsoleAddress,
    store.fetchPreComputedConsoleBalances,
  ]);

  const hasFeeEstimateAndConsoleAddress =
    selectedTokens.length > 0 &&
    !!feeToken?.asset &&
    !!feeEstimate &&
    !!preComputedConsoleAddress;

  useEffect(() => {
    if (!eoa || !feeToken?.asset?.address) return;
    fetchPreComputedConsoleAddress(eoa, chainId, feeToken.asset.address);
  }, [chainId, eoa, feeToken?.asset?.address, fetchPreComputedConsoleAddress]);

  usePolling(() => {
    if (!preComputedConsoleAddress) return;
    fetchPreComputedConsoleBalances(
      selectedTokens.map((token) => token.asset as TAsset)
    );
  }, 5000);

  useEffect(() => {
    if (!feeToken?.asset) {
      setFundsDeposited(false);
      return;
    }

    const preComputedFeeToken = balances.data.find(
      (token) => token.name === feeToken.asset?.name
    );
    if (!preComputedFeeToken || !preComputedFeeToken?.balanceOf?.value) {
      setFundsDeposited(false);
      return;
    }

    const feeTokenBalance = preComputedFeeToken.balanceOf.value;
    const requiredAmount = parseUnits(tokenIn.amount, feeToken.asset?.decimals);

    setFundsDeposited(feeTokenBalance >= requiredAmount);
  }, [tokenIn, feeToken, balances, setFundsDeposited]);

  if (!balances.data || !feeToken?.asset) return null;

  return (
    <>
      {hasFeeEstimateAndConsoleAddress && (
        <>
          <HrLine />

          <FlexContainer gap={1} alignItems="center">
            <Typography type="BODY_MEDIUM_S">
              Pre-computed Account Address:
            </Typography>
            <Typography type="BODY_MEDIUM_S">
              {preComputedConsoleAddress}
            </Typography>
          </FlexContainer>

          <FlexContainer gap={1} alignItems="center">
            <Typography type="BODY_MEDIUM_S">
              Pre-computed Account Address Fee Estimate:
            </Typography>

            <Typography type="BODY_MEDIUM_S">
              {feeEstimate
                ? sliceDecimalString(
                    formatUnits(feeEstimate, feeToken.asset?.decimals),
                    8
                  )
                : "Loading..."}{" "}
              {feeToken.asset?.symbol}{" "}
            </Typography>
          </FlexContainer>

          <HrLine />

          <InformationBar accent="console">
            Note: The deposited amount will be reduced by{" "}
            {sliceDecimalString(
              formatUnits(feeEstimate, feeToken?.asset?.decimals),
              8
            )}{" "}
            {feeToken?.asset?.symbol} to cover the console creation fee.
          </InformationBar>
          {isFeeGreaterThanDeposit && (
            <FlexContainer
              padding="1.6rem"
              bgColor={defaultTheme.colors.gray700}
              width={100}
            >
              <Typography
                type="BODY_MEDIUM_S"
                color={defaultTheme.colors.error}
              >
                Warning: Fee estimate is greater than the deposit value!
              </Typography>
            </FlexContainer>
          )}
        </>
      )}

      {balances.data.length > 0 && (
        <>
          <Typography type="BODY_MEDIUM_S">Total Deposited</Typography>
          {balances.data.map((token, index) => {
            const tokenBalance = parseFloat(
              formatUnits(token?.balanceOf?.value as bigint, token?.decimals)
            );

            return (
              <FlexContainer
                key={index}
                padding="1.6rem"
                bgColor={defaultTheme.colors.gray700}
                width={100}
                flexDirection="column"
              >
                <Typography type="BODY_MEDIUM_S">
                  {token?.name} -{" "}
                  {sliceDecimalString(tokenBalance.toString(), 8)}
                </Typography>
              </FlexContainer>
            );
          })}
        </>
      )}
    </>
  );
};

export default FeeInformation;
