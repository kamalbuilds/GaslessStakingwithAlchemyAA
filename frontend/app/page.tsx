'use client'
import "./globals.css";
import { useContext, useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import HomeScreen from "./HomeScreen";
import { AccountAbstractionContext } from "@/context/AccountAbstractionContext";

export default function Home() {

  const [activeTab, setActiveTab] = useState(1);
  const { smartWalletAddress } = useContext(AccountAbstractionContext);
  return (
    
    <>
      {/* <div>{smartWalletAddress && smartWalletAddress}</div> */}

      <main className="flex flex-row gap-4 h-[100vh] overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="w-[2px] bg-gray-400 h-[inherit]"></div>
        <HomeScreen activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
    </>
  );
}
