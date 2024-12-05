import styled, { css } from "styled-components";
import { defaultTheme, Theme } from "../../../../lib";
import { ButtonSize, ButtonTypeProp } from ".";

type StyledButtonProp = {
  buttonType: ButtonTypeProp;
  buttonSize: ButtonSize;
  removePadding?: boolean;
};

const selectStyle: { [key in ButtonTypeProp | ButtonSize]: any } = {
  primary: (theme: Theme) => css`
    background: ${theme.colors.console2}14;
    border: 1px solid ${theme.colors.console2};
    color: ${theme.colors.console2};

    &:hover {
      background: ${theme.colors.console2}2B;
      border: 1px solid ${theme.colors.console2};
    }
  `,

  secondary: (theme: Theme) => css`
    color: ${theme.colors.gray400};
    background-color: transparent;
    border: 1px solid ${theme.colors.gray700};

    &:hover {
      background: ${theme.colors.gray700};
      border: 1px solid ${theme.colors.gray600};
      color: ${theme.colors.gray300};
    }
  `,

  black: (theme: Theme) => css`
    border: 1px solid ${theme.colors.black};
    color: ${theme.colors.console2};
    background-color: ${theme.colors.black};

    &:hover {
      background: transparent;
      border: 1px solid ${theme.colors.black};
      color: ${theme.colors.black};
    }
  `,

  warning: (theme: Theme) => css`
    background: ${theme.colors.warning}10;
    border: 1px solid ${theme.colors.warning};
    color: ${theme.colors.warning};

    &:hover {
      background: ${theme.colors.warning}30;
    }
  `,

  warningSecondary: (theme: Theme) => css`
    background: transparent;
    border: 1px solid ${theme.colors.warning};
    color: ${theme.colors.warning};

    &:hover {
      background: ${theme.colors.warning}30;
    }
  `,

  danger: (theme: Theme) => css`
    background: ${theme.colors.error}10;
    border: 1px solid ${theme.colors.error};
    color: ${theme.colors.error};

    &:hover {
      background: ${theme.colors.error}30;
    }
  `,

  kernel: (theme: Theme) => css`
    background: ${theme.colors.kernel}10;
    border: 1px solid ${theme.colors.kernel};
    color: ${theme.colors.kernel};

    &:hover {
      background: ${theme.colors.kernel}30;
    }
  `,

  blast: (theme: Theme) => css`
    background: ${theme.colors.blast}10;
    border: 1px solid ${theme.colors.blast};
    color: ${theme.colors.blast};
    backdrop-filter: blur(6px);

    &:hover {
      background: ${theme.colors.blast}30;
    }
  `,

  custom: (theme: Theme, color: string) => css`
    background: ${color}10;
    border: 1px solid ${color};
    color: ${color};

    &:hover {
      background: ${color}30;
      border: 1px solid ${color};
    }
  `,

  M: () => css`
    font-size: 1.4rem;
    padding: 0.4rem 4rem;
    height: 4.4rem;
    width: max-content;
  `,

  S: () => css`
    font-size: 1.2rem;
    padding: 0.2rem 0.8rem;
    width: max-content;
    border-radius: 0.4rem;
  `,

  L: () => css`
    font-size: 1.4rem;
    padding: 0.4rem 4rem;
    height: 4.4rem;
    width: 100%;
  `,
};

export const StyledButton = styled.button<StyledButtonProp>`
  ${({ color, buttonType, buttonSize = "M", removePadding = false }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    line-height: 2rem;
    cursor: pointer;
    transition: border 0.1s linear, background 0.1s linear;
    border-radius: 0.8rem;
    font-weight: ${defaultTheme.font.medium};

    ${buttonSize && selectStyle[buttonSize](defaultTheme, color)};
    ${buttonType && selectStyle[buttonType](defaultTheme, color)};

    ${!!removePadding && "padding: 0"};

    &:disabled {
      background: ${defaultTheme.colors.gray600};
      color: ${defaultTheme.colors.gray400};
      cursor: not-allowed;
      border: none;
    }
  `}
`;
