import React, { useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

import FlexContainer, { FlexContainerProps } from "../FlexContainer";
import { defaultTheme } from "@/lib";
import { TooltipIcon } from "@/icons";
import { generateUUID } from "@/utils";
import Typography from "../Typography";

export type TooltipBoxProps = {
  content?: string | React.ReactNode;
  tooltipWidth?: number;
  children?: React.ReactNode;
  color?: string;
  childrenContainerFlexProps?: FlexContainerProps;
  tooltipStyleOptions?: React.CSSProperties;
  noArrow?: boolean;
  direction?:
    | "top"
    | "top-start"
    | "top-end"
    | "right"
    | "right-start"
    | "right-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end";
};

export default function TooltipBox({
  content,
  tooltipWidth = 40,
  color = defaultTheme.colors.white,
  tooltipStyleOptions,
  children = (
    <TooltipIcon height={20} width={20} color={defaultTheme.colors.gray500} />
  ),
  childrenContainerFlexProps,
  direction,
  noArrow = false,
}: TooltipBoxProps) {
  const [tooltipId] = useState(generateUUID());

  return (
    <>
      <FlexContainer
        flex={false}
        data-tooltip-id={tooltipId}
        {...childrenContainerFlexProps}
      >
        {children}
      </FlexContainer>
      <ReactTooltip
        clickable
        id={tooltipId}
        noArrow={noArrow}
        border={`1px solid ${defaultTheme.colors.black}`}
        place={direction}
        style={
          tooltipStyleOptions || {
            maxWidth: `${tooltipWidth}rem`,
            backgroundColor: defaultTheme.colors.gray600,
            padding: "0.8rem",
            zIndex: defaultTheme.layers.alwaysOnTop,
          }
        }
        opacity={100}
      >
        {typeof content === "string" ? (
          <Typography type="BODY_MEDIUM_XS" color={color}>
            {content}
          </Typography>
        ) : (
          content
        )}
      </ReactTooltip>
    </>
  );
}
