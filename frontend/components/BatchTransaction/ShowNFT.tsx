import Image from 'next/image';
import { NFTABI, NFTContract } from '@/constants/PokemonNFT';
import { StakingNFT, StakeNFTABI } from '@/constants/StakingNFT';
import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';
import React, { useContext, useState } from 'react';
import { Hash, encodeFunctionData } from 'viem';
import { toast } from "react-toastify";
import LoaderSpinner from '../Loader/LoaderSpinner';

type MintStatus =
    | "Stake"
    | "Approving"
    | "Staking"
    | "Staked"
    | "Error Staking";

const ShowNFT = ({
    nft,
    setMintTxHash
}: any) => {

    const { web3auth, smartWalletAddress, provider } = useContext(AccountAbstractionContext);
    const [isStaking, setIsStaking] = useState(false);

    const approveNFT = async (tokenId: any) => {
        if (web3auth?.provider == null) {
            throw new Error("web3auth provider is available");
        }

        if (web3auth) {
            const callData = encodeFunctionData({
                abi: NFTABI,
                functionName: "approve",
                args: [StakingNFT, tokenId],
            });
            const approveTxData = {
                target: NFTContract,
                data: callData
            };
            console.log("approveTxData data", approveTxData);
            return approveTxData;
        }
    }

    const stakeNFT = async (tokenId: any) => {
        const tokenIds = [tokenId]
        const stakeCallData = encodeFunctionData({
            abi: StakeNFTABI,
            functionName: "stake",
            args: [tokenIds],
        });
        const stakeTxData = {
            target: StakingNFT,
            data: stakeCallData
        };
        console.log("stakeTxData Data", stakeTxData);
        return stakeTxData;
    }

    const handleStakeBatch = async (tokenId: any) => {

        if (!provider) {
            throw new Error("Provider not initialized");
        }

        setMintTxHash(undefined);
        setIsStaking(true);
        const approveCallData = await approveNFT(tokenId);
        const stakeCallData = await stakeNFT(tokenId);

        const uoHash = await provider.sendUserOperation([
            // @ts-ignore
            approveCallData, stakeCallData,
        ]);

        toast.update("minting going on");
        let txHash: Hash;
        try {
            txHash = await provider.waitForUserOperationTransaction(uoHash.hash);
            toast.success("NFT Staked successfully ✅");
            setIsStaking(false);
        } catch (e) {
            console.log("Error in minting", e);
            setIsStaking(false);
            return;
        }

        setMintTxHash(txHash);

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
                    disabled={isStaking}
                    onClick={() => handleStakeBatch(nft.tokenId)}
                    className='rounded-md flex flex-row items-center justify-center min-w-[250px] bg-blue-700 text-white hover:bg-blue-900 px-4 py-2 '
                >
                    {!isStaking && `Stake ${nft.name} NFT`}
                    {isStaking && (
                        <LoaderSpinner color={"#FFF"} size={25} loading={true} />
                    )}
                </button>
            </div>
        </div>
    );
};

export default ShowNFT;