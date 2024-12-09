import React from "react";
import Image from "next/image";

import { TAsset } from "@/types";
import { formatUnits, sliceDecimalString } from "@/utils";
import FlexContainer from "../FlexContainer";
import TooltipBox from "../TooltipBox";
import Typography from "../Typography";
import { defaultTheme } from "@/lib";
import TokenInput from "../TokenInput";
import { WalletIcon } from "@/icons";
import useBoolean from "@/hooks/useBoolean";

import * as S from "./styles";
import Modal from "../Modal";
import Spinner from "../Spinner";

const MAX_TOKEN_NAME_CHAR = 7;

type SwapInputProps = {
  inputValue: string;
  selectedAsset: TAsset | null;
  getMaxTokenBalanceAvailable: bigint;
  setSelectedAsset?: (asset: TAsset) => void;
  setInputValue: (value: string) => void;
  availableAssets?: TAsset[];
  disabled?: boolean;
  inputDisabled?: boolean;
  inputLoading?: boolean;
  shouldAllowMoreThanBalance?: boolean;
  showInputPresets?: boolean;
  disabledTooltip?: string;
  showHandleMaxClick?: boolean;
  customIcon?: React.ReactNode;
};

const GENERIC_URL =
  "https://brahma-static.s3.us-east-2.amazonaws.com/Asset/AssetGENERIC.svg";

export default function SwapInput({
  inputValue,
  selectedAsset,
  setInputValue,
  availableAssets,
  disabled,
  setSelectedAsset,
  inputDisabled,
  inputLoading,
  getMaxTokenBalanceAvailable,
  showInputPresets = false,
  shouldAllowMoreThanBalance = false,
  disabledTooltip,
  showHandleMaxClick = true,
  customIcon,
}: SwapInputProps) {
  const handlePercentageClick = (percentage: number) => {
    if (!selectedAsset?.decimals) return;

    const percentageBigInt = BigInt(Math.round(percentage * 100)); // Convert percentage to BigInt and scale
    const maxBalanceBigInt = getMaxTokenBalanceAvailable;
    const valueBigInt = (maxBalanceBigInt * percentageBigInt) / BigInt(10000); // Divide by 10000 to account for scaling
    setInputValue(formatUnits(valueBigInt, selectedAsset.decimals));
  };

  const maxBalance = formatUnits(
    getMaxTokenBalanceAvailable,
    selectedAsset?.decimals
  );

  const handleMaxClick = () => handlePercentageClick(100);

  return (
    <FlexContainer
      gap={1.2}
      width={100}
      flexDirection="column"
      justifyContent="center"
    >
      <FlexContainer
        justifyContent="space-between"
        width={100}
        alignItems="center"
        gap={0.8}
      >
        {inputLoading ? (
          <Typography type="BODY_MEDIUM_S">
            <Spinner />
          </Typography>
        ) : (
          <TokenInput
            value={inputValue}
            tokenBalance={getMaxTokenBalanceAvailable}
            onChange={setInputValue}
            decimals={selectedAsset?.decimals || 18}
            onBlurTruncateMaxLength={10}
            disabled={inputDisabled ? true : selectedAsset === null}
            shouldAllowMoreThanBalance={shouldAllowMoreThanBalance}
          />
        )}

        {!!customIcon && customIcon}

        <TooltipBox content={disabledTooltip}>
          <InputAssetSelector
            filteredAssets={availableAssets || []}
            setSelectedAsset={setSelectedAsset}
            selectedAsset={selectedAsset}
            disabled={disabled}
          />
        </TooltipBox>
      </FlexContainer>

      <FlexContainer
        alignItems="center"
        justifyContent="space-between"
        width={100}
        style={{ minHeight: "2.4rem" }}
      >
        <FlexContainer>
          <></>
        </FlexContainer>
        <FlexContainer alignItems="center" flex={false} gap={0.4}>
          <WalletIcon
            color={defaultTheme.colors.gray500}
            height={14}
            width={14}
          />
          <Typography color={defaultTheme.colors.gray300} type="BODY_MEDIUM_XS">
            {sliceDecimalString(maxBalance, 8, true) || "--"}
          </Typography>
          {showInputPresets && (
            <>
              &nbsp;
              <S.MaxSectionWrapper onClick={() => handlePercentageClick(25)}>
                <Typography
                  color={defaultTheme.colors.gray500}
                  type="BODY_MEDIUM_XS"
                >
                  25%
                </Typography>
              </S.MaxSectionWrapper>
              &nbsp;
              <S.MaxSectionWrapper onClick={() => handlePercentageClick(50)}>
                <Typography
                  color={defaultTheme.colors.gray500}
                  type="BODY_MEDIUM_XS"
                >
                  50%
                </Typography>
              </S.MaxSectionWrapper>
            </>
          )}
          &nbsp;
          {showHandleMaxClick && (
            <S.MaxSectionWrapper onClick={handleMaxClick}>
              <Typography
                color={defaultTheme.colors.gray500}
                type="BODY_MEDIUM_XS"
              >
                Max
              </Typography>
            </S.MaxSectionWrapper>
          )}
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
}

type InputAssetSelectorProps = {
  disabled?: boolean;
  selectedAsset: TAsset | null;
  filteredAssets: TAsset[];
  setSelectedAsset?: (asset: TAsset) => void;
};

function InputAssetSelector({
  disabled,
  selectedAsset,
  setSelectedAsset,
  filteredAssets,
}: InputAssetSelectorProps) {
  const {
    value: selectModalIsOpen,
    setTrue: handleOpenSelectModal,
    setFalse: handleCloseSelectModal,
  } = useBoolean();

  const selectedAssetName = selectedAsset?.symbol || selectedAsset?.name || "";

  return (
    <>
      <Modal isOpen={selectModalIsOpen} onClickOutside={handleCloseSelectModal}>
        {filteredAssets.length > 0 ? (
          filteredAssets.map((asset) => {
            return (
              <FlexContainer
                style={{
                  width: "54.4rem",
                }}
                hoverBgColor={`${defaultTheme.colors.gray700}A3`}
                cursor="pointer"
                alignItems="center"
                justifyContent="space-between"
                bgColor={defaultTheme.colors.gray800}
                padding="1.4rem 1.6rem"
                onClick={() => {
                  if (!asset || !setSelectedAsset) return;
                  setSelectedAsset(asset);
                  handleCloseSelectModal();
                }}
              >
                <FlexContainer gap={0.4} alignItems="center">
                  <Image
                    src={asset?.logo || GENERIC_URL}
                    width={24}
                    height={24}
                    alt="Logo Image"
                  />{" "}
                  <Typography
                    type="BODY_MEDIUM_S"
                    shouldInheritColor
                    style={{ maxWidth: "20rem", overflow: "hidden" }}
                  >
                    {asset.name}
                  </Typography>
                </FlexContainer>

                <Typography type="BODY_MEDIUM_S" shouldInheritColor>
                  {sliceDecimalString(
                    asset.balanceOf?.formatted || "0",
                    10,
                    true
                  )}
                </Typography>
              </FlexContainer>
            );
          })
        ) : (
          <FlexContainer
            style={{
              width: "54.4rem",
            }}
            alignItems="center"
            justifyContent="space-between"
            bgColor={defaultTheme.colors.gray800}
            padding="1.4rem 1.6rem"
          >
            <Typography type="BODY_MEDIUM_S" shouldInheritColor>
              No assets available
            </Typography>
          </FlexContainer>
        )}
      </Modal>

      <FlexContainer
        justifyContent="center"
        alignItems="center"
        cursor="pointer"
        borderColor={defaultTheme.colors.gray600}
        borderRadius={0.4}
        bgColor={defaultTheme.colors.gray700}
        hoverBorderColor={defaultTheme.colors.gray500}
        padding="0.4rem 0.8rem"
        style={{
          height: "3.6rem",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        onClick={() => {
          if (selectModalIsOpen || disabled) return;
          handleOpenSelectModal();
        }}
      >
        {selectedAsset ? (
          <FlexContainer alignItems="center" gap={0.4}>
            <Image
              src={selectedAsset?.logo || GENERIC_URL}
              width={24}
              height={24}
              alt="Logo Image"
            />{" "}
            <Typography type="TITLE_XS" color={defaultTheme.colors.gray200}>
              {selectedAssetName
                ?.toLocaleUpperCase()
                .slice(0, MAX_TOKEN_NAME_CHAR)}
              {selectedAssetName.length > MAX_TOKEN_NAME_CHAR && "..."}
            </Typography>
          </FlexContainer>
        ) : (
          <Typography
            style={{ whiteSpace: "nowrap" }}
            type="TITLE_XS"
            color={defaultTheme.colors.gray200}
          >
            Select Asset
          </Typography>
        )}
      </FlexContainer>
    </>
  );
}
