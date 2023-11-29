import UserBalance from '@/components/Balance/UserBalance';
import MintAndStakeNFT from '@/components/BatchTransaction/MintAndStakeNFT';
import MintNFT from '@/components/MintNFT/MintNFT';
import MintTokens from '@/components/MintTokens/MintTokens';
import UserDetails from '@/components/UserDetails';
import WithdrawNFTs from '@/components/WithdrawNFT/WithdrawNFTs';
import Navbar from '@/components/instructionsComponent/navigation/navbar';
import React from 'react';

const HomeScreen = ({
    activeTab,
    setActiveTab
}: any) => {
    return (
        <div className='w-[75%] p-[10px]'>

            {/* <Navbar /> */}

            {activeTab === 1 && <UserDetails />}
            {activeTab === 2 && <UserBalance />}
            {activeTab === 3 && <MintNFT />}
            {activeTab === 4 && <MintAndStakeNFT />}
            {activeTab === 5 && <WithdrawNFTs />}

        </div>
    );
};

export default HomeScreen;