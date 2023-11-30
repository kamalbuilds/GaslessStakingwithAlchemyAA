import {
  chain,
  gasManagerPolicyId,
  lightAccountFactoryAddress,
} from "@/config/client";
import { LightSmartContractAccount, getDefaultLightAccountFactoryAddress } from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { SmartAccountSigner } from "@alchemy/aa-core";
import { Alchemy, Network } from "alchemy-sdk";
import { useCallback, useState } from "react";
import { Address } from "viem";
import { sepolia } from "wagmi";

type AlchemyProviderProps = {
  entryPointAddress: Address;
};

export const useAlchemyProvider = ({
  entryPointAddress,
}: AlchemyProviderProps) => {

  const alchemyAPIKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'EGlJwOf582RNqCUcxTiiy8_XGRGGsx-h';
  const alchemyRPCUrl = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/EGlJwOf582RNqCUcxTiiy8_XGRGGsx-h"

  console.log("ENV", alchemyAPIKey)

  const alchemy = new Alchemy({
    network: Network.ETH_SEPOLIA,
    apiKey: alchemyAPIKey,
  });

  const [provider, setProvider] = useState<AlchemyProvider>(
    new AlchemyProvider({
      chain: sepolia,
      entryPointAddress,
      rpcUrl: alchemyRPCUrl// This is the public RPC we have added, please pass on your own endpoint while creating an app
    }).withAlchemyEnhancedApis(alchemy)
  )



  const connectProviderToAccount = useCallback(
    (signer: SmartAccountSigner, account?: Address) => {
      const connectedProvider = provider
        .connect((provider) => {
          return new LightSmartContractAccount({
            rpcClient: provider,
            owner: signer,
            chain,
            entryPointAddress,
            factoryAddress: getDefaultLightAccountFactoryAddress(chain),
            accountAddress: account,
          });
        })
      console.log("connectedProvider", connectedProvider)
      setProvider(connectedProvider);
      return connectedProvider;
    },
    [entryPointAddress, provider]
  );

  const disconnectProviderFromAccount = useCallback(() => {
    const disconnectedProvider = provider.disconnect();

    setProvider(disconnectedProvider);
    return disconnectedProvider;
  }, [provider]);

  return { provider, connectProviderToAccount, disconnectProviderFromAccount };
};