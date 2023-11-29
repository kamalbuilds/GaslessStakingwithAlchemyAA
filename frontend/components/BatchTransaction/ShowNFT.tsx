import Image from 'next/image';
import { NFTABI, NFTContract } from '@/constants/PokemonNFT';
import { StakingNFT, StakeNFTABI } from '@/constants/StakingNFT';
import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';
import React, { useContext, useState } from 'react';
import { Hash, encodeFunctionData } from 'viem';
import { toast } from "react-toastify";

type MintStatus =
    | "Stake"
    | "Approving"
    | "Staking"
    | "Staked"
    | "Error Staking";

const ShowNFT = ({
    nft,
}: any) => {

    const { web3auth, smartWalletAddress, provider } = useContext(AccountAbstractionContext);

    const [mintTxHash, setMintTxHash] = useState<Hash>();
    const [mintStatus, setMintStatus] = useState<MintStatus>("Stake");


    const approveNFT = async (tokenId: any) => {
        if (web3auth?.provider == null) {
            throw new Error("web3auth provider is available");
        }

        console.log("Approving NFT", tokenId, web3auth);

        if (web3auth) {
            const callData = encodeFunctionData({
                abi: NFTABI,
                functionName: "approve",
                args: [StakingNFT, tokenId],
            });

            console.log("UO CAll data", callData);
            // return callData;
            const approveTxData = {
                target: NFTContract,
                data: callData
            };

            toast.success("Approving NFT");
            console.log("approveTxData data", approveTxData);


            return approveTxData;
        }
    }

    const stakeNFT = async (tokenId: any) => {
        console.log("TokenId", tokenId, typeof (tokenId));

        const tokenIds = [tokenId]

        const stakeCallData = encodeFunctionData({
            abi: StakeNFTABI,
            functionName: "stake",
            args: [tokenIds],
        });

        console.log("stake Call Data", stakeCallData);
        // return stakeCallData;

        const stakeTxData = {
            target: StakingNFT,
            data: stakeCallData
        };

        console.log("stakeTxData Data", stakeTxData);
        return stakeTxData;


    }

    const sendBatch = async (tokenId: any) => {

        if (!provider) {
            throw new Error("Provider not initialized");
        }

        setMintTxHash(undefined);
        setMintStatus("Approving");
        const approveCallData = await approveNFT(tokenId);
        const stakeCallData = await stakeNFT(tokenId);

        console.log("Input Data", approveCallData, stakeCallData);

        const uoHash = await provider.sendUserOperation([
            approveCallData, stakeCallData,
        ]);

        console.log("uoHash", uoHash)
        toast.update("minting going on");
        setMintStatus("Staking");
        let txHash: Hash;
        try {
            txHash = await provider.waitForUserOperationTransaction(uoHash.hash);
            toast.success("NFT Staked successfully ✅");
            console.log("Tx hash", txHash);
        } catch (e) {
            setMintStatus("Error Staking");
            console.log("Error in minting", e);
            setTimeout(() => {
                setMintStatus("Stake");
            }, 5000);
            return;
        }

        setMintTxHash(txHash);
        setMintStatus("Staked");
        setTimeout(() => {
            setMintStatus("Stake");
        }, 5000);

    }

    return (
        <div className='min-w-[325px] border gap-8 border-gray-400 rounded-md flex flex-col justify-between pb-[20px]'>
            <div className='flex flex-row items-center justify-center'>
                <Image className=' min-w-[325px] h-[300px]' src={nft?.image.originalUrl} alt='POkeMon NFT' width={100} height={100} />
            </div>

            <div className='mx-[10px] flex flex-col gap-[10px]'>
                <div className='flex flex-row justify-between'>
                    <div className='text-[20px] text-gray-600'>Name</div>
                    <div className='text-[18px] text-gray-400 font-light text-end'>{nft.name}</div>
                </div>
                <div className='flex flex-row justify-between'>
                    <div className='text-[20px] text-gray-600'>Token Type</div>
                    <div className='text-[18px] text-gray-400 font-light text-end'>{nft.tokenType}</div>
                </div>
                <div className='flex flex-row justify-between'>
                    <div className='text-[20px] text-gray-600'>Token ID</div>
                    <div className='text-[18px] text-gray-400 font-light text-end'>{nft.tokenId}</div>
                </div>
            </div>


            <div className='flex flex-row gap-4 justify-center mt-[20px]'>

                <button
                    disabled={mintStatus !== "Stake"}
                    onClick={() => sendBatch(nft.tokenId)}
                    className="btn text-white bg-gradient-1 disabled:opacity-25 disabled:text-white transition ease-in-out duration-500 transform hover:scale-110 max-md:w-full border min-w-[200px] border-gray-400 bg-blue-600 hover:text-white hover:bg-blue-800 rounded-lg px-4 py-2 "

                >
                    {mintStatus} {" "}{nft.name} NFT
                    {(mintStatus === "Approving" || mintStatus === "Staking") && (
                        <span className="loading loading-spinner loading-md"></span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ShowNFT;