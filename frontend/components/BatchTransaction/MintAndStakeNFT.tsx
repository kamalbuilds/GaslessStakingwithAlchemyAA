// @ts-nocheck
'use client'
import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';
import React, { useContext, useEffect, useState } from 'react';
import ShowNFT from './ShowNFT';
import LoaderSpinner from '../Loader/LoaderSpinner';
import AddressLabel from '../AddressLabel/AddressLabel';
import { Hash } from 'viem';

const MintAndStakeNFT = () => {

    const { web3auth, smartWalletAddress, provider } = useContext(AccountAbstractionContext);

    const [ownedNFTs, setOwnedNFTs] = useState();
    const [loadingNFTs, setLoadingNFTs] = useState(false);
    const [mintTxHash, setMintTxHash] = useState<Hash>();

    const fetchNFTs = async () => {
        setLoadingNFTs(true);
        try {
            // @ts-ignore
            const nfts = await provider.nft.getNftsForOwner(smartWalletAddress);
            const { ownedNfts } = nfts;
            setOwnedNFTs(ownedNfts);
            setLoadingNFTs(false);
        } catch (error) {
            console.log("Error", error);
            setLoadingNFTs(false);
        }

    }

    useEffect(() => {
        if (provider) {
            fetchNFTs();
        }
    }, [provider])

    console.log("ownedNFTs", ownedNFTs)

    return (
        <div>

            <div className='text-[32px]'>Stake Your PokeMon NFT</div>

            <div className='font-light text-[18px] text-gray-400'>Stake the NFTs that you have minted and Earn rewards based on the time</div>

            <div className='flex flex-col mt-4'>
                <div className='font-[600] text-[24px] text-gray-700'>How does it work?</div>
                <div className='font-light text-[20px] text-gray-400'>After Clicking on Stake button, it creates a batch transaction that does approval of your NFT and then it stakes on the Staking Contract</div>
            </div>

            {mintTxHash && <div className='flex flex-col mt-4'>
                <div className='text-[24px]'>Recent Transactions</div>
                <div className="px-4 py-2 border border-gray-400 rounded-lg">
                    <AddressLabel address={mintTxHash} showFullAddress isTransactionAddress showBlockExplorerLink />
                </div>
            </div>}

            <div className='min-w-[300px] min-h-[300px] overflow-scroll	px-[20px] pl-0 mt-[20px]'>
                {loadingNFTs ? (
                    <div className='min-h-[350px] flex items-center justify-center'>
                        <LoaderSpinner loading={true} />
                    </div>
                ) : (
                    <div>

                        {(ownedNFTs?.length > 0) ? (
                            <div className='flex flex-row gap-4 overflow-scroll py-[20px]'>
                                {ownedNFTs && ownedNFTs.map((nft) => {
                                    return (
                                        <>
                                            <ShowNFT
                                                nft={nft}
                                                setMintTxHash={setMintTxHash}
                                                fetchNFTs={fetchNFTs}
                                            />
                                        </>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className='font-[500] text-[20px] text-red-600'>
                                You do not own any NFTs. Mint Now
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
};

export default MintAndStakeNFT;