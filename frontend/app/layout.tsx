"use client";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import Navbar from "@/components/instructionsComponent/navigation/navbar";
import Footer from "@/components/instructionsComponent/navigation/footer";
import { goerli, sepolia } from "viem/chains";
import AccountAbstractionContextProvider from "@/context/AccountAbstractionContext";

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: process.env.ALCHEMY_API_KEY, // or infuraId
    walletConnectProjectId: process.env.WALLETCONNECT_PROJECT_ID || '13cb273de7349b752d7b515254c2c972',

    chains: [sepolia],

    // Required
    appName: "You Create Web3 Dapp",

    // Optional
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's logo,no bigger than 1024x1024px (max. 1MB)
  })
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AccountAbstractionContextProvider>
        <WagmiConfig config={config}>
          <ConnectKitProvider mode="dark">
            <body>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {/* <Navbar /> */}
                {children}
              </div>
            </body>
          </ConnectKitProvider>
        </WagmiConfig>
      </AccountAbstractionContextProvider>
    </html>
  );
}