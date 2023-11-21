'use client'
import { NFTABI, NFTContract } from '@/constants/PokemonNFT';
import { StakingNFT, StakeNFTABI } from '@/constants/StakingNFT';
import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';
import { ethers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';
import ShowNFT from './ShowNFT';
import { Hash, encodeFunctionData } from 'viem';

const MintAndStakeNFT = () => {

    const { web3auth, smartWalletAddress, provider } = useContext(AccountAbstractionContext);

    const [ownedNFTs, setOwnedNFTs] = useState();

    console.log("Provider in Mint and Stake NFT", provider, web3auth)

    useEffect(() => {
        if (provider) {
            const fetchNFTs = async () => {
                console.log("Provider", provider)
                const nfts = await provider.nft.getNftsForOwner(smartWalletAddress);
                const { ownedNfts } = nfts;
                setOwnedNFTs(ownedNfts);
                console.log("NFTS", nfts);
            }

            fetchNFTs();
        }
    }, [provider])

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
            }
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

        const approveCallData = await approveNFT(tokenId);
        const stakeCallData = await stakeNFT(tokenId);

        console.log("Input Data", approveCallData, stakeCallData);

        const uoHash = await provider.sendUserOperation([
            approveCallData, stakeCallData,
        ]);

        console.log("uoHash", uoHash)

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

    const claimRewards = async () => {

        const stakeCallData = encodeFunctionData({
            abi: StakeNFTABI,
            functionName: "claimRewards",
            args: [],
        });

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
        <div>
            Mint and Stake Polygon NFT

            <button onClick={() => claimRewards()} className='border border-gray-400 px-4 py-2 '>Claim Rewards</button>

            <div className='flex flex-row flex-wrap gap-4 mt-8'>
                {ownedNFTs && ownedNFTs.map((nft) => {
                    return (
                        <ShowNFT
                            nft={nft}
                            approve={approveNFT}
                            stake={stakeNFT}
                            sendBatch={sendBatch}
                        />
                    )
                })}

            </div>
        </div>
    );
};

export default MintAndStakeNFT;