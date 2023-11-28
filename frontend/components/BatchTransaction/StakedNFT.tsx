'use client'
import { NFTABI, NFTContract } from '@/constants/PokemonNFT';
import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';
import { ethers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';

const StakedNFT = ({
    nftTokenId
}: any) => {
    console.log("nftTokenId", nftTokenId)
    const { provider, web3auth } = useContext(AccountAbstractionContext);

    const [stakedToken, setStakedToken] = useState();

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

                const res = await contract.tokenURI(nftTokenId);
                setStakedToken(res);
                console.log("Token NFT data based on token ID", res);
            }
            getNFTTokenData();
        }

    }, [provider, nftTokenId])


    return (
        <div>
            {stakedToken}
        </div>
    );
};

export default StakedNFT;