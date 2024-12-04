import React from "react";
import { defaultTheme } from "@/lib";

import * as S from "./styles";

export default function GrayBoundaryBlackWrapper({
  flexDirection = "column",
  padding = "0.2rem",
  children,
  style,
  onClick,
}: {
  padding?: string;
  flexDirection?: "row" | "column";
  children: React.ReactNode;
  style?: React.CSSProperties & Record<string, string>;
  onClick?: () => void;
}) {
  return (
    <S.StyledGrayBoundaryBlackWrapper
      onClick={onClick && onClick}
      padding={padding}
      borderColor={defaultTheme.colors.gray700}
      bgColor={defaultTheme.colors.black}
      borderRadius={0.8}
      flexDirection={flexDirection}
      gap={0.2}
      style={style}
      width={100}
    >
      {children}
    </S.StyledGrayBoundaryBlackWrapper>
  );
}
