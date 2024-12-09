import styled, { css } from "styled-components";
import { hexTransparencies, Theme } from "@/lib";

import { InformationBarProps } from ".";

const selectStyle: {
  [key in NonNullable<InformationBarProps["accent"]>]: any;
} = {
  default: (theme: Theme, overrideIconColor: boolean) => css`
    > div {
      background-color: ${theme.colors.gray600};
    }

    p {
      color: ${theme.colors.gray100};
    }

    ${overrideIconColor &&
    css`
      svg,
      path {
        fill: ${theme.colors.white};
      }
    `}
  `,

  console: (theme: Theme, overrideIconColor: boolean) => css`
    > div {
      background-color: ${theme.colors.console2}${hexTransparencies[10]};
      border: 1px solid ${theme.colors.console2}${hexTransparencies[50]};
    }

    p {
      color: ${theme.colors.console2};
    }

    ${overrideIconColor &&
    css`
      svg,
      path {
        fill: ${theme.colors.console2};
      }
    `}
  `,

  blast: (theme: Theme, overrideIconColor: boolean) => css`
    > div {
      background-color: ${theme.colors.blast}${hexTransparencies[10]};
      border: 1px solid ${theme.colors.blast}${hexTransparencies[50]};
    }

    p {
      color: ${theme.colors.blast};
    }

    ${overrideIconColor &&
    css`
      svg,
      path {
        fill: ${theme.colors.blast};
      }
    `}
  `,

  warning: (theme: Theme, overrideIconColor: boolean) => css`
    > div {
      background-color: ${theme.colors.warning}${hexTransparencies[10]};
      border: 1px solid ${theme.colors.warning}${hexTransparencies[50]};
    }

    p {
      color: ${theme.colors.warning};
    }

    ${overrideIconColor &&
    css`
      svg,
      path {
        fill: ${theme.colors.warning};
      }
    `}
  `,

  error: (theme: Theme, overrideIconColor: boolean) => css`
    > div {
      background-color: ${theme.colors.error}${hexTransparencies[10]};
      border: 1px solid ${theme.colors.error}${hexTransparencies[50]};
    }

    p {
      color: ${theme.colors.error};
    }

    ${overrideIconColor &&
    css`
      svg,
      path {
        fill: ${theme.colors.error};
      }
    `}
  `,

  success: (theme: Theme, overrideIconColor: boolean) => css`
    > div {
      background-color: ${theme.colors.success}${hexTransparencies[10]};
      border: 1px solid ${theme.colors.success}${hexTransparencies[50]};
    }

    p {
      color: ${theme.colors.success};
    }

    ${overrideIconColor &&
    css`
      svg,
      path {
        fill: ${theme.colors.success};
      }
    `}
  `,
};

export const StyledInformationBar = styled.div<{
  overrideIconColor: boolean;
  accent: NonNullable<InformationBarProps["accent"]>;
  showExtraBorder?: boolean;
}>`
  ${({ theme, accent, overrideIconColor, showExtraBorder }) => css`
    display: flex;
    gap: 0.9rem;
    width: 100%;
    justify-content: space-between;

    padding: 0.4rem;
    ${showExtraBorder && `border: 1px solid ${theme.colors.gray600}`};
    border-radius: 0.8rem;

    > div {
      padding: 1.2rem 1.6rem;
      border-radius: 0.4rem;
    }

    p {
      color: ${theme.colors.gray400};
    }

    ${overrideIconColor &&
    css`
      path {
        fill: ${theme.colors.gray400};
      }
    `}

    ${selectStyle[accent](theme, overrideIconColor)};
  `}
`;
