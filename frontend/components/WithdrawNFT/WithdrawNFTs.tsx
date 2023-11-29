import { StakeNFTABI, StakingNFT } from '@/constants/StakingNFT';
import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';
import { useStakingContract } from '@/hooks/useContract';
import React, { useContext, useEffect, useState } from 'react';
import { Hash, encodeFunctionData } from 'viem';
import { useContractRead } from 'wagmi';
import StakedNFT from '../BatchTransaction/StakedNFT';
import LoaderSpinner from '../Loader/LoaderSpinner';
import { toast } from "react-toastify";

const WithdrawNFTs = () => {

    const { provider, web3auth, smartWalletAddress } = useContext(AccountAbstractionContext);
    // @ts-ignore
    const { getStakingInfo } = useStakingContract({ web3auth });
    const [stakedNFTTokenIds, showStakedNFTTokenIds] = useState();
    const [loadingNFTs, setLoadingNFTs] = useState(false);

    useEffect(() => {

        if (provider) {
            setLoadingNFTs(true);
            const getStakersData = async () => {
                try {
                    console.log("staking", getStakingInfo, smartWalletAddress)
                    const res = await getStakingInfo(smartWalletAddress);
                    const { rewardNumber, nftTokenIds } = res;
                    showStakedNFTTokenIds(nftTokenIds);
                    console.log("res in show staked nft", res);
                    setLoadingNFTs(false);
                } catch (error) {
                    setLoadingNFTs(false);
                    console.log("Error", error)
                }
            }
            getStakersData();
        }

    }, [provider])

    const claimRewards = async () => {

        const stakeCallData = encodeFunctionData({
            abi: StakeNFTABI,
            functionName: "claimRewards",
            args: [],
        });

        const uoHash = await provider.sendUserOperation({
            target: StakingNFT, //ERC 20 token
            data: stakeCallData,
        });

        console.log("Uo HAsh", uoHash);

        // setMintStatus("Minting");
        let txHash: Hash;
        try {
            txHash = await provider.waitForUserOperationTransaction(uoHash.hash);
            toast.success("Rewards claimed successfully ✅");
            console.log("Tx hash", txHash);
        } catch (e) {
            toast.error("error in withdrawing NFT")
            console.log("error in withdrawing NFT", e);
            // setMintStatus("Error Minting");
            // setTimeout(() => {
            //     setMintStatus("Mint");
            // }, 5000);
            return;
        }


    }

    const withdrawNFT = async () => {

        console.log("res", stakedNFTTokenIds);

        const stakeCallData = encodeFunctionData({
            abi: StakeNFTABI,
            functionName: "withdraw",
            args: [stakedNFTTokenIds],
        });

        console.log("Call Data", stakeCallData);

        const uoHash = await provider.sendUserOperation({
            target: StakingNFT, //ERC 20 token
            data: stakeCallData,
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

    return (
        <div>
            <div className='text-[32px]'> Claim Rewards and Withdraw NFT</div>

            <button onClick={claimRewards}
                className='rounded-md border bg-blue-700 text-white hover:bg-blue-900 border-gray-400 px-4 py-2 m-4 ml-0'
            >
                Claim Rewards
            </button>
            <button onClick={withdrawNFT}
                className='rounded-md  border border-blue-700 hover:bg-blue-700 hover:text-white px-4 py-2 m-4 ml-0'>
                Withdraw All NFTs
            </button>

            {loadingNFTs ? (
                <div className='flex flex-row items-center justify-center'>
                    <LoaderSpinner loading={true} />
                </div>
            ) : (
                <>
                    {stakedNFTTokenIds &&
                        <>
                            <div className='text-[32px]'>NFTs Staked</div>

                            <div className='flex flex-row flex-wrap gap-4'>
                                {stakedNFTTokenIds && stakedNFTTokenIds.map((stakedNFTTokenId) => {
                                    return (
                                        <StakedNFT nftTokenId={stakedNFTTokenId} />
                                    )
                                })}
                            </div>

                        </>
                    }
                </>
            )}


        </div>
    );
};

export default WithdrawNFTs;