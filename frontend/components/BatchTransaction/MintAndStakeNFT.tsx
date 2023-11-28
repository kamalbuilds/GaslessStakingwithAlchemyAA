'use client'
import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';
import React, { useContext, useEffect, useState } from 'react';
import ShowNFT from './ShowNFT';
import ShowStakedNFT from './ShowStakedNFT';
import LoaderSpinner from '../Loader/LoaderSpinner';
import { useStakingContract } from '@/hooks/useContract';
import StakedNFT from './StakedNFT';

const MintAndStakeNFT = () => {

    const { web3auth, smartWalletAddress, provider } = useContext(AccountAbstractionContext);

    const [ownedNFTs, setOwnedNFTs] = useState();
    const [loadingNFTs, setLoadingNFTs] = useState(false);

    const { getStakingInfo } = useStakingContract({ web3auth });
    // const [stakedNFTTokenIds, showStakedNFTTokenIds] = useState();

    console.log("Provider in Mint and Stake NFT", provider, web3auth)

    let fetchNFTs: () => void;

    useEffect(() => {
        if (provider) {
            fetchNFTs = async () => {
                setLoadingNFTs(true);
                const nfts = await provider.nft.getNftsForOwner(smartWalletAddress);
                const { ownedNfts } = nfts;
                setOwnedNFTs(ownedNfts);
                setLoadingNFTs(false);
            }

            fetchNFTs();
        }
    }, [provider])

    return (
        <div>

            <div className='text-[32px]'>Stake Your PokeMon NFT</div>

            <div className='font-light text-[18px] text-gray-400'>Stake the NFTs that you have minted and Earn rewards based on the time</div>

            <div className='min-w-[300px] min-h-[300px] overflow-scroll	px-[20px]'>
                {loadingNFTs ? (
                    <div className='min-h-[350px] flex items-center justify-center'>
                        <LoaderSpinner loading={true} />
                    </div>
                ) : (
                    <>
                        {ownedNFTs && (
                            <div className='flex flex-row gap-4 overflow-scroll py-[20px]'>
                                {ownedNFTs && ownedNFTs.map((nft) => {
                                    return (
                                        <>
                                            <ShowNFT
                                                nft={nft}
                                            />
                                        </>
                                    )
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* <ShowStakedNFT /> */}

            {/* {stakedNFTTokenIds &&
                <>
                    <div>NFTs Staked</div>

                    {stakedNFTTokenIds && stakedNFTTokenIds.map((stakedNFTTokenId) => {
                        return (
                            <div key={stakedNFTTokenId}>
                                <StakedNFT nftTokenId={stakedNFTTokenId} />
                            </div>
                        )
                    })}</>
            } */}
        </div>
    );
};

export default MintAndStakeNFT;