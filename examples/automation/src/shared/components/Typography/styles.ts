import styled, { css } from "styled-components";

import { defaultTheme, Theme } from "@/lib";
import { TTypographyType, TypographyProps } from ".";

export const wrapperModifiers: { [key in TTypographyType]: any } = {
  TITLE_XXL: (theme: Theme) => css`
    font-family: ${theme.font.family.neue};
    font-size: 2.8rem;
    font-weight: ${theme.font.medium};
    line-height: 4rem;
  `,

  TITLE_XL: (theme: Theme) => css`
    font-family: ${theme.font.family.neue};
    font-size: 2.4rem;
    font-weight: ${theme.font.medium};
    line-height: 3.6rem;
  `,

  TITLE_L: (theme: Theme) => css`
    font-size: 2rem;
    font-weight: ${theme.font.medium};
    font-family: ${theme.font.family.neue};
    line-height: 2.8rem;
  `,

  TITLE_M: (theme: Theme) => css`
    font-size: 1.8rem;
    font-weight: ${theme.font.medium};
    font-family: ${theme.font.family.neue};
    line-height: 2.8rem;
  `,

  TITLE_S: (theme: Theme) => css`
    font-size: 1.6rem;
    font-weight: ${theme.font.medium};
    font-family: ${theme.font.family.neue};
    line-height: 2.4rem;
  `,

  TITLE_XS: (theme: Theme) => css`
    font-size: 1.4rem;
    font-weight: ${theme.font.medium};
    font-family: ${theme.font.family.neue};
    line-height: 2rem;
  `,

  BODY_L: (theme: Theme) => css`
    font-size: 1.8em;
    line-height: 2.8rem;
    font-weight: ${theme.font.regular};
    font-family: ${theme.font.family.neue};
  `,

  BODY_M: (theme: Theme) => css`
    font-size: 1.6rem;
    line-height: 2.4rem;
    font-weight: ${theme.font.regular};
    font-family: ${theme.font.family.neue};
  `,

  BODY_S: (theme: Theme) => css`
    font-size: 1.4rem;
    line-height: 2rem;
    font-weight: ${theme.font.regular};
    font-family: ${theme.font.family.neue};
  `,

  BODY_XS: (theme: Theme) => css`
    font-size: 1.2rem;
    line-height: 1.6rem;
    font-weight: ${theme.font.regular};
    font-family: ${theme.font.family.neue};
  `,

  BODY_XXS: (theme: Theme) => css`
    font-size: 1rem;
    line-height: 1.6rem;
    font-weight: ${theme.font.regular};
    font-family: ${theme.font.family.neue};
  `,

  BODY_MEDIUM_L: (theme: Theme) => css`
    font-size: 1.8rem;
    line-height: 2.8rem;
    font-weight: ${theme.font.medium};
    font-family: ${theme.font.family.neue};
  `,

  BODY_MEDIUM_M: (theme: Theme) => css`
    font-size: 1.6rem;
    line-height: 2.4rem;
    font-weight: ${theme.font.medium};
    font-family: ${theme.font.family.neue};
  `,

  BODY_MEDIUM_S: (theme: Theme) => css`
    font-size: 1.4rem;
    line-height: 2rem;
    font-weight: ${theme.font.medium};
    font-family: ${theme.font.family.neue};
  `,

  BODY_MEDIUM_XS: (theme: Theme) => css`
    font-size: 1.2rem;
    line-height: 1.6rem;
    font-weight: ${theme.font.medium};
    font-family: ${theme.font.family.neue};
  `,

  TAG: (theme: Theme) =>
    css`
      font-size: 1.6rem;
      line-height: 2.4rem;
      font-weight: ${theme.font.medium};
      font-family: ${theme.font.family.neue};
      text-transform: uppercase;
    `,

  BUTTON: (theme: Theme) => css`
    font-family: ${theme.font.family.neue};
    font-weight: ${theme.font.bold};
    font-size: ${theme.font.sizes.small};
    line-height: 28px;
  `,

  LINK: (theme: Theme) =>
    css`
      font-size: 1.4rem;
      line-height: 2.4rem;
      font-weight: ${theme.font.medium};
      font-family: ${theme.font.family.neue};
      text-decoration: underline;
    `,

  TITLE_COANDA: (theme: Theme) =>
    css`
      font-family: "Coanda";
      font-size: 6.4rem;
      font-weight: 400;
      line-height: 8rem;
    `,
};

type WrapperProps = TypographyProps & { [x: string]: any };

export const Wrapper = styled.p<WrapperProps>`
  ${({ type, color, shouldInheritColor, textAlign, hoverColor }) => css`
    color: ${color ? color : defaultTheme.colors.gray200};
    text-align: ${textAlign ? textAlign : "center"};
    ${!!type && wrapperModifiers[type](defaultTheme)}
    ${shouldInheritColor && "color: inherit"};
    transition: color ${defaultTheme.transition.default};

    ${hoverColor &&
    css`
      &:hover {
        color: ${hoverColor};
      }
    `}

    &::selection {
      background-color: ${defaultTheme.colors.console2};
      color: ${defaultTheme.colors.black};
    }
    &::-moz-selection {
      background-color: ${defaultTheme.colors.console2};
      color: ${defaultTheme.colors.black};
    }
  `}
`;
