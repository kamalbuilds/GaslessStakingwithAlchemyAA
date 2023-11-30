import { createContext, useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from "@web3auth/base";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { createWalletClient, custom } from "viem";
import { SmartAccountSigner, WalletClientSigner } from "@alchemy/aa-core";
import { useAlchemyProvider } from "@/hooks/useAlchemyProvider";
import { entryPointAddress } from "@/config/client";
import { AlchemyProvider } from "@alchemy/aa-alchemy";

type IAccountAbstractionContext = {
    web3auth: Web3Auth | null,
    loggedIn: boolean,
    provider: AlchemyProvider,
    smartWalletAddress: string,
    setLoggedIn: (loggedIn: boolean) => void,
    handleLogin: () => void,
    handleLogOut: () => void,
    getUserInfo: () => void,
}

const defaultUnset: any = null;

const initialValue = {
    web3auth: null,
    provider: defaultUnset,
    loggedIn: false,
    smartWalletAddress: '',
    setLoggedIn: () => { },
    handleLogin: () => { },
    handleLogOut: () => { },
    getUserInfo: () => { }
}

export const AccountAbstractionContext = createContext<IAccountAbstractionContext>(initialValue);



const AccountAbstractionContextProvider = ({ children }: any) => {

    const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
    const [torusPlugin, setTorusPlugin] = useState<TorusWalletConnectorPlugin | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [smartWalletAddress, setSmartWalletAddress] = useState<string>('');

    const { provider, connectProviderToAccount, disconnectProviderFromAccount } =
        useAlchemyProvider({ entryPointAddress });

    const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || 'BMtPIaYeIRpEhgQOl_3pnMfQ3JzAejuigCdYLfAFk8YnultR0QgOMYcfHAgS4PQKiNMWzNRspQAMZ2N_wSLeg7o';
    const rpcTarget = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/EGlJwOf582RNqCUcxTiiy8_XGRGGsx-h"

    useEffect(() => {
        const init = async () => {
            try {
                const web3auth = new Web3Auth({
                    clientId,
                    chainConfig: {
                        chainNamespace: CHAIN_NAMESPACES.EIP155,
                        chainId: "0xaa36a7",
                        blockExplorer: 'https://sepolia.etherscan.io',
                        rpcTarget: rpcTarget,
                    },
                    uiConfig: {
                        appName: "Gasless Staking",
                        theme: {
                            primary: "Blue",
                        },
                        mode: "dark",
                        logoLight: "https://web3auth.io/images/web3auth-logo.svg",
                        logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
                        defaultLanguage: "en",
                        loginGridCol: 3,
                        primaryButton: "externalLogin",
                    },
                    web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
                });

                const metamaskAdapter = new MetamaskAdapter({
                    clientId,
                    sessionTime: 86400,
                    web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
                    chainConfig: {
                        chainNamespace: CHAIN_NAMESPACES.EIP155,
                        chainId: "0xaa36a7",
                        blockExplorer: 'https://sepolia.etherscan.io',
                        rpcTarget: rpcTarget,
                    },
                });

                metamaskAdapter.setAdapterSettings({
                    sessionTime: 86400,
                    chainConfig: {
                        chainNamespace: CHAIN_NAMESPACES.EIP155,
                        chainId: "0xaa36a7",
                        blockExplorer: 'https://sepolia.etherscan.io',
                        rpcTarget: rpcTarget,
                    },
                    web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
                });

                console.log("Web3Auth", web3auth, web3auth.connected);

                setWeb3auth(web3auth);

                await web3auth.initModal({
                    modalConfig: {
                        [WALLET_ADAPTERS.WALLET_CONNECT_V2]: {
                            label: 'wallet-connect',
                            showOnModal: false,
                            showOnDesktop: false,
                        }
                    }
                });

                if (web3auth.connected) {
                    console.log("Web3Auth.Connected", web3auth, web3auth.connected);
                    if (web3auth.provider == null) {
                        throw new Error("web3auth provider is available");
                    }
                    const web3authClient = createWalletClient({
                        transport: custom(web3auth?.provider),
                    });

                    const web3authSigner: SmartAccountSigner = new WalletClientSigner(
                        web3authClient,
                        "web3auth"
                    );

                    console.log("web3authSigner", web3authSigner)
                    connectProviderToAccount(web3authSigner);
                    const address = await provider.getAddress();
                    setSmartWalletAddress(address);
                    setLoggedIn(true);
                }
            } catch (error) {
                console.error(error);
            }
        };

        init();
    }, []);

    const handleLogin = async () => {
        if (!web3auth) {
            console.log("web3auth not initialized yet");
            return;
        }

        try {
            console.log("Web3Auth in log in ", web3auth);
            await web3auth.connect();

            if (web3auth.provider == null) {
                throw new Error("web3auth provider is available");
            }

            const web3authClient = createWalletClient({
                transport: custom(web3auth.provider),
            });

            const web3authSigner: SmartAccountSigner = new WalletClientSigner(
                web3authClient,
                "web3auth"
            );

            console.log("web3authSigner", web3authSigner)
            connectProviderToAccount(web3authSigner);

            const address = await provider.getAddress();
            setSmartWalletAddress(address);
            console.log("address", address)

            setLoggedIn(true);
        } catch (error) {
            console.log("Error", error);
        }
    };

    const getUserInfo = async () => {
        if (!web3auth) {
            console.log("web3auth not initialized yet");
            return;
        }
        const user = await web3auth.getUserInfo();
        console.log("user Info", user);
    };

    const handleLogOut = async () => {
        if (!web3auth) {
            console.log("web3auth not initialized yet");
            return;
        }

        try {
            disconnectProviderFromAccount();
            await web3auth.logout();
            setLoggedIn(false);
            setSmartWalletAddress('');
        } catch (error) {
            console.log("Error", error)
        }
    }

    return (
        <AccountAbstractionContext.Provider value={{
            web3auth,
            provider,
            loggedIn,
            smartWalletAddress,
            setLoggedIn,
            handleLogin,
            handleLogOut,
            getUserInfo
        }}>
            {children}
        </AccountAbstractionContext.Provider>
    )
}

export default AccountAbstractionContextProvider;