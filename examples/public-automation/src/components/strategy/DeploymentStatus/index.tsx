import React from "react";

import useStore from "../store";
import {
  FlexContainer,
  InfoLinkTag,
  Typography,
} from "@/components/shared/components";
import { truncateString } from "@/utils";

const DeploymentStatus = () => {
  const { deploymentStatus, preComputedConsoleAddress } = useStore();

  if (!deploymentStatus || !preComputedConsoleAddress) return null;

  return (
    <>
      <FlexContainer gap={0.4} alignItems="center">
        <Typography type="BODY_MEDIUM_S">Deployment Status:</Typography>
        <Typography
          type="BODY_MEDIUM_S"
          style={{ textTransform: "capitalize" }}
        >
          {deploymentStatus.status}
        </Typography>
      </FlexContainer>

      {deploymentStatus.status === "successful" && (
        <FlexContainer gap={0.4} alignItems="center">
          <Typography type="BODY_MEDIUM_S">Brahma Account Address:</Typography>
          <InfoLinkTag
            content={truncateString(preComputedConsoleAddress)}
            link={`https://dev.console.brahma.fi/account/${preComputedConsoleAddress}`}
            textToCopy={preComputedConsoleAddress}
            toolTipContent={preComputedConsoleAddress}
          />
        </FlexContainer>
      )}
    </>
  );
};

export default DeploymentStatus;
