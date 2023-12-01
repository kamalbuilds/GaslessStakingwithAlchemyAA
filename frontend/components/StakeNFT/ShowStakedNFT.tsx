'use client'
import { StakeNFTABI, StakingNFT } from '@/constants/StakingNFT';
import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';
import { useStakingContract } from '@/hooks/useContract';
import { ethers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';
import StakedNFT from '../WithdrawNFT/StakedNFT';

const ShowStakedNFT = () => {

    const { web3auth, smartWalletAddress, provider } = useContext(AccountAbstractionContext);

    const [ownedNFTs, setOwnedNFTs] = useState();
    // @ts-ignore
    const { getStakingInfo } = useStakingContract({ web3auth });
    const [stakedNFTTokenIds, showStakedNFTTokenIds] = useState([]);

    useEffect(() => {

        if (provider) {
            const getStakersData = async () => {
                const res = await getStakingInfo(smartWalletAddress);
                const { rewardNumber, nftTokenIds } = res;
                showStakedNFTTokenIds(nftTokenIds);
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