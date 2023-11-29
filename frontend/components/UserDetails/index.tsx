import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';
import { LightSmartContractAccount } from '@alchemy/aa-accounts';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from "react-toastify";

const UserDetails = () => {

    const { provider, smartWalletAddress, getUserInfo } = useContext(AccountAbstractionContext);

    const [isDeployed, setIsDeployed] = useState(false);
    const [ownerAddress, setOwnerAddress] = useState();

    useEffect(() => {

        if (provider) {
            const getState = async () => {
                if (provider.account) {
                    const deploymentState = await provider.account.getDeploymentState();
                    const isAccountDeployed = await provider.account.isAccountDeployed();
                    toast.info("SmartAccount is deployed", isAccountDeployed);
                    setIsDeployed(isAccountDeployed);
                    const owner = await provider.account.getOwnerAddress();
                    setOwnerAddress(owner);
                    console.log("Deployment State", deploymentState, isAccountDeployed, owner);
                }
            }

            getState();
        }

    }, [provider])






    return (
        <div>
            <div className='text-[32px]'>User Details</div>

            <div>
                <div>
                    <div>Smart Wallet Address</div>
                    <div>{smartWalletAddress}</div>
                </div>

                <div>
                    <div>Is Your Smart Wallet deployed? </div>
                    <div>{isDeployed}</div>
                </div>

                <div>
                    <div>Owner Address </div>
                    <div>{ownerAddress}</div>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;