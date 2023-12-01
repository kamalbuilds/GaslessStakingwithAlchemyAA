import { StakeNFTABI, StakingNFT } from '@/constants/StakingNFT';
import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';
import { useStakingContract } from '@/hooks/useContract';
import React, { useContext, useEffect, useState } from 'react';
import { Hash, encodeFunctionData } from 'viem';
import { useContractRead } from 'wagmi';
import StakedNFT from './StakedNFT';
import LoaderSpinner from '../Loader/LoaderSpinner';
import { toast } from "react-toastify";
import AddressLabel from '../AddressLabel/AddressLabel';
import { GlobalContext } from '@/context/GlobalContext';

const index = () => {

    const { provider, web3auth, smartWalletAddress } = useContext(AccountAbstractionContext);
    // @ts-ignore
    const { getStakingInfo } = useStakingContract({ web3auth });
    const [stakedNFTTokenIds, showStakedNFTTokenIds] = useState();
    const [loadingNFTs, setLoadingNFTs] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [mintTxHash, setMintTxHash] = useState<Hash>();
    const { checkIfEligibileForGas } = useContext(GlobalContext)


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
                setMintTxHash(undefined)
                setIsClaiming(true);
                const claimCallData = encodeFunctionData({
                    abi: StakeNFTABI,
                    functionName: "claimRewards",
                    args: [],
                });

                const claimTxnData = {
                    target: StakingNFT, //ERC 20 token
                    data: claimCallData,
                }

                const overrides = await checkIfEligibileForGas(claimTxnData);
                const providerWithSimulation = provider.withAlchemyUserOpSimulation();
                const uoHash = await providerWithSimulation.sendUserOperation(
                    //@ts-ignore
                    claimTxnData, overrides);

                let txHash: Hash;
                txHash = await providerWithSimulation.waitForUserOperationTransaction(uoHash.hash);
                toast.success("Rewards claimed successfully ✅");
                if (txHash) {
                    console.log("Txn hash", txHash)
                    setIsClaiming(false);
                    setMintTxHash(txHash);

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
                setMintTxHash(undefined)
                setIsWithdrawing(true);
                const stakeCallData = encodeFunctionData({
                    abi: StakeNFTABI,
                    functionName: "withdraw",
                    args: [stakedNFTTokenIds],
                });

                const uoHash = await provider.sendUserOperation({
                    target: StakingNFT,
                    data: stakeCallData,
                });

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

            {mintTxHash && <div className='flex flex-col mt-4'>
                <div className='text-[24px]'>Recent Transactions</div>
                <div className="px-4 py-2 border border-gray-400 rounded-lg">
                    <AddressLabel address={mintTxHash} showFullAddress isTransactionAddress showBlockExplorerLink />
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

                            <div className='flex flex-row py-[20px] flex-nowrap gap-4'>
                                {/* @ts-ignore */}
                                {stakedNFTTokenIds && stakedNFTTokenIds?.map((stakedNFTTokenId: any) => {
                                    return (
                                        <StakedNFT setMintTxHash={setMintTxHash} getStakersData={getStakersData} nftTokenId={stakedNFTTokenId} />
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

export default index;