import UserBalance from '@/components/Balance/UserBalance';
import MintAndStakeNFT from '@/components/BatchTransaction/MintAndStakeNFT';
import MintNFT from '@/components/MintNFT/MintNFT';
import MintTokens from '@/components/MintTokens/MintTokens';
import UserDetails from '@/components/UserDetails';
import WithdrawNFTs from '@/components/WithdrawNFT/WithdrawNFTs';
import React from 'react';

const HomeScreen = ({
    activeTab,
    setActiveTab
}: any) => {
    return (
        <div className='w-[75%] '>

            {activeTab === 1 && <UserDetails />}

            {activeTab === 3 && <UserBalance />}

            {activeTab === 5 && <MintNFT />}

            {activeTab === 6 && <MintAndStakeNFT />}

            {activeTab === 7 && <WithdrawNFTs />}




        </div>
    );
};

export default HomeScreen;