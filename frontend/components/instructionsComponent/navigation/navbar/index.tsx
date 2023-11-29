
'use client'
import styles from "./navbar.module.css";
import { useContext } from "react";
import { AccountAbstractionContext } from "@/context/AccountAbstractionContext";
import { useAlchemyProvider } from "@/hooks/useAlchemyProvider";
import { entryPointAddress } from "@/config/client";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import AddressLabel from "@/components/AddressLabel/AddressLabel";
import Link from "next/link";
import useMemoizedAddressLabel from "@/hooks/useMemoizedAddressLabel";


export default function Navbar() {

  const { handleLogin, web3auth, smartWalletAddress, loggedIn, setLoggedIn, handleLogOut, getUserInfo, getAccounts } = useContext(AccountAbstractionContext);

  const { provider, connectProviderToAccount, disconnectProviderFromAccount } =
    useAlchemyProvider({ entryPointAddress });

  const address = smartWalletAddress && `${smartWalletAddress.slice(0, 6) + '....' + smartWalletAddress.slice(smartWalletAddress.length - 6)}`;

  console.log("loggedIn", loggedIn);

  console.log("provider", provider, provider.isConnected());

  return (
    <nav className="flex flex-row gap-4 justify-between pt-4 px-8">

      <div className='text-[26px]'>Gasless Staking</div>

      <div className="flex flex-row gap-4">
        {smartWalletAddress && <div className="px-4 py-2 border border-gray-400 rounded-lg">
          <Link href={`https://sepolia.etherscan.io/address/${smartWalletAddress}`} target="_blank">
            {address}
          </Link>
        </div>}

        {!loggedIn ?
          <button
            onClick={handleLogin}
            className=" px-[21px] py-[7px] bg-blue-700 text-white rounded-lg">Log In</button>
          :
          <button
            onClick={handleLogOut}
            className=" px-[21px] py-[7px] bg-blue-700 text-white rounded-lg">Log Out</button>
        }

        <ThemeSwitcher />
      </div>

    </nav>
  );
}
