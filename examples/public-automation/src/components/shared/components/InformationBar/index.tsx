import { CSSProperties } from "styled-components";

import Typography, { TypographyProps } from "../Typography";
import { TooltipIcon } from "@/icons";
import FlexContainer from "../FlexContainer";

import * as S from "./styles";

export type InformationBarProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  accent?: "default" | "console" | "warning" | "error" | "blast" | "success";
  type?: TypographyProps["type"];
  overrideIconColor?: boolean;
  showExtraBorder?: boolean;
  style?: CSSProperties;
};

export default function InformationBar({
  children,
  icon = <TooltipIcon />,
  rightIcon,
  accent = "default",
  type = "BODY_MEDIUM_S",
  overrideIconColor = true,
  showExtraBorder = true,
  style,
}: InformationBarProps) {
  return (
    <S.StyledInformationBar
      style={style}
      accent={accent}
      overrideIconColor={overrideIconColor}
      showExtraBorder={showExtraBorder}
    >
      <FlexContainer gap={0.9}>
        {icon && <FlexContainer flex={false}>{icon}</FlexContainer>}
        <FlexContainer>
          <Typography type={type}>{children}</Typography>
        </FlexContainer>
        {rightIcon && (
          <FlexContainer alignItems="center" flex={false}>
            {rightIcon}
          </FlexContainer>
        )}
      </FlexContainer>
    </S.StyledInformationBar>
  );
}
