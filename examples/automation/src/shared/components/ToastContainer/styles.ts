import styled, { css } from "styled-components";
import { ToastContainer } from "react-toastify";

export const StyledToastContainer = styled(ToastContainer)`
  ${({ theme }) => css`
    &&&.Toastify__toast-container {
      width: 40rem;
    }
    .Toastify__toast {
      background-color: ${theme.colors.gray800};
      border: 1px solid ${theme.colors.black};
      padding: 1.6rem;
    }
    .Toastify__toast-body {
      padding: 0;
    }
    .Toastify__progress-bar {
      --toastify-color-progress-light: ${theme.colors.console2};
      --toastify-color-progress-bgo: 1;
    }

    .Toastify__progress-bar--wrp {
      height: 2px;
      --toastify-color-progress-light: ${theme.colors.gray600};
    }
  `}
`;
