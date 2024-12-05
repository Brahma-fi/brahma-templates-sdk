import styled, { css } from "styled-components";

export const StyledHrLine = styled.div<{ paddingX: number }>`
  ${({ paddingX }) => css`
    display: flex;
    justify-content: center;
    padding: 0 ${paddingX}rem;
    width: 100%;
  `}
`;

export const HeaderLine = styled.hr<{ color: string }>`
  ${({ color }) => css`
    border-color: ${color};
    border-top: none;
    width: 100%;
    background-color: transparent;
  `}
`;
