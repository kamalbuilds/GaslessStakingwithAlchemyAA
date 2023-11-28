'use client'
import { NFTABI, NFTContract } from '@/constants/PokemonNFT';
import { StakeNFTABI, StakingNFT } from '@/constants/StakingNFT';
import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';
import { ethers } from 'ethers';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { Hash, encodeFunctionData } from 'viem';

const StakedNFT = ({
    nftTokenId
}: any) => {
    console.log("nftTokenId", nftTokenId)
    const { provider, web3auth } = useContext(AccountAbstractionContext);

    const [stakedToken, setStakedToken] = useState();
    const [stakedNFT, setStakedNFT] = useState();
    const [nftImage, setNFTImage] = useState();

    useEffect(() => {

        console.log("provider", provider)

        if (provider) {
            const getNFTTokenData = async () => {
                const web3Provider = new ethers.providers.Web3Provider(
                    web3auth.provider,
                    "any"
                );

                const contract = new ethers.Contract(
                    NFTContract,
                    NFTABI,
                    web3Provider,
                )

                try {
                    const tokenURI = await contract.tokenURI(nftTokenId);
                    setStakedToken(tokenURI);
                    const url = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
                    const response = await fetch(url);
                    const nftResponse = await response.json();
                    setStakedNFT(nftResponse);
                    const { image } = nftResponse;
                    const nftImage = image.replace("ipfs://", "https://ipfs.io/ipfs/");
                    setNFTImage(nftImage);
                } catch (error) {
                    console.log("Error", error);
                }

            }
            getNFTTokenData();
        }

    }, [provider, nftTokenId])

    const withdrawNFT = async (tokenId: any) => {

        const stakeCallData = encodeFunctionData({
            abi: StakeNFTABI,
            functionName: "withdraw",
            args: [[tokenId]],
        });

        console.log("Call Data", stakeCallData);

        const uoHash = await provider.sendUserOperation({
            target: StakingNFT, //ERC 20 token
            data: stakeCallData,
        });

        console.log("Uo HAsh", uoHash);

        // setMintStatus("Minting");
        let txHash: Hash;
        try {
            txHash = await provider.waitForUserOperationTransaction(uoHash.hash);
            console.log("Tx hash", txHash);
        } catch (e) {
            console.log("Error in minting", e);
            // setMintStatus("Error Minting");
            // setTimeout(() => {
            //     setMintStatus("Mint");
            // }, 5000);
            return;
        }

    }

    return (
        <div className='flex flex-row items-center flex-wrap gap-8 '>
            {stakedNFT && nftImage && <div className='border border-gray-400 rounded-md py-2'>
                <div className='text-[24px] text-gray-400 font-[400] text-end'>{stakedNFT.name}</div>

                <Image className=' min-h-[350px] border min-w-[350px] rounded-md'
                    src={nftImage}
                    alt='PokeMon NFT'
                    width={100}
                    height={100}
                />
                <div className='flex flex-col gap-4 px-4 py-4'>
                    <div className='flex flex-row items-center justify-center'>
                        <button
                            className='rounded-md border bg-blue-700 text-white hover:bg-blue-900 border-gray-400 px-4 py-2'
                            onClick={() => withdrawNFT(nftTokenId)}>
                            Withdraw NFT
                        </button>
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default StakedNFT;