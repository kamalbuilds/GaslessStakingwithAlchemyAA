import Image from 'next/image';
import React from 'react';

const ShowNFT = ({
    nft,
    approve,
    stake,
    sendBatch,
}: any) => {

    console.log("PokeMon NFTS", nft);

    return (
        <div className='w-[300px] h-[400px] border gap-8 border-gray-400 rounded-md flex flex-col justify-between '>
            <div className='flex flex-row items-center justify-center'>
                <Image className='w-auto' src={nft?.image.originalUrl} alt='POkeMon NFT' width={100} height={100} />
            </div>
            <div className='flex flex-row gap-4 justify-center'>
                <button onClick={() => approve(nft.tokenId)} className='border border-gray-400 px-4 py-2 '>Approve</button>
                <button onClick={() => stake(nft.tokenId)} className='border border-gray-400 px-4 py-2 '>Stake</button>

            </div>
            <div className='flex flex-row gap-4 justify-center'>
                <button onClick={() => sendBatch(nft.tokenId)} className='border border-gray-400 px-4 py-2 '>Send Batch</button>
            </div>
        </div>
    );
};

export default ShowNFT;