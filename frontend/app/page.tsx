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
      <main className="flex flex-row gap-4 min-h-[100vh] border-t-2 mt-4 border-gray-400">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="w-[2px] bg-gray-400 h-[inherit]"></div>
        <HomeScreen activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
    </>
  );
}
