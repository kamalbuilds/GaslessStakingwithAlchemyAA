// @ts-nocheck
import { NFTABI, NFTContract } from '@/constants/PokemonNFT';
import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';
import React, { useContext, useEffect, useState } from 'react';
import { Hash, encodeFunctionData } from 'viem';
import { ethers } from 'ethers';
import Image from 'next/image';
import LoaderSpinner from '../Loader/LoaderSpinner';
import { toast } from 'react-toastify';
import AddressLabel from '../AddressLabel/AddressLabel';

type MintStatus =
    | "Mint"
    | "Minting"
    | "Error Minting";

const MintNFT = () => {

    const { web3auth, smartWalletAddress, provider } = useContext(AccountAbstractionContext);

    const [ownedNFTs, setOwnedNFTs] = useState();
    const [loadingNFTs, setLoadingNFTs] = useState(false);

    const [mintTxHash, setMintTxHash] = useState<Hash>();
    const [mintStatus, setMintStatus] = useState<MintStatus>("Mint");
    const [isLoading, setIsLoading] = useState(false);

    const encodeTransactionData = async () => {
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

        console.log("Contract", contract, web3Provider)

        const minTx = await contract.populateTransaction['claim'](
            receiver,
            quantity,
            currency,
            pricePerToken,
            allowProof,
            data
        )
        console.log("minTx", minTx.data, provider);

        return minTx.data;
    }

    const mintNFT = async () => {

        if (web3auth?.provider == null) {
            throw new Error("web3auth provider is available");
        }
        if (smartWalletAddress) {
            setMintTxHash(undefined);
            setIsLoading(true);
            const data = await encodeTransactionData();
            setMintStatus("Minting");

            try {
                const uoHash = await provider.sendUserOperation({
                    target: NFTContract,
                    data: data,
                });
                console.log("Uo HAsh", uoHash);
                let txHash: Hash;
                txHash = await provider.waitForUserOperationTransaction(uoHash.hash);
                console.log("Tx hash", txHash);
                toast.success("NFT Minted successfully ✅");
                setIsLoading(false);
                setMintTxHash(txHash);
                if (txHash) {
                    getNFTs();
                }

            } catch (e) {
                setIsLoading(false);
                console.log("Error in minting", e);
                setMintStatus("Mint");
                toast.error("Error in minting", e);
                return;
            }

            setMintStatus("Minted");
            setTimeout(() => {
                setMintStatus("Mint");
            }, 5000);

        }


    }

    const getNFTs = async () => {
        try {
            setLoadingNFTs(true);
            const nfts = await provider.nft.getNftsForOwner(smartWalletAddress);
            console.log("Owned NFT", nfts, smartWalletAddress);
            const { ownedNfts } = nfts;
            console.log("Owned NFT", ownedNFTs);
            setOwnedNFTs(ownedNfts);
            setLoadingNFTs(false);
        } catch (error) {
            console.log("Error", error);
            setLoadingNFTs(false);
        }

    }

    useEffect(() => {
        console.log("Provider", provider)
        if (provider) {
            getNFTs();
        }
    }, [])

    const mintNFTGasless = async () => {

        if (web3auth?.provider == null) {
            throw new Error("web3auth provider is available");
        }
        if (smartWalletAddress) {

            const data = await encodeTransactionData();

            const GAS_MANAGER_POLICY_ID = "YourGasManagerPolicyId";

            provider.withAlchemyGasManager({
                policyId: GAS_MANAGER_POLICY_ID,
            });

            try {

                const uoHash = await provider.sendUserOperation({
                    target: NFTContract,
                    data: data,
                });

                console.log("Uo HAsh", uoHash);

                let txHash: Hash;

                txHash = await provider.waitForUserOperationTransaction(uoHash.hash);
                toast.success("NFT Minted Successfully 🚀");
                console.log("Tx hash", txHash);
            } catch (e) {
                toast.error("Error in minting");
                console.log("Error in minting", e);
                // setMintStatus("Error Minting");
                // setTimeout(() => {
                //     setMintStatus("Mint");
                // }, 5000);
                return;
            }
        }



    }

    return (
        <div>

            <div className='text-[32px]'>Mint PokeMon NFT</div>

            {mintTxHash && <div className='flex flex-row gap-4'>
                <div>Recent Transaction</div>
                <div>
                    <AddressLabel address={mintTxHash} isTransactionAddress />
                </div>
            </div>}

            <div className='flex flex-row gap-4 mt-8'>
                <button onClick={mintNFT}
                    disabled={mintStatus !== "Mint"}
                    className='rounded-md flex flex-row items-center justify-center min-w-[150px] bg-blue-700 text-white hover:bg-blue-900 px-4 py-2 '
                >
                    {(mintStatus === "Minting") ? (
                        <LoaderSpinner color={"#FFF"} size={20} loading={true} />
                    ) : `${mintStatus} NFT`}
                </button>
                <button onClick={mintNFTGasless}
                    className='rounded-md min-w-[150px] border border-blue-700 hover:bg-blue-700 hover:text-white px-4 py-2 '>
                    Mint NFT Gasless
                </button>
            </div>

            <div className='text-[24px] mt-[24px]'>Minted NFTs</div>
            <div className='text-[16px] my-4 font-light text-gray-500'>NFTs that you have minted and own</div>

            {loadingNFTs ? (
                <div className='flex flex-row items-center justify-center'>
                    <LoaderSpinner loading={true} />
                </div>
            ) : (
                <div className='flex flex-row items-center flex-wrap gap-8 '>
                    {ownedNFTs && ownedNFTs.map((nft) => {
                        return (
                            <div key={nft.tokenId}>
                                <Image className=' min-h-[250px] max-h-[250px] border min-w-[250px] border-gray-400 rounded-md' src={nft?.image.originalUrl} alt='POkeMon NFT' width={100} height={100} />
                                <div className='text-[20px] text-gray-400 font-light text-end	 '>{nft.name}</div>
                            </div>
                        )
                    })}

                    {!ownedNFTs && (
                        <div className='text-[20px] text-gray-400 font-light text-end'>No NFTs Minted</div>
                    )}
                </div>
            )}


        </div>
    );
};

export default MintNFT;