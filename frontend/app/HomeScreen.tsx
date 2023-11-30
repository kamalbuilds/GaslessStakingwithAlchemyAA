import React from 'react';

import UserBalance from '@/components/Balance/UserBalance';
import StakeNFT from '@/components/StakeNFT';
import MintNFT from '@/components/MintNFT/MintNFT';
import UserDetails from '@/components/UserDetails';
import WithdrawNFT from '@/components/WithdrawNFT';


const HomeScreen = ({
    activeTab,
    setActiveTab
}: any) => {
    return (
        <div className='w-[75%] p-[10px]'>


            {activeTab === 1 && <UserDetails />}
            {activeTab === 2 && <UserBalance />}
            {activeTab === 3 && <MintNFT />}
            {activeTab === 4 && <StakeNFT />}
            {activeTab === 5 && <WithdrawNFT />}

        </div>
    );
};

export default HomeScreen;