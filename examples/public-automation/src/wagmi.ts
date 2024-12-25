import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { ARBITRUM_CHAIN_ID, SUPPORTED_CHAINS } from "./constants";
import { fallback, http } from "wagmi";
import { arbitrum } from "viem/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: SUPPORTED_CHAINS,
  ssr: true,
  transports: {
    [1923]: fallback([
      http(
        "https://swell-mainnet.alt.technology"
      )
    ]),
  },
});
