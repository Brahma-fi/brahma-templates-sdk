import styled, { css } from "styled-components";

import { hexTransparencies, Theme } from "../../../../lib";
import { ActionButtonSizes } from ".";

const selectStyle: {
  [key in ActionButtonSizes]: any;
} = {
  S: (theme: Theme) => css`
    height: 2rem;
    width: 2rem;
  `,

  M: (theme: Theme) => css`
    height: 2.4rem;
    width: 2.4rem;
  `,

  L: (theme: Theme) => css`
    height: 2.8rem;
    width: 2.8rem;
    min-width: 2.8rem;
  `,

  XL: (theme: Theme) => css`
    height: 4.4rem;
    width: 4.4rem;
  `,

  FULL: (theme: Theme) => css`
    height: 2.8rem;
    width: fit-content;
  `,
};

const disabledStyle = () => css`
  cursor: not-allowed;
  &:hover {
    background-color: transparent;
  }
  /* border: 1px solid red; */
`;

export const StyledActionIconWrapper = styled.div<{
  hoverColor: string;
  color: string;
  size: ActionButtonSizes;
  disabled?: boolean;
}>`
  ${({ theme, color, hoverColor, size, disabled }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color ${theme.transition.default};
    border-radius: 0.4rem;

    svg,
    path,
    p {
      transition: fill ${theme.transition.default},
        color ${theme.transition.default};

      color: ${color};
      fill: ${color};
    }

    ${selectStyle[size](theme)};
    ${disabled
      ? disabledStyle()
      : css`
          &:hover {
            path,
            p {
              color: ${hoverColor};
              fill: ${hoverColor};
            }
          }
        `}

    &:hover {
      background-color: ${theme.colors.gray600 + hexTransparencies["64"]};
    }
  `}
`;
