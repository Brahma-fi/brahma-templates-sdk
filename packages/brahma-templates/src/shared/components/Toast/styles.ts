import styled, { css } from "styled-components";
import { hexTransparencies } from "@/lib";

export const StyledToast = styled.div`
  justify-content: space-between;
`;

export const ToastIcon = styled.div<{ color: string }>`
  ${({ theme, color }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2.8rem;
    width: 2.8rem;
    border: 1px solid ${theme.colors.black};
    border-radius: 0.56rem;
    background-color: ${color}${hexTransparencies[12]};

    &:hover {
      background-color: ${color}${hexTransparencies[24]};
    }

    svg,
    path {
      fill: ${color};
    }
  `}
`;
