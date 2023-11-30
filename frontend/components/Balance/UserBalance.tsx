'use client'
import { LightAccountABI } from '@/constants/LightAccount';
import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';
import { ethers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';

const UserBalance = () => {

    const { provider, web3auth, smartWalletAddress } = useContext(AccountAbstractionContext);

    const [tokenBalance, setTokenBalance] = useState<number>();

    useEffect(() => {
        if (provider && web3auth) {
            const fetchNFTs = async () => {
                try {
                    // @ts-ignore
                    const res = await provider.core.getBalance(smartWalletAddress);
                    const response = parseFloat(ethers.utils.formatEther(res))
                    console.log("Response", response)
                    setTokenBalance(response);
                } catch (error) {
                    console.log("Error", error)
                }

            }

            fetchNFTs();
        }
    }, [provider])

    const fetchBalance = async () => {
        if (web3auth) {
            const LightAccountSCAddress = smartWalletAddress;

            const web3Provider = new ethers.providers.Web3Provider(
                // @ts-ignore
                web3auth.provider,
                "any"
            );

            const contract = new ethers.Contract(
                LightAccountSCAddress,
                LightAccountABI,
                web3Provider,
            )

            console.log("COntract", contract);

            try {
                const res = await contract.getDeposit();
                console.log("Deposit", res, Number(res));
            } catch (error) {
                console.log("Error", error);
            }

        }
    }

    return (
        <div>

            <div className='text-[32px]'> User Balance</div>

            <button onClick={fetchBalance} className=" px-[21px] my-4 py-[7px] bg-blue-700 text-white rounded-lg">Get Wallet Deposit</button>

            {tokenBalance ? <div className='flex flex-row gap-8 items-center '>
                <div className="px-4 py-2 border border-gray-400 rounded-lg"> Balance </div>
                <div>{tokenBalance?.toFixed(4)} gETH</div>
            </div> : (
                <div className='flex flex-col'>
                    <div className='text-[24px] mt-[24px]'>You need to log In before accessing features.</div>
                    <div className='text-[16px] my-4 font-light text-gray-500'>Create a Smart Account Wallet by Connecting your wallet or Social Logins</div>
                </div>
            )}

        </div>
    );
};

export default UserBalance;