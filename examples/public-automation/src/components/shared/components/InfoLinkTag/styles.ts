import styled, { css } from "styled-components";

import { hexTransparencies, Theme } from "@/lib";
import { InfoLinkTagProps } from ".";

const selectStyle: {
  [key in NonNullable<InfoLinkTagProps["tagColorType"]>]: any;
} = {
  default: (theme: Theme, hoverStyles = true) => css`
    background-color: ${theme.colors.gray700};

    p {
      color: ${theme.colors.gray100};
    }

    ${hoverStyles &&
    css`
      &:hover {
        background-color: ${theme.colors.gray600};
      }
    `}
  `,

  console: (theme: Theme, hoverStyles = true) => css`
    background-color: ${theme.colors.console2}${hexTransparencies[12]};

    p {
      color: ${theme.colors.console2};
    }

    ${hoverStyles &&
    css`
      &:hover {
        background-color: ${theme.colors.console2}${hexTransparencies[24]};
      }
    `}

    svg,
    path {
      fill: ${theme.colors.console2};
    }
  `,

  warning: (theme: Theme, hoverStyles = true) => css`
    background-color: ${theme.colors.warning}1F;

    p {
      color: ${theme.colors.warning};
    }

    ${hoverStyles &&
    css`
      &:hover {
        background-color: ${theme.colors.warning}3d;
      }
    `}

    svg,
    path {
      fill: ${theme.colors.warning};
    }
  `,

  error: (theme: Theme, hoverStyles = true) => css`
    background-color: ${theme.colors.error}1A;

    p {
      color: ${theme.colors.error};
    }

    ${hoverStyles &&
    css`
      &:hover {
        background-color: ${theme.colors.error}3D;
      }
    `}

    svg,
    path {
      fill: ${theme.colors.error};
    }
  `,

  success: (theme: Theme, hoverStyles = true) => css`
    background-color: ${theme.colors.success}1A;

    p {
      color: ${theme.colors.success};
    }

    &:hover {
      background-color: ${theme.colors.success}3D;
    }

    svg,
    path {
      fill: ${theme.colors.success};
    }
  `,

  blast: (theme: Theme, hoverStyles = true) => css`
    background-color: ${theme.colors.blast}1A;

    p {
      color: ${theme.colors.blast};
    }

    &:hover {
      background-color: ${theme.colors.blast}3D;
    }

    svg,
    path {
      fill: ${theme.colors.blast};
    }
  `,
};

export const StyledTagComponent = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    border-radius: 0.4rem;
    width: fit-content;
    min-width: fit-content;
    transition: background-color ${theme.transition.default};
    background-color: ${theme.colors.gray700};
    height: fit-content;
    white-space: nowrap;
    outline: 1px solid ${theme.colors.black};
    min-height: 2.4rem;
    overflow: hidden;
  `}
`;

export const ContentWrapper = styled.div<{
  tagColorType: InfoLinkTagProps["tagColorType"];
  isCustomComponent: boolean;
  hasLeftBorder: boolean;
}>`
  ${({
    theme,
    isCustomComponent,
    hasLeftBorder,
    tagColorType = "default",
  }) => css`
    display: flex;
    align-items: center;
    padding: 0rem 0.4rem;
    height: 100%;
    min-height: 2.4rem;
    transition: background-color ${theme.transition.default};
    gap: 0.4rem;
    border-left: ${hasLeftBorder && `1px solid ${theme.colors.black}`};
    ${!isCustomComponent && selectStyle[tagColorType](theme, false)};
  `}
`;

export const HighlightIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const IconBox = styled.div<
  Pick<InfoLinkTagProps, "tagColorType"> & { hasHoverStyles: boolean }
>`
  ${({ theme, hasHoverStyles, tagColorType = "default" }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 0 0.4rem;
    border-left: 1px solid ${theme.colors.black};
    min-height: 2.4rem;
    transition: background-color ${theme.transition.default};
    cursor: pointer;

    ${selectStyle[tagColorType](theme, hasHoverStyles)};
  `}
`;
