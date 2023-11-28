'use client'
import { StakeNFTABI, StakingNFT } from '@/constants/StakingNFT';
import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';
import { useStakingContract } from '@/hooks/useContract';
import { ethers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';
import StakedNFT from './StakedNFT';

const ShowStakedNFT = () => {

    const { web3auth, smartWalletAddress, provider } = useContext(AccountAbstractionContext);

    const [ownedNFTs, setOwnedNFTs] = useState();

    const { getStakingInfo } = useStakingContract({ web3auth });
    const [stakedNFTTokenIds, showStakedNFTTokenIds] = useState();

    useEffect(() => {

        if (provider) {
            const getStakersData = async () => {
                console.log("staking", getStakingInfo, smartWalletAddress)
                const res = await getStakingInfo(smartWalletAddress);
                const { rewardNumber, nftTokenIds } = res;
                showStakedNFTTokenIds(nftTokenIds);
                console.log("res in show staked nft", res);
            }
            getStakersData();
        }

    }, [provider])

    return (
        <>
            {stakedNFTTokenIds &&
                <>
                    <div>NFTs Staked</div>

                    {stakedNFTTokenIds && stakedNFTTokenIds.map((stakedNFTTokenId) => {
                        return (
                            <div key={stakedNFTTokenId}>
                                <StakedNFT nftTokenId={stakedNFTTokenId} />
                            </div>
                        )
                    })}</>
            }
        </>
    );
};

export default ShowStakedNFT;