"use client";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import Navbar from "@/components/instructionsComponent/navigation/navbar";
import Footer from "@/components/instructionsComponent/navigation/footer";
import { goerli, sepolia } from "viem/chains";
import AccountAbstractionContextProvider from "@/context/AccountAbstractionContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: process.env.ALCHEMY_API_KEY, // or infuraId
    walletConnectProjectId: process.env.WALLETCONNECT_PROJECT_ID || '13cb273de7349b752d7b515254c2c972',

    chains: [sepolia],

    // Required
    appName: "Gasless Staking and Earning Rewards",

    // Optional
    appDescription: "Your App Description",
    appUrl: "https://gaslessstakingwithaa.co", // your app's url
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
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

              <body>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <ToastContainer theme="dark" />
                  <Navbar />
                  {children}
                </div>
              </body>
            </ThemeProvider>
          </ConnectKitProvider>
        </WagmiConfig>
      </AccountAbstractionContextProvider>
    </html>
  );
}