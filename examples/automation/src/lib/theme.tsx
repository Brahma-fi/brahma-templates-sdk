import { createGlobalStyle, ServerStyleSheet } from "styled-components";
import { generateMedia } from "styled-media-query";
import { neueBold, neueMedium, neueRegular } from "./fonts";

interface theme {
  dark: boolean;
}

function colors(darkMode = true) {
  return darkMode
    ? {
        primary: "#93A7E3",
        console: "#5AEDFC",
        console2: "#B2F8FF",
        consolePro: "#CA89F9",
        aaveGho: "#D4CDEA",
        topgear: "#FF86D1",
        bgGradient:
          "linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #0D0E11;",
        success: "#66DB94",
        error: "#F45562",
        warning: "#FFAD0D",
        white: "#FFFFFF",
        black: "#000000",
        gray100: "#E6E8ED",
        gray200: "#DEE0E3",
        gray300: "#CBCED1",
        gray400: "#A8ADB5",
        gray500: "#6D7178",
        gray600: "#494C56",
        gray700: "#292930",
        gray800: "#18181C",
        gray900: "#0D0D10",
        light500: "#A3A3A3",
        mainBg: "#0D0E11",
        kernel: "#D9A4FF",
        blast: "#F8FC53",
        arbitrum: "#35434f",
        automation: "#E4CAFF",
        template: "#FDFFB1",
      }
    : {
        primary: "#93A7E3",
        console: "#5AEDFC",
        console2: "#B2F8FF",
        consolePro: "#CA89F9",
        aaveGho: "#D4CDEA",
        topgear: "#FF86D1",
        bgGradient:
          "linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #0D0E11;",
        success: "#66DB94",
        error: "#F45562",
        warning: "#FFAD0D",
        white: "#FFFFFF",
        black: "#000000",
        gray100: "#E6E8ED",
        gray200: "#DEE0E3",
        gray300: "#CBCED1",
        gray400: "#A8ADB5",
        gray500: "#6D7178",
        gray600: "#494C56",
        gray700: "#292930",
        gray800: "#18181C",
        gray900: "#0D0D10",
        light500: "#A3A3A3",
        mainBg: "#0D0E11",
        kernel: "#D9A4FF",
        blast: "#F8FC53",
        arbitrum: "#35434f",
        automation: "#E4CAFF",
        template: "#FDFFB1",
      };
}

function getTheme(darkMode = true) {
  return {
    grid: {
      container: "130rem",
      gutter: "3.2rem",
    },
    border: {
      radius: "0.2rem",
      color: darkMode ? "#292930" : "#E8E8E8",
    },
    font: {
      family: {
        neue: "Neue Montreal, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        coanda:
          "'Coanda', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      },
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      sizes: {
        xxsmall: "1.4rem",
        xsmall: "1.8rem",
        small: "2rem",
        medium: "3rem",
        large: "7rem",
        xlarge: "12rem",
        xxlarge: "20rem",
        huge: "23rem",
        mobile: {
          xsmall: "1.6rem",
          small: "2rem",
          medium: "3.6rem",
          large: "5rem",
          xlarge: "8rem",
        },
      },
    },
    colors: colors(darkMode),
    spacings: {
      xxsmall: "0.8rem",
      xsmall: "1.6rem",
      small: "2.4rem",
      medium: "3.2rem",
      large: "4.0rem",
      xlarge: "4.8rem",
      xxlarge: "5.6rem",
    },
    layers: {
      base: 10,
      menu: 20,
      overlay: 30,
      modal: 40,
      alwaysOnTop: 50,
    },
    transition: {
      default: "0.3s ease-in-out",
      fast: "0.1s ease-in-out",
      long: "0.7s ease-in-out",
    },
  } as const;
}

const defaultTheme = getTheme(true);

const customMediaBreakpoints = {
  huge: 1600,
  xLarge: 1400,
  large: 1250,
  medium: 950,
  small: 700,
} as const;

const customMedia = generateMedia({
  huge: `${customMediaBreakpoints.huge}px`,
  xLarge: `${customMediaBreakpoints.xLarge}px`,
  large: `${customMediaBreakpoints.large}px`,
  medium: `${customMediaBreakpoints.medium}px`,
  small: `${customMediaBreakpoints.small}px`,
});

export type Theme = typeof defaultTheme;
export {
  defaultTheme,
  getTheme,
  ServerStyleSheet,
  customMedia,
  customMediaBreakpoints,
};

const GlobalStyles = createGlobalStyle<theme>`
   @font-face {
        font-family: ${neueRegular.style.fontFamily}; 
        font-style: ${neueRegular.style.fontStyle};
        font-weight: ${neueRegular.style.fontWeight};
        font-display: swap;
        src: local('Neue Montreal Regular'), local('Neue-Montreal-Regular'),
            url('${"../fonts/NeueMontreal-Regular.woff2"}') format('woff2');
    }

    @font-face {
        font-family: ${neueMedium.style.fontFamily};
        font-style: ${neueMedium.style.fontStyle};
        font-weight: ${neueMedium.style.fontWeight};
        font-display: swap;
        src: local('Neue Montreal Medium'), local('Neue-Montreal-Medium'),
            url('${"../fonts/NeueMontreal-Medium.woff2"}') format('woff2');
    }

    @font-face {
        font-family: ${neueBold.style.fontFamily};
        font-style: ${neueBold.style.fontStyle};
        font-weight: ${neueBold.style.fontWeight};
        font-display: swap;
        src: local('Neue Montreal Bold'), local('Neue-Montreal-Bold'),
            url('${"../fonts/NeueMontreal-Bold.woff2"}') format('woff2');
    }


    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /* background: #0D0E11; */
        color: white;
        scroll-behavior: smooth!important;
        
        &::before, &::after {
          box-sizing: inherit;
        }
      }

    html {
        font-size: 62.5%;
      }

    body {
      background-color: #0d0e11;
    }

    
  `;

export const hexTransparencies = {
  100: "FF",
  99: "FC",
  98: "FA",
  97: "F7",
  96: "F5",
  95: "F2",
  94: "F0",
  93: "ED",
  92: "EB",
  91: "E8",
  90: "E6",
  89: "E3",
  88: "E0",
  87: "DE",
  86: "DB",
  85: "D9",
  84: "D6",
  83: "D4",
  82: "D1",
  81: "CF",
  80: "CC",
  79: "C9",
  78: "C7",
  77: "C4",
  76: "C2",
  75: "BF",
  74: "BD",
  73: "BA",
  72: "B8",
  71: "B5",
  70: "B3",
  69: "B0",
  68: "AD",
  67: "AB",
  66: "A8",
  65: "A6",
  64: "A3",
  63: "A1",
  62: "9E",
  61: "9C",
  60: "99",
  59: "96",
  58: "94",
  57: "91",
  56: "8F",
  55: "8C",
  54: "8A",
  53: "87",
  52: "85",
  51: "82",
  50: "80",
  49: "7D",
  48: "7A",
  47: "78",
  46: "75",
  45: "73",
  44: "70",
  43: "6E",
  42: "6B",
  41: "69",
  40: "66",
  39: "63",
  38: "61",
  37: "5E",
  36: "5C",
  35: "59",
  34: "57",
  33: "54",
  32: "52",
  31: "4F",
  30: "4D",
  29: "4A",
  28: "47",
  27: "45",
  26: "42",
  25: "40",
  24: "3D",
  23: "3B",
  22: "38",
  21: "36",
  20: "33",
  19: "30",
  18: "2E",
  17: "2B",
  16: "29",
  15: "26",
  14: "24",
  13: "21",
  12: "1F",
  11: "1C",
  10: "1A",
  9: "17",
  8: "14",
  7: "12",
  6: "0F",
  5: "0D",
  4: "0A",
  3: "08",
  2: "05",
  1: "03",
  0: "00",
};

export default GlobalStyles;
