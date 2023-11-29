'use client'
import { NFTABI, NFTContract } from '@/constants/PokemonNFT';
import { StakeNFTABI, StakingNFT } from '@/constants/StakingNFT';
import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';
import { ethers } from 'ethers';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Hash, encodeFunctionData } from 'viem';
import LoaderSpinner from '../Loader/LoaderSpinner';

const StakedNFT = ({
    getStakersData,
    nftTokenId
}: any) => {
    const { provider, web3auth } = useContext(AccountAbstractionContext);

    const [stakedToken, setStakedToken] = useState();
    const [stakedNFT, setStakedNFT] = useState();
    const [nftImage, setNFTImage] = useState();

    const [mintTxHash, setMintTxHash] = useState<Hash>();
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    useEffect(() => {

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

        if (web3auth?.provider == null) {
            throw new Error("web3auth provider is available");
        }

        if (provider) {
            try {
                setIsWithdrawing(true);
                setMintTxHash(undefined);
                const stakeCallData = encodeFunctionData({
                    abi: StakeNFTABI,
                    functionName: "withdraw",
                    args: [[tokenId]],
                });

                const providerWithSimulation = provider.withAlchemyUserOpSimulation();

                const uoHash = await providerWithSimulation.sendUserOperation({
                    target: StakingNFT, //ERC 20 token
                    data: stakeCallData,
                });

                let txHash: Hash;
                txHash = await providerWithSimulation.waitForUserOperationTransaction(uoHash.hash);
                if (txHash) {
                    toast.success("Toast Withdrawn successfully ✅");
                    setMintTxHash(txHash);
                    setIsWithdrawing(false);
                    getStakersData();
                }

            } catch (error) {
                console.log("Error in minting", error);
                setIsWithdrawing(false);
                toast.error("Error in minting");
                return;
            }
        }

    }

    return (
        <div className='min-h-[500px] flex flex-row items-center flex-wrap gap-8 '>
            {stakedNFT && nftImage && <div className='h-[inherit] flex flex-col border border-gray-400 rounded-md py-2 gap-2'>
                <div className='text-[24px] text-gray-400 font-[400] text-end mr-2'>{stakedNFT.name}</div>

                <Image className='max-h-[350px] min-h-[350px] border min-w-[350px]'
                    src={nftImage}
                    alt='PokeMon NFT'
                    width={100}
                    height={100}
                />
                <div className='flex flex-row items-center justify-center my-4'>
                    <button
                        disabled={isWithdrawing}
                        onClick={() => withdrawNFT(nftTokenId)}
                        className='rounded-md flex flex-row items-center justify-center min-w-[250px] bg-blue-700 text-white hover:bg-blue-900 px-4 py-2 '
                    >
                        {isWithdrawing ? (
                            <LoaderSpinner color={"#FFF"} size={25} loading={true} />
                        ) : 'Withdraw NFT'}
                    </button>
                </div>
            </div>}
        </div>
    );
};

export default StakedNFT;