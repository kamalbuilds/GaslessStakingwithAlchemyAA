import { getDefaultLightAccountFactoryAddress } from "@alchemy/aa-accounts";
import { goerli, sepolia } from "viem/chains";

export const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
export const lightAccountFactoryAddress =
  getDefaultLightAccountFactoryAddress(sepolia);
export const chain = sepolia;
export const isDev = "development";
// export const gasManagerPolicyId = 'd5091ec8-befc-4ed5-b9fb-277c552736d9';
export const gasManagerPolicyId = 'fa83607d-d97e-4b05-a512-5fdbc33c98c1';

