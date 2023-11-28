'use client'
import { LightAccountABI } from '@/constants/LightAccount';
import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';
import { ethers } from 'ethers';
import React, { useContext, useEffect } from 'react';

const UserBalance = () => {

    const { provider, web3auth, smartWalletAddress } = useContext(AccountAbstractionContext);

    console.log("Provider in user balance", provider);

    useEffect(() => {
        if (provider) {
            const fetchNFTs = async () => {
                console.log("Provider", provider)
                const res = await provider.core.getBalance(smartWalletAddress);
                console.log("Token Balance", res, Number(res));
            }

            fetchNFTs();
        }
    }, [provider])

    const fetchBalance = async () => {
        if (web3auth) {
            const LightAccountSCAddress = smartWalletAddress;
            const web3Provider = new ethers.providers.Web3Provider(
                web3auth.provider,
                "any"
            );

            const contract = new ethers.Contract(
                LightAccountSCAddress,
                LightAccountABI,
                web3Provider,
            )

            console.log("COntract", contract);

            const res = await contract.getDeposit();
            console.log("Deposit", res, Number(res));

        }
    }

    return (
        <div>

            <div className='text-[32px]'> User Balance</div>

            <button onClick={fetchBalance}>Get Deposit</button>

        </div>
    );
};

export default UserBalance;