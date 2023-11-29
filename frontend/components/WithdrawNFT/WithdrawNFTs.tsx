import { StakeNFTABI, StakingNFT } from '@/constants/StakingNFT';
import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';
import { useStakingContract } from '@/hooks/useContract';
import React, { useContext, useEffect, useState } from 'react';
import { Hash, encodeFunctionData } from 'viem';
import { useContractRead } from 'wagmi';
import StakedNFT from '../BatchTransaction/StakedNFT';
import LoaderSpinner from '../Loader/LoaderSpinner';
import { toast } from "react-toastify";
import AddressLabel from '../AddressLabel/AddressLabel';

const WithdrawNFTs = () => {

    const { provider, web3auth, smartWalletAddress } = useContext(AccountAbstractionContext);
    // @ts-ignore
    const { getStakingInfo } = useStakingContract({ web3auth });
    const [stakedNFTTokenIds, showStakedNFTTokenIds] = useState();
    const [loadingNFTs, setLoadingNFTs] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [mintTxHash, setMintTxHash] = useState<Hash>();

    const getStakersData = async () => {
        try {
            setLoadingNFTs(true);
            const res = await getStakingInfo(smartWalletAddress);
            const { rewardNumber, nftTokenIds } = res;
            showStakedNFTTokenIds(nftTokenIds);
            setLoadingNFTs(false);
        } catch (error) {
            setLoadingNFTs(false);
            console.log("Error", error)
        }
    }

    useEffect(() => {
        if (provider) {
            getStakersData();
        }

    }, [provider])

    const claimRewards = async () => {

        if (web3auth?.provider == null) {
            throw new Error("web3auth provider is available");
        }

        if (provider) {
            try {
                setIsClaiming(true);
                const stakeCallData = encodeFunctionData({
                    abi: StakeNFTABI,
                    functionName: "claimRewards",
                    args: [],
                });

                const uoHash = await provider.sendUserOperation({
                    target: StakingNFT, //ERC 20 token
                    data: stakeCallData,
                });

                let txHash: Hash;
                txHash = await provider.waitForUserOperationTransaction(uoHash.hash);
                toast.success("Rewards claimed successfully ✅");
                if (txHash) {
                    setIsClaiming(false);

                }

            } catch (error) {
                toast.error("Error in Claiming Rewards")
                setIsClaiming(false);
                console.log("error in Claiming Rewards", error);
                return;
            }
        }
    }

    const WithdrawAllNFTs = async () => {

        if (web3auth?.provider == null) {
            throw new Error("web3auth provider is available");
        }

        if (provider) {
            try {
                setIsWithdrawing(true);
                console.log("res", stakedNFTTokenIds);

                const stakeCallData = encodeFunctionData({
                    abi: StakeNFTABI,
                    functionName: "withdraw",
                    args: [stakedNFTTokenIds],
                });

                const uoHash = await provider.sendUserOperation({
                    target: StakingNFT, //ERC 20 token
                    data: stakeCallData,
                });

                // setMintStatus("Minting");
                let txHash: Hash;
                txHash = await provider.waitForUserOperationTransaction(uoHash.hash);
                if (txHash) {
                    setIsWithdrawing(false);
                    setMintTxHash(txHash);
                    getStakersData();
                }
                toast.success("NFTs withdrawn successfully ✅");

            } catch (error) {
                toast.error("Error in withdrawing All NFTs")
                console.log("Error in withdrawing", error);
                setIsWithdrawing(false);
                return;
            }
        }



    }

    return (
        <div>
            <div className='text-[32px]'> Claim Rewards and Withdraw NFT</div>

            {mintTxHash && <div className='flex flex-row gap-4'>
                <div>Recent Transaction</div>
                <div>
                    {mintTxHash}
                    <AddressLabel address={mintTxHash} isTransactionAddress />
                </div>
            </div>}

            <div className='flex flex-row gap-4 mt-8'>
                <button onClick={claimRewards}
                    disabled={isClaiming}
                    className='rounded-md flex flex-row items-center justify-center min-w-[150px] bg-blue-700 text-white hover:bg-blue-900 px-4 py-2 '
                >
                    {isClaiming ? (
                        <LoaderSpinner color={"#FFF"} size={20} loading={true} />
                    ) : `Claim Rewards`}
                </button>

                <button onClick={WithdrawAllNFTs}
                    disabled={isWithdrawing}
                    className='rounded-md min-w-[150px] border border-blue-700 hover:bg-blue-700 hover:text-white px-4 py-2 '
                >
                    {isWithdrawing ? (
                        <LoaderSpinner color={"#FFF"} size={20} loading={true} />
                    ) : `Withdraw NFTs`}
                </button>
            </div>


            {loadingNFTs ? (
                <div className='flex flex-row items-center justify-center'>
                    <LoaderSpinner loading={true} />
                </div>
            ) : (
                <>

                    {/* @ts-ignore */}
                    {stakedNFTTokenIds && stakedNFTTokenIds?.length > 0 &&
                        <>
                            <div className='text-[32px]'>NFTs Staked</div>

                            <div className='flex flex-row py-[20px] flex-nowrap overflow-scroll gap-4'>
                                {/* @ts-ignore */}
                                {stakedNFTTokenIds && stakedNFTTokenIds?.map((stakedNFTTokenId: any) => {
                                    return (
                                        <StakedNFT getStakersData={getStakersData} nftTokenId={stakedNFTTokenId} />
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