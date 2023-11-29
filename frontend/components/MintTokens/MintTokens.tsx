'use client'
import { gasManagerPolicyId } from '@/config/client';
import { AlchemyTokenAbi, tokenContractAddress } from '@/constants/tokenContract';
import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';
import React, { useCallback, useContext, useState } from 'react';
import { Hash, encodeFunctionData } from 'viem';
import { toast } from "react-toastify";

type MintStatus =
    | "Mint"
    | "Requesting"
    | "Minting"
    | "Received"
    | "Error Minting";

const MintTokens = () => {

    const [mintTxHash, setMintTxHash] = useState<Hash>();
    const [mintStatus, setMintStatus] = useState<MintStatus>("Mint");

    const { provider } = useContext(AccountAbstractionContext);

    const getAddress = async () => {
        console.log("Address", provider)
        const res = await provider.getAddress();
        console.log("res of address", res)

    }

    const handleMint = useCallback(async () => {
        if (!provider) {
            throw new Error("Provider not initialized");
        }
        setMintTxHash(undefined);
        setMintStatus("Requesting");
        const uoHash = await provider.sendUserOperation({
            target: tokenContractAddress, //ERC 20 token
            data: encodeFunctionData({
                abi: AlchemyTokenAbi,
                functionName: "mint",
                args: [await provider.getAddress()],
            }),
        });

        console.log("Uo HAsh", uoHash);
        toast.update("minting going on")
        setMintStatus("Minting");

        let txHash: Hash;
        try {
            txHash = await provider.waitForUserOperationTransaction(uoHash.hash);
            toast.success("Minted token successfully ✨")
            console.log("Tx hash", txHash);
        } catch (e) {
            console.log("Error in minting", e);
            setMintStatus("Error Minting");
            // setTimeout(() => {
            //     setMintStatus("Mint");
            // }, 5000);
            return;
        }

        setMintTxHash(txHash);
        setMintStatus("Received");
        setTimeout(() => {
            setMintStatus("Mint");
        }, 5000);
    }, [provider, setMintTxHash]);

    const handleGaslessMint = useCallback(async () => {
        if (!provider) {
            throw new Error("Provider not initialized");
        }
        setMintTxHash(undefined);
        setMintStatus("Requesting");

        provider.withAlchemyGasManager({
            policyId: gasManagerPolicyId, // replace with your policy id, get yours at https://dashboard.alchemy.com/
        });

        const uoHash = await provider.sendUserOperation({
            target: tokenContractAddress, //ERC 20 token
            data: encodeFunctionData({
                abi: AlchemyTokenAbi,
                functionName: "mint",
                args: [await provider.getAddress()],
            }),
        });

        console.log("Uo HAsh", uoHash);

        setMintStatus("Minting");

        const elligibility = await provider.checkGasSponsorshipEligibility({
            target: tokenContractAddress,
            data: encodeFunctionData({
                abi: AlchemyTokenAbi,
                functionName: "mint",
                args: [await provider.getAddress()],
            }),
        });

        console.log("elligibility", elligibility)



        let txHash: Hash;
        try {
            txHash = await provider.waitForUserOperationTransaction(uoHash.hash);
            console.log("Tx hash", txHash);
        } catch (e) {
            console.log("Error in minting", e);
            setMintStatus("Error Minting");
            // setTimeout(() => {
            //     setMintStatus("Mint");
            // }, 5000);
            return;
        }

        setMintTxHash(txHash);
        setMintStatus("Received");
        setTimeout(() => {
            setMintStatus("Mint");
        }, 5000);
    }, [provider, setMintTxHash]);

    return (
        <div>
            <button onClick={handleMint} className='border border-gray-400 px-4 py-2'>Mint ERC 20 Token</button>
            <button onClick={handleGaslessMint} className='border border-gray-400 px-4 py-2'>Mint GasLess Token</button>
            <button onClick={getAddress} className='border border-gray-400 px-4 py-2'>Get Address</button>
        </div>
    );
};

export default MintTokens;