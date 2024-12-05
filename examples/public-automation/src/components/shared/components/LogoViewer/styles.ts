import styled, { css } from "styled-components";

export const StyledLogoViewer = styled.div<{ showOuterBorder: boolean }>`
  ${({ theme, showOuterBorder }) => css`
    display: flex;
    ${showOuterBorder &&
    css`
      img {
        border: 1px solid ${theme.colors.black};
      }
    `}
  `}
`;

export const CircleWrapper = styled.div<{
  size: number;
  fallbackInitialsSize: number;
}>`
  ${({ theme, size, fallbackInitialsSize }) => css`
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background-color: ${theme.colors.gray600};
    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    border: 1px solid ${theme.colors.black};

    p {
      font-size: ${fallbackInitialsSize}cqw !important;
    }
  `}
`;
