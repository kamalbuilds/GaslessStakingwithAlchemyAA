
'use client'
import styles from "./navbar.module.css";
import { useContext } from "react";
import { AccountAbstractionContext } from "@/context/AccountAbstractionContext";
import { useAlchemyProvider } from "@/hooks/useAlchemyProvider";
import { entryPointAddress } from "@/config/client";
export default function Navbar() {

  const { handleLogin, web3auth, loggedIn, setLoggedIn, handleLogOut, getUserInfo, getAccounts } = useContext(AccountAbstractionContext);

  const { provider, connectProviderToAccount, disconnectProviderFromAccount } =
    useAlchemyProvider({ entryPointAddress });

  console.log("loggedIn", loggedIn);

  console.log("provider", provider, provider.isConnected());


  return (
    <nav className={styles.navbar}>
      {!loggedIn ? <div>
        <button
          onClick={handleLogin}
          className="border border-gray-400 px-[21px] py-[7px] bg-blue-700 text-white rounded-lg">Log In</button>
      </div> :
        <div>
          <button
            onClick={handleLogOut}
            className="border border-gray-400 px-[21px] py-[7px] bg-blue-700 text-white rounded-lg">Log Out</button>
        </div>


      }

    </nav>
  );
}
