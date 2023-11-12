'use client'
import InstructionsComponent from "@/components/instructionsComponent";
import styles from "./page.module.css";
import "./globals.css";
import { useContext, useState } from "react";
import { AccountAbstractionContext } from "@/context/AccountAbstractionContext";
import { useAlchemyProvider } from "@/hooks/useAlchemyProvider";
import { entryPointAddress } from "@/config/client"
import { createWalletClient, custom } from "viem";
import { SmartAccountSigner, WalletClientSigner } from "@alchemy/aa-core";
import Sidebar from "@/components/sidebar/Sidebar";
import HomeScreen from "./HomeScreen";

export default function Home() {
  // const { handleLogin, web3auth, handleLogOut, getUserInfo, getAccounts } = useContext(AccountAbstractionContext);
  // console.log("web3auth", web3auth)

  const { provider, connectProviderToAccount, disconnectProviderFromAccount } =
    useAlchemyProvider({ entryPointAddress });

  // const connectWallet = async () => {

  //   console.log("web3auth", web3auth)

  //   if (web3auth.provider == null) {
  //     throw new Error("web3auth provider is available");
  //   }

  //   const web3authClient = createWalletClient({
  //     transport: custom(web3auth.provider),
  //   });

  //   // a smart account signer you can use as an owner on ISmartContractAccount
  //   const web3authSigner: SmartAccountSigner = new WalletClientSigner(
  //     web3authClient,
  //     "web3auth" // signerType
  //   );

  //   console.log("web3authSigner", web3authSigner)

  //   connectProviderToAccount(web3authSigner);

  //   const address = await provider.getAddress();
  //   console.log("address", address)

  // }

  // const disconnetwallet = () => {
  //   disconnectProviderFromAccount();
  // }

  // const userInfo = () => {
  //   getUserInfo();
  // }

  // const logUserOut = () => {
  //   handleLogOut();
  // }

  // const getAccountAddress = () => {
  //   getAccounts();
  // }

  const [activeTab, setActiveTab] = useState(1);

  return (
    <main className={styles.main}>
      {/* <div onClick={handleLogin}>Log In</div>
      <div onClick={connectWallet}>Connect Wallet and Create</div>
      <div onClick={disconnetwallet}>DisConnect wallet</div>
      <div onClick={userInfo}>User Info</div>
      <div onClick={logUserOut}>Log Out</div>
      <div onClick={getAccountAddress}>Get Address</div> */}
      {/* <InstructionsComponent></InstructionsComponent> */}

      <div className="flex flex-row gap-4 ">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <HomeScreen activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>


    </main>
  );
}
