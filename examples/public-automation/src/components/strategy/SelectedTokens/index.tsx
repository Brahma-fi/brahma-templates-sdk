import React from "react";

import { Token } from "../types";
import {
  FlexContainer,
  InformationBar,
  Typography,
} from "@/components/shared/components";
import { defaultTheme } from "@/lib";
import { sliceDecimalString } from "@/utils";

type SelectedTokensProps = {
  selectedTokens: Token[];
  feeToken: Token | null;
  updateFeeToken: (token: Token) => void;
};

export default function SelectedTokens({
  selectedTokens,
  feeToken,
  updateFeeToken,
}: SelectedTokensProps) {
  return (
    <>
      {selectedTokens.length > 0 && (
        <>
          <Typography type="BODY_MEDIUM_S">
            Selected Tokens to Deposit
          </Typography>

          {selectedTokens.map((token, index) => {
            const selected = feeToken?.asset?.address === token.asset?.address;

            return (
              <FlexContainer
                key={index}
                padding="1.6rem"
                bgColor={defaultTheme.colors.gray700}
                width={100}
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography type="BODY_MEDIUM_S">
                  {token.asset?.name} - {sliceDecimalString(token.amount, 8)}
                </Typography>
                <FlexContainer flex={false} gap={1} alignItems="center">
                  <Typography type="BODY_MEDIUM_S">Fee Token</Typography>
                  <input
                    type="checkbox"
                    style={{
                      backgroundColor: selected
                        ? defaultTheme.colors.console2
                        : defaultTheme.colors.black,
                    }}
                    checked={selected}
                    onChange={() => updateFeeToken(token)}
                  />
                </FlexContainer>
              </FlexContainer>
            );
          })}
        </>
      )}

      {feeToken && selectedTokens.length > 0 && (
        <FlexContainer
          padding="1.6rem"
          bgColor={defaultTheme.colors.gray700}
          width={100}
        >
          <Typography type="BODY_MEDIUM_S">
            Fee Token: {feeToken.asset?.name}
          </Typography>
        </FlexContainer>
      )}

      {!selectedTokens.length && (
        <InformationBar accent="warning">
          Please select tokens to deposit
        </InformationBar>
      )}
    </>
  );
}
