import React, { useCallback, useContext, useMemo, useState } from "react";
import { ThemeProvider } from "styled-components";

import { getTheme, Theme } from "@/lib";
import GlobalStyles from "@/lib/theme";

interface ThemeContextProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: Theme;
}

const ThemeContext = React.createContext({} as ThemeContextProps);

type CustomThemeProviderProps = {
  children: React.ReactNode;
  isDarkThemeDefault?: boolean;
};

const ThemeProviderContext = ({
  children,
  isDarkThemeDefault = false,
}: CustomThemeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(isDarkThemeDefault);

  const theme = useMemo(() => getTheme(isDarkMode), [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(!isDarkMode);
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <>
          <GlobalStyles dark={isDarkMode} />
          {children}
        </>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

const useThemeContext = () => useContext(ThemeContext);
export { ThemeProviderContext, useThemeContext };
