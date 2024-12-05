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
    [ARBITRUM_CHAIN_ID]: fallback([
      http(
        "https://arb-mainnet.g.alchemy.com/v2/q2VDjsGh2h0P6WZSXUq2eTw7y0_Ffkdq"
      ),
      ...arbitrum.rpcUrls.default.http.map((rpcUrl) => http(rpcUrl)),
    ]),
    // [BASE_MAINNET_CHAIN_ID]: fallback([
    //   http(
    //     "https://base-mainnet.g.alchemy.com/v2/q2VDjsGh2h0P6WZSXUq2eTw7y0_Ffkdq"
    //   ),
    //   ...base.rpcUrls.default.http.map((rpcUrl) => http(rpcUrl)),
    // ]),
  },
});
