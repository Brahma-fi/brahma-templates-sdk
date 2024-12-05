import React, { CSSProperties } from "react";

import * as S from "./styles";

export type TTypographyType =
  | "BUTTON"
  | "TITLE_XXL"
  | "TITLE_XL"
  | "TITLE_L"
  | "TITLE_M"
  | "TITLE_S"
  | "TITLE_XS"
  | "BODY_L"
  | "BODY_M"
  | "BODY_S"
  | "BODY_XS"
  | "BODY_XXS"
  | "BODY_MEDIUM_L"
  | "BODY_MEDIUM_M"
  | "BODY_MEDIUM_S"
  | "BODY_MEDIUM_XS"
  | "TAG"
  | "LINK"
  | "TITLE_COANDA";

export type TypographyProps = {
  type?: TTypographyType;
  children: React.ReactNode;
  textAlign?: string;
  as?: React.ElementType;
  color?: string;
  hoverColor?: string;
  shouldInheritColor?: boolean;
  style?: CSSProperties;
} & React.HTMLProps<HTMLDivElement>;

export default function Typography({
  type = "TITLE_S",
  children,
  color,
  hoverColor,
  textAlign = "left",
  shouldInheritColor = false,
  style,
  ...props
}: TypographyProps) {
  return (
    <S.Wrapper
      type={type}
      color={color}
      shouldInheritColor={shouldInheritColor}
      style={style}
      textAlign={textAlign}
      hoverColor={hoverColor}
      {...props}
    >
      {children}
    </S.Wrapper>
  );
}
