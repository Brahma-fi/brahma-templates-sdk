import React, { ButtonHTMLAttributes } from "react";

import * as S from "./styles";

export type ButtonTypeProp =
  | "primary"
  | "secondary"
  | "warning"
  | "warningSecondary"
  | "danger"
  | "black"
  | "kernel"
  | "blast"
  | "custom";
export type ButtonSize = "M" | "S" | "L";

type ButtonProps = {
  buttonType?: ButtonTypeProp;
  buttonSize?: ButtonSize;
  removePadding?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  buttonType = "primary",
  buttonSize = "M",
  removePadding = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <S.StyledButton
      {...props}
      buttonSize={buttonSize}
      buttonType={buttonType}
      removePadding={removePadding}
    >
      {children}
    </S.StyledButton>
  );
}
