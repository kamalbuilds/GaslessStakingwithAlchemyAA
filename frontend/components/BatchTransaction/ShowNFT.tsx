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
        <div className='min-w-[350px] border gap-8 border-gray-400 rounded-md flex flex-col justify-between pb-[20px]'>
            <div className='flex flex-row items-center justify-center'>
                <Image className='border min-w-[350px] h-[300px] border-gray-400 rounded-md' src={nft?.image.originalUrl} alt='POkeMon NFT' width={100} height={100} />
            </div>

            <div className='mx-[10px] flex flex-col gap-4'>
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
                <button onClick={() => sendBatch(nft.tokenId)}
                    className='border min-w-[200px] border-gray-400 bg-blue-800 text-white hover:text-white hover:bg-blue-600 rounded-lg px-4 py-2 '>
                    Stake NFT
                </button>
            </div>
        </div>
    );
};

export default ShowNFT;