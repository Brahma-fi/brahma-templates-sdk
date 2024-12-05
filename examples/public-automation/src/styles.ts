import { css, DefaultTheme } from "styled-components";
import { Theme } from "./lib";

export const opacityIn = (timeInSeconds: number) => css`
  @keyframes opacityInFrames {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  animation: opacityInFrames ease-in-out ${timeInSeconds}s;
`;

export const fadeInFromLeft = (timeInSeconds: number) => css`
  @keyframes fadein {
    from {
      opacity: 0;
      transform: translateX(-3rem);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  -webkit-animation: fadein ${timeInSeconds}s;
  -moz-animation: fadein ${timeInSeconds}s;
  -ms-animation: fadein ${timeInSeconds}s;
  -o-animation: fadein ${timeInSeconds}s;
  animation: fadein ${timeInSeconds}s;
`;

export const styleScrollbar = (theme: Theme | DefaultTheme) => css`
  ::-webkit-scrollbar {
    width: 0.5rem;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: ${theme.colors.gray800};
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.gray600};
    border-radius: 1rem;
    height: 5rem;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export const breathingAnimation = (theme: Theme, timeInSeconds = 2.5) => css`
  @keyframes breathing {
    0% {
      color: ${theme.colors.gray700};
    }
    50% {
      color: ${theme.colors.gray100};
    }
    100% {
      color: ${theme.colors.gray700};
    }
  }

  animation: breathing ${timeInSeconds}s ease-in-out infinite;
`;
