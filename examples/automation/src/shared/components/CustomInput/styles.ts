import styled, { css } from "styled-components";
import { defaultTheme, Theme } from "@/lib";
import { CustomInputProps } from ".";

const selectStyle: {
  [key in NonNullable<CustomInputProps["accentColor"]>]: any;
} = {
  console: (theme: Theme) => css`
    border: 1px solid ${theme.colors.console2};
  `,

  secondary: (theme: Theme) => css`
    border: 1px solid ${theme.colors.gray600};
  `,

  warning: (theme: Theme) => css`
    border: 1px solid ${theme.colors.warning};

    input {
      color: ${theme.colors.warning};
    }
  `,

  error: (theme: Theme) => css`
    border: 1px solid ${theme.colors.error};
  `,
};

export const StyledCustomInputWrapper = styled.div<{
  focused: boolean;
  accentColor: NonNullable<CustomInputProps["accentColor"]>;
  isInvalid?: boolean;
  hasLeftIcon?: boolean;
  disabled?: boolean;
  padding?: string;
  touched?: boolean;
}>`
  ${({ focused, isInvalid, accentColor, disabled, padding, touched }) => css`
    display: flex;
    align-items: center;
    gap: 1rem;
    height: 4.4rem;
    background-color: ${defaultTheme.colors.black};
    border: 1px solid ${defaultTheme.colors.gray700};
    border-radius: 4px;
    transition: border-color ${defaultTheme.transition.default};
    padding: ${padding};
    width: 100%;
    cursor: ${disabled && "not-allowed"};

    ${!disabled &&
    css`
      ${(focused && isInvalid) || (touched && isInvalid)
        ? selectStyle["error"](defaultTheme)
        : focused && selectStyle[accentColor](defaultTheme)};

      &:hover {
        border-color: ${!focused && !touched && defaultTheme.colors.gray600};
      }
    `}
  `}
`;

export const CustomStyledInput = styled.input<{
  spaceLeft?: boolean;
  disabled?: boolean;
}>`
  ${({ spaceLeft = false, disabled }) => css`
    height: 4.4rem;
    width: 100%;
    border: none;
    background-color: transparent;
    color: ${defaultTheme.colors.gray300};
    transition: border-color 0.1s linear;
    font-weight: 500;
    font-size: 1.4rem;
    line-height: 2rem;
    padding-left: ${spaceLeft ? "1.2rem" : "0"};

    ${disabled &&
    css`
      cursor: not-allowed;
    `}

    &::placeholder {
      color: ${defaultTheme.colors.gray600};
    }

    &:hover,
    &:focus {
      outline: none;
    }
  `}
`;
