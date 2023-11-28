import { StakeNFTABI, StakingNFT } from '@/constants/StakingNFT';
import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';
import { useStakingContract } from '@/hooks/useContract';
import React, { useContext, useEffect, useState } from 'react';
import { Hash, encodeFunctionData } from 'viem';
import { useContractRead } from 'wagmi';
const WithdrawNFTs = () => {

    const { provider, web3auth, smartWalletAddress } = useContext(AccountAbstractionContext);

    const { getStakingInfo } = useStakingContract({ web3auth });
    const [stakedNFTTokenIds, showStakedNFTTokenIds] = useState();

    useEffect(() => {

        if (provider) {
            const getStakersData = async () => {
                console.log("staking", getStakingInfo, smartWalletAddress)
                const res = await getStakingInfo(smartWalletAddress);
                const { rewardNumber, nftTokenIds } = res;
                showStakedNFTTokenIds(nftTokenIds);
                console.log("res in show staked nft", res);
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

            <button onClick={() => claimRewards()} className='border border-gray-400 px-4 py-2 '>Claim Rewards</button>
            <button onClick={() => withdrawNFT()} className='border border-gray-400 px-4 py-2 '>Withdraw</button>



        </div>
    );
};

export default WithdrawNFTs;