import Image from 'next/image';
import { NFTABI, NFTContract } from '@/constants/PokemonNFT';
import { StakingNFT, StakeNFTABI } from '@/constants/StakingNFT';
import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';
import React, { useContext, useState } from 'react';
import { Hash, encodeFunctionData } from 'viem';
import { toast } from "react-toastify";
import LoaderSpinner from '../Loader/LoaderSpinner';

type MintStatus =
    | "Stake"
    | "Approving"
    | "Staking"
    | "Staked"
    | "Error Staking";

const ShowNFT = ({
    nft,
    setMintTxHash,
    fetchNFTs
}: any) => {

    const { web3auth, smartWalletAddress, provider } = useContext(AccountAbstractionContext);
    const [isStaking, setIsStaking] = useState(false);
    const [stakingGasless, setStakingGasless] = useState(false);

    const approveNFT = async (tokenId: any) => {
        if (web3auth?.provider == null) {
            throw new Error("web3auth provider is available");
        }

        if (web3auth) {
            const callData = encodeFunctionData({
                abi: NFTABI,
                functionName: "approve",
                args: [StakingNFT, tokenId],
            });
            const approveTxData = {
                target: NFTContract,
                data: callData
            };
            console.log("approveTxData data", approveTxData);
            return approveTxData;
        }
    }

    const stakeNFT = async (tokenId: any) => {
        const tokenIds = [tokenId]
        const stakeCallData = encodeFunctionData({
            abi: StakeNFTABI,
            functionName: "stake",
            args: [tokenIds],
        });
        const stakeTxData = {
            target: StakingNFT,
            data: stakeCallData
        };
        console.log("stakeTxData Data", stakeTxData);
        return stakeTxData;
    }

    const handleStakeBatch = async (tokenId: any) => {

        if (!provider) {
            throw new Error("Provider not initialized");
        }

        setMintTxHash(undefined);
        setIsStaking(true);
        const approveCallData = await approveNFT(tokenId);
        const stakeCallData = await stakeNFT(tokenId);

        const uoHash = await provider.sendUserOperation([
            // @ts-ignore
            approveCallData, stakeCallData,
        ]);

        toast.update("minting going on");
        let txHash: Hash;
        try {
            txHash = await provider.waitForUserOperationTransaction(uoHash.hash);
            toast.success("NFT Staked successfully ✅");
            setIsStaking(false);
            fetchNFTs();
        } catch (e) {
            console.log("Error in minting", e);
            setIsStaking(false);
            return;
        }

        setMintTxHash(txHash);

    }

    const stakeGasless = async (tokenId: any) => {

        if (!provider) {
            throw new Error("Provider not initialized");
        }

        setMintTxHash(undefined);
        setStakingGasless(true);
        const approveCallData = await approveNFT(tokenId);
        const stakeCallData = await stakeNFT(tokenId);

        const GAS_MANAGER_POLICY_ID = "9cb0aa63-7c79-4924-9e18-8eba4d3db391";

        provider.withAlchemyGasManager({
            policyId: GAS_MANAGER_POLICY_ID,
        });

        console.log("Data", approveCallData, stakeCallData, provider)

        const elligibility = await provider.checkGasSponsorshipEligibility([
            approveCallData, stakeCallData
        ]);
        console.log("elligibility", elligibility)

        const overrides = { paymasterAndData: "0x" };

        const uoHash = await provider.sendUserOperation([
            // @ts-ignore
            approveCallData, stakeCallData,
        ],
            { overrides: elligibility ? undefined : overrides }

        );

        toast.update("minting going on");
        let txHash: Hash;
        try {
            txHash = await provider.waitForUserOperationTransaction(uoHash.hash);
            toast.success("NFT Staked successfully ✅");
            fetchNFTs();
            setStakingGasless(false);

        } catch (e) {
            console.log("Error in minting", e);
            setStakingGasless(false);
            return;
        }

        setMintTxHash(txHash);

    }

    const checkEligibility = async (tokenId: any) => {

        if (web3auth?.provider == null) {
            throw new Error("web3auth provider is available");
        }

        try {
            const approveCallData = await approveNFT(tokenId);
            const stakeCallData = await stakeNFT(tokenId);

            const GAS_MANAGER_POLICY_ID = "9cb0aa63-7c79-4924-9e18-8eba4d3db391";

            provider.withAlchemyGasManager({
                policyId: GAS_MANAGER_POLICY_ID,
            });

            console.log("Data", approveCallData, stakeCallData, provider)

            const elligibility = await provider.checkGasSponsorshipEligibility([
                approveCallData, stakeCallData
            ]);
            console.log("elligibility", elligibility)
            toast.success("You are eligibile for gasless sponsership");

        } catch (error) {
            console.log("Error", error);
            toast.error("You are not eligibile for gasless sponsership");
        }


    }

    return (
        <div className='min-w-[325px] border gap-8 border-gray-400 rounded-md flex flex-col justify-between pb-[20px]'>
            <div className='flex flex-row items-center justify-center'>
                <Image className=' min-w-[325px] h-[300px]' src={nft?.image.originalUrl} alt='POkeMon NFT' width={100} height={100} />
            </div>

            <div className='mx-[10px] flex flex-col gap-[10px]'>
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


            <div className='flex flex-col gap-4 justify-center mt-[20px]'>

                <div className='flex flex-col items-center gap-4'>
                    <button
                        disabled={isStaking}
                        onClick={() => handleStakeBatch(nft.tokenId)}
                        className='rounded-md flex flex-row items-center justify-center min-w-[250px] bg-blue-700 text-white hover:bg-blue-900 px-4 py-2 '
                    >
                        {!isStaking && `Stake ${nft.name} NFT`}
                        {isStaking && (
                            <LoaderSpinner color={"#FFF"} size={25} loading={true} />
                        )}
                    </button>

                    <button
                        disabled={stakingGasless}
                        onClick={() => stakeGasless(nft.tokenId)}
                        className='rounded-md flex flex-row items-center justify-center min-w-[250px] bg-blue-700 text-white hover:bg-blue-900 px-4 py-2 '
                    >
                        {!stakingGasless && `Stake ${nft.name} NFT Gasless`}
                        {stakingGasless && (
                            <LoaderSpinner color={"#FFF"} size={25} loading={true} />
                        )}
                    </button>

                    <button
                        onClick={() => checkEligibility(nft.tokenId)}
                        className='rounded-md flex flex-row items-center justify-center min-w-[250px] bg-blue-700 text-white hover:bg-blue-900 px-4 py-2 '
                    >
                        Check Eligibility
                    </button>

                </div>


            </div>
        </div>
    );
};

export default ShowNFT;