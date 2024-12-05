import { formatUnits, parseUnits } from "@/utils";
import { useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";

export const StyledInput = styled.input`
  ${({ theme, disabled }) => css`
    width: 100%;
    background-color: transparent;
    border: 0; // 1px solid red; //0
    outline: none;
    font-family: ${theme.font.family.neue};
    font-style: normal;
    font-weight: 500;
    font-size: 2.5rem;
    line-height: 2rem;
    color: ${theme.colors.gray300};
    cursor: ${disabled ? "not-allowed" : "text"};
  `}
`;

type TokenInputProps = {
  // label: string
  value: string;
  tokenBalance: bigint | undefined;
  tokenIcon?: React.ReactNode;
  onChange: (e: any) => void;
  decimals?: number;
  disabled?: boolean;
  placeholder?: string;
  maxValue?: bigint;
  onBlurTruncateMaxLength?: number;
  shouldAllowMoreThanBalance?: boolean;
};

export default function TokenInput({
  // label,
  value,
  disabled,
  tokenBalance,
  maxValue,
  decimals,
  placeholder = "0",
  onChange,
  // isNativeToken = false,
  onBlurTruncateMaxLength,
  shouldAllowMoreThanBalance = false,
}: TokenInputProps) {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  //@TODO: Add unit tests to this - ensure it doesn't overflow or underflow
  const handleTokenInputChange = (e: any) => {
    try {
      const { value } = e.target;
      const decimalRegexp = /^\d*(?:[.,])?\d{0,18}$/;
      const decimalEnforcer = (nextUserInput: string) => {
        if (nextUserInput === "") {
          return undefined;
        } else if (nextUserInput === ".") {
          return "0.";
        } else if (decimalRegexp.test(nextUserInput)) {
          return nextUserInput;
        }
        return null;
      };

      const maxAllowedValue = maxValue
        ? maxValue >= (tokenBalance || 0)
          ? maxValue
          : tokenBalance
        : tokenBalance;

      const formattedMaxAllowedValue = formatUnits(
        (maxAllowedValue && maxAllowedValue) || BigInt(0),
        decimals
      );

      const nextInput = decimalEnforcer(value.replace(/,/g, "."));

      if (
        parseUnits(nextInput || formattedMaxAllowedValue, decimals) >
          parseUnits(formattedMaxAllowedValue, decimals) &&
        !shouldAllowMoreThanBalance
      ) {
        onChange(formattedMaxAllowedValue);
        return;
      }

      if (nextInput !== null) {
        onChange(nextInput ?? "");
      }
    } catch (err) {
      console.error("error on inputChange", err);
    }
  };

  const getTruncatedValue = useMemo(() => {
    if (
      value &&
      !isFocused &&
      onBlurTruncateMaxLength &&
      value.length > onBlurTruncateMaxLength
    ) {
      return value.substring(0, onBlurTruncateMaxLength) + "...";
    }
    return value;
  }, [isFocused, onBlurTruncateMaxLength, value]);

  return (
    <StyledInput
      // label={label}
      name="depositAmount"
      value={getTruncatedValue}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(e) => handleTokenInputChange(e)}
      autoComplete="off"
      ref={inputRef}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}
