import { createContext } from "react";
import { toast } from "react-toastify";

export const GlobalContext = createContext({});

const GlobalContextProvider = ({ children }: any) => {

    const checkIfEligibileForGas = async (provider: any, data: any) => {

        try {
            const elligibility = await provider.checkGasSponsorshipEligibility(data);
            console.log("Elligibility in context", elligibility, provider)
            if (elligibility) {
                toast.success("Congrats, You are eligible")
            } else {
                toast.error("You are not eligible")
            }
            return elligibility
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

