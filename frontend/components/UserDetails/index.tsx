// @ts-nocheck
"use client";
import React, { useContext, useEffect, useState } from 'react';
import LoaderSpinner from '../Loader/LoaderSpinner';
import AddressLabel from '../AddressLabel/AddressLabel';
import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';


const UserDetails = () => {

    const { provider, smartWalletAddress } = useContext(AccountAbstractionContext);

    const [isDeployed, setIsDeployed] = useState();
    const [ownerAddress, setOwnerAddress] = useState();

    useEffect(() => {
        if (provider) {
            const getState = async () => {
                if (provider.account) {
                    // @ts-ignore
                    const deploymentState = await provider.account.getDeploymentState();
                    // @ts-ignore
                    const isAccountDeployed = await provider.account.isAccountDeployed();
                    setIsDeployed(isAccountDeployed);
                    // @ts-ignore
                    const owner = await provider.account.getOwnerAddress();
                    setOwnerAddress(owner);
                }
            }

            getState();
        }

    }, [provider, provider.account])


    return (
        <div className='flex flex-col gap-8'>


            <div className='text-[40px]'>Welcome to {" "}
                <span className='text-blue-600 hover:underline underline-offset-4 cursor-pointer pb-2'>GasLess Staking </span>
                Universe</div>


            <div className='flex flex-col items-center justify-center min-h-[400px]'>
                {provider ? (
                    <>
                        <div className='text-[32px]'>User Details</div>
                        {smartWalletAddress ? <div className='flex flex-col gap-4 mt-12'>
                            <div className='flex flex-row gap-4 items-center justify-between'>
                                <div className='text-[20px]'>Smart Wallet Address</div>
                                <div className="px-4 py-2 border border-gray-400 rounded-lg">
                                    <AddressLabel address={smartWalletAddress} showBlockExplorerLink />
                                </div>
                            </div>

                            <div className='flex flex-row gap-4 items-center justify-between'>
                                <div className='text-[20px]'>Is Your Smart Wallet deployed? </div>
                                {isDeployed ? (
                                    <div className='px-[8px] rounded-md py-[4px] bg-green-600 text-white'>True</div>
                                ) : (
                                    <div className='px-[8px] rounded-md py-[4px] bg-red-600 text-white'>False</div>
                                )}

                            </div>

                            {ownerAddress && <div className='flex flex-row gap-4 items-center justify-between'>

                                <div className='text-[20px]'>Owner Address </div>
                                <div className="px-4 py-2 border border-gray-400 rounded-lg">
                                    <AddressLabel address={ownerAddress} showBlockExplorerLink />
                                </div>
                            </div>}
                        </div> : (
                            <div className='flex flex-col'>
                                <div className='text-[24px] mt-[24px]'>You need to log In before accessing features.</div>
                                <div className='text-[16px] my-4 font-light text-gray-500'>Create a Smart Account Wallet by Connecting your wallet or Social Logins</div>
                            </div>
                        )}
                    </>
                ) : (
                    <LoaderSpinner />
                )}
            </div>

        </div>
    );
};

export default UserDetails;