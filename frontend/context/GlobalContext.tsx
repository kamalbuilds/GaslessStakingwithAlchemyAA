import { createContext, useContext } from "react";
import { toast } from "react-toastify";
import { AccountAbstractionContext } from "./AccountAbstractionContext";

type GlobalContextType = {
    checkIfEligibileForGas?: any,
}

export const GlobalContext = createContext<GlobalContextType>({});

const GlobalContextProvider = ({ children }: any) => {

    const { provider } = useContext(AccountAbstractionContext);

    const checkIfEligibileForGas = async (data: any) => {

        try {

            const GAS_MANAGER_POLICY_ID = process.env.NEXT_PUBLIC_ALCHEMY_PAYMASTER_CLIENT_ID;

            provider.withAlchemyGasManager({
                policyId: GAS_MANAGER_POLICY_ID || '9cb0aa63-7c79-4924-9e18-8eba4d3db391',
            });

            let overrides;
            overrides = { paymasterAndData: "0x" }

            const elligibility = await provider.checkGasSponsorshipEligibility(data);
            if (elligibility) {
                toast.success("Congrats, You are eligible for gas Sponser")
                overrides = undefined;
            } else {
                toast.error("You are not eligible for gas sponser")
                overrides = overrides;
            }
            return overrides
        } catch (error) {
            console.log("Error", error)
            toast.error("You are not eligible")
        }

    }


    return (
        <GlobalContext.Provider value={{
            checkIfEligibileForGas
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContextProvider;

