import React from "react";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FlexContainer } from "@/components/shared/components";
import { BrahmaIcon } from "@/icons";

export default function Header() {
  return (
    <FlexContainer
      padding="2rem"
      gap={1}
      width={100}
      justifyContent="space-between"
    >
      {/* Icons */}
      <FlexContainer flex={false} padding="0 1rem 0 0">
        <BrahmaIcon height={28} width={28} />
      </FlexContainer>

      {/* ChainSelector and Profile */}
      <ConnectButton />
    </FlexContainer>
  );
}
