import { StakeNFTABI, StakingNFT } from "@/constants/StakingNFT";
import { ethers } from "ethers";
import { useCallback, useState } from "react";


type StakingContractProps = {
    web3auth: any | null;
    address?: string;
};

export const useStakingContract = ({
    web3auth,
}: StakingContractProps) => {

    if (!web3auth) {
        return;
    }

    const web3Provider = new ethers.providers.Web3Provider(
        web3auth.provider,
        "any"
    );

    const contract = new ethers.Contract(
        StakingNFT,
        StakeNFTABI,
        web3Provider,
    )

    const getStakingInfo = useCallback(
        async (address: any) => {
            const res = await contract.getStakeInfo(address);

            const { _rewards, _tokensStaked } = res;
            const nftTokenIds = _tokensStaked.map((token: any) => {
                const tokenNumber = Number(token);
                return tokenNumber
            })
            const rewardNumber = Number(_rewards);

            return { rewardNumber, nftTokenIds };
        },
        [web3Provider]
    );

    return { getStakingInfo };
};