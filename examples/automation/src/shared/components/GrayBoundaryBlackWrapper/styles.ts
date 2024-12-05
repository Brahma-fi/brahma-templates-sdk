import styled, { css } from "styled-components";
import FlexContainer from "../FlexContainer";

export const StyledGrayBoundaryBlackWrapper = styled(FlexContainer)`
  ${({ flexDirection }) => css`
    & > :first-child {
      border-radius: ${flexDirection === "row"
        ? "0.4rem 0 0 0.4rem"
        : "0.4rem 0.4rem 0 0"} !important;
    }

    & > :last-child {
      border-radius: ${flexDirection === "row"
        ? "0 0.4rem 0.4rem 0"
        : "0 0 0.4rem 0.4rem"} !important;
    }

    & > :only-child {
      border-radius: 0.4rem !important;
    }
  `}
`;
