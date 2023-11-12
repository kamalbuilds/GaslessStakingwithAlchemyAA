import MintAndStakeNFT from '@/components/BatchTransaction/MintAndStakeNFT';
import MintNFT from '@/components/MintNFT/MintNFT';
import MintTokens from '@/components/MintTokens/MintTokens';
import UserDetails from '@/components/UserDetails';
import React from 'react';

const HomeScreen = ({
    activeTab,
    setActiveTab
}: any) => {
    return (
        <div className='w-[75%] bg-red-400'>

            {/* <UserDetails /> */}

            {activeTab === 4 && <MintTokens />}

            {activeTab === 5 && <MintNFT />}

            {activeTab === 6 && <MintAndStakeNFT />}




        </div>
    );
};

export default HomeScreen;