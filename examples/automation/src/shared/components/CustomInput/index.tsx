import React, { InputHTMLAttributes, useEffect, useRef, useState } from "react";

import { defaultTheme } from "@/lib";
import FlexContainer from "../FlexContainer";
import Typography from "../Typography";

import * as S from "./styles";

export type CustomInputProps = {
  icon?: React.ReactNode;
  isInvalid?: boolean;
  accentColor?: "console" | "secondary" | "error" | "warning";
  disabled?: boolean;
  padding?: string;
  errorText?: string | false;
  leftIcon?: React.ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export default function CustomInput({
  icon,
  isInvalid,
  accentColor = "console",
  disabled,
  padding = "1.2rem",
  errorText,
  leftIcon,
  ...props
}: CustomInputProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [touched, setTouched] = useState(false);

  const setToFocused = () => {
    setFocused(true);
    !touched && setTouched(true);
  };

  const setToUnfocused = () => {
    setFocused(false);
  };

  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focused]);

  return (
    <FlexContainer width={100} flexDirection="column" gap={0.8}>
      <S.StyledCustomInputWrapper
        onClick={props.onClick && props.onClick}
        focused={focused}
        isInvalid={isInvalid}
        accentColor={accentColor}
        disabled={disabled}
        padding={padding}
        touched={touched}
      >
        {!!leftIcon && leftIcon}

        <S.CustomStyledInput
          onFocus={setToFocused}
          onBlur={setToUnfocused}
          spellCheck={false}
          ref={inputRef}
          disabled={disabled}
          {...props}
        />
        {!!icon && icon}
      </S.StyledCustomInputWrapper>
      {touched && isInvalid && errorText && (
        <Typography type="BODY_MEDIUM_XS" color={defaultTheme.colors.error}>
          {errorText}
        </Typography>
      )}
    </FlexContainer>
  );
}
