import React, { useContext } from 'react';
import { IoMdHome } from "react-icons/io";
import { BsPiggyBank } from "react-icons/bs";
import { MdAccountBalanceWallet } from "react-icons/md";
import { BiSolidCoinStack } from "react-icons/bi";
import { AccountAbstractionContext } from '@/context/AccountAbstractionContext';
import LoaderSpinner from '../Loader/LoaderSpinner';


const Sidebar = ({
    activeTab,
    setActiveTab
}: any) => {

    const isActive = (tab: any) => {
        if (activeTab == tab) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <div className='w-[25%] p-[10px]'>
            <div className='text-[26px] pt-[10px] mb-[20px]'>Gasless Staking</div>

            <div className='mx-[10px] pt-[13px]'>
                <div className='flex flex-col gap-4'>
                    <div onClick={() => setActiveTab(1)}
                        className={`flex flex-row gap-4 rounded-md px-[20px] py-[10px] items-center  cursor-pointer ${isActive(1) && 'bg-blue-600 text-white'} hover:bg-blue-600 hover:text-white`}>
                        <IoMdHome className='w-[25px] h-[25px]' />
                        <div className='text-[22px] font-[400]'>Home</div>
                    </div>
                    <div onClick={() => setActiveTab(2)}
                        className={`flex flex-row gap-4 rounded-md px-[20px] py-[10px] items-center  cursor-pointer ${isActive(2) && 'bg-blue-600 text-white'} hover:bg-blue-600 hover:text-white`}>
                        <MdAccountBalanceWallet className='w-[25px] h-[25px]' />
                        <div className='text-[22px] font-[400]'>Balance</div>
                    </div>
                    <div onClick={() => setActiveTab(3)}
                        className={`flex flex-row gap-4 rounded-md px-[20px] py-[10px] items-center  cursor-pointer ${isActive(3) && 'bg-blue-600 text-white'} hover:bg-blue-600 hover:text-white`}>
                        <BiSolidCoinStack className='w-[25px] h-[25px]' />
                        <div className='text-[22px] font-[400]'>Mint NFT</div>
                    </div>
                    <div onClick={() => setActiveTab(4)}
                        className={`flex flex-row gap-4 rounded-md px-[20px] py-[10px] items-center  cursor-pointer ${isActive(4) && 'bg-blue-600 text-white'} hover:bg-blue-600 hover:text-white`}>
                        <BiSolidCoinStack className='w-[25px] h-[25px]' />
                        <div className='text-[22px] font-[400]'>Stake NFT</div>
                    </div>
                    <div onClick={() => setActiveTab(5)}
                        className={`flex flex-row gap-4 rounded-md px-[20px] py-[10px] items-center  cursor-pointer ${isActive(5) && 'bg-blue-600 text-white'} hover:bg-blue-600 hover:text-white`}>
                        <BiSolidCoinStack className='w-[25px] h-[25px]' />
                        <div className='text-[22px] font-[400]'>Withdraw NFT</div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Sidebar;