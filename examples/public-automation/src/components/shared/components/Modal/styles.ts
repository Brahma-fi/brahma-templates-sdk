import { opacityIn, styleScrollbar } from "@/styles";
import styled, { css } from "styled-components";

export const ModalWrapper = styled.div<{
  isOpen: boolean;
  zIndex?: number;
  overlay: boolean;
}>`
  ${({ theme, isOpen, zIndex, overlay }) => css`
    ${opacityIn(0.25)};
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${overlay ? "rgba(0, 0, 0, 0.2)" : "transparent"};
    z-index: ${zIndex || theme.layers.menu};
    visibility: ${isOpen ? "visible" : "hidden"};
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    overflow: hidden;
  `}
`;

export const ModalContent = styled.div<{
  top: number;
  isCenterAligned: boolean;
  marginBottom?: string;
}>`
  ${({ top, theme, isCenterAligned, marginBottom }) => css`
    ${styleScrollbar(theme)}
    display: flex;
    justify-content: center;
    overflow-y: auto;
    height: 100%;
    width: 100%;
    overscroll-behavior: contain;
    ${marginBottom && `margin-bottom: ${marginBottom}`};

    ${isCenterAligned
      ? css`
          align-items: center;
        `
      : css`
          padding-top: ${top}rem;
        `}
  `}
`;
