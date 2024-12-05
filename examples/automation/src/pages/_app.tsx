import { ThemeProviderContext } from "@/providers/themeProvider";
import { ToastContainer } from "@/shared/components";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProviderContext>
      <ToastContainer />
      <Component {...pageProps} />
    </ThemeProviderContext>
  );
}
