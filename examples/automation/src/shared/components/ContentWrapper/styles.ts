import styled, { css } from "styled-components";
import { opacityIn } from "@/styles";

export const StyledContentWrapper = styled.div<{
  padding: string;
  showOpacityIn: boolean;
}>`
  ${({ theme, padding, showOpacityIn }) => css`
    ${showOpacityIn && opacityIn(0.5)};
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: ${padding};
    background-color: ${theme.colors.gray700};
    gap: 1.2rem;
  `}
`;
