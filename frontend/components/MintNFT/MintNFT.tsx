import { NFTABI, NFTContract } from '@/constants/PokemonNFT';
import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';
import React, { useContext } from 'react';
import { Hash } from 'viem';
import { ethers } from 'ethers';

const MintNFT = () => {

    const { web3auth, smartWalletAddress, provider } = useContext(AccountAbstractionContext);

    const mintNFT = async () => {

        if (web3auth?.provider == null) {
            throw new Error("web3auth provider is available");
        }
        if (smartWalletAddress) {
            const receiver = smartWalletAddress;
            const quantity = 1;
            const currency = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
            const pricePerToken = 0;
            const allowProof = {
                "proof": [],
                "quantityLimitPerWallet": "0",
                "pricePerToken": "0",
                "currency": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
            }
            const data: never[] = [];

            const web3Provider = new ethers.providers.Web3Provider(
                web3auth.provider,
                "any"
            );

            const contract = new ethers.Contract(
                NFTContract,
                NFTABI,
                web3Provider,
            )

            const minTx = await contract.populateTransaction['claim'](
                receiver,
                quantity,
                currency,
                pricePerToken,
                allowProof,
                data
            )

            console.log("minTx", minTx.data);

            const uoHash = await provider.sendUserOperation({
                target: NFTContract, //ERC 20 token
                data: minTx.data,
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


    }


    const getNFTs = async () => {
        console.log("Provider", provider)
        const nfts = await provider.nft.getNftsForOwner(smartWalletAddress);

        console.log("NFTS", nfts);

    }

    return (
        <div>
            Mint PokeMon NFT

            <button onClick={mintNFT} className='border border-gray-400 px-4 py-2 m-4'>Mint NFT</button>
            <button onClick={getNFTs} className='border border-gray-400 px-4 py-2 m-4'>Show NFTs</button>
        </div>
    );
};

export default MintNFT;