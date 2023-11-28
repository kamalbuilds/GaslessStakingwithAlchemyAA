import React from 'react';
import { IoMdHome } from "react-icons/io";
import { BsPiggyBank } from "react-icons/bs";
import { MdAccountBalanceWallet } from "react-icons/md";
import { BiSolidCoinStack } from "react-icons/bi";




const Sidebar = ({
    activeTab,
    setActiveTab
}: any) => {
    return (
        <div className='w-[25%] '>
            Sidebar

            <div className='mx-[20px] my-[20px]'>
                <div className='flex flex-col gap-8'>
                    <div onClick={() => setActiveTab(1)} className='flex flex-row gap-4 items-center cursor-pointer'>
                        <IoMdHome className='w-[25px] h-[25px]' />
                        <div className='text-[20px]'>Home</div>
                    </div>
                    <div onClick={() => setActiveTab(2)} className='flex flex-row gap-4 items-center cursor-pointer'>
                        <BsPiggyBank className='w-[25px] h-[25px]' />
                        <div className='text-[20px]'>Faucet</div>
                    </div>
                    <div onClick={() => setActiveTab(3)} className='flex flex-row gap-4 items-center cursor-pointer'>
                        <MdAccountBalanceWallet className='w-[25px] h-[25px]' />
                        <div className='text-[20px]'>Balance</div>
                    </div>
                    <div onClick={() => setActiveTab(5)} className='flex cursor-pointer flex-row gap-4 items-center'>
                        <BiSolidCoinStack className='w-[25px] h-[25px]' />
                        <div className='text-[20px]'>Mint PokeMon NFT</div>
                    </div>
                    <div onClick={() => setActiveTab(6)} className='flex cursor-pointer flex-row gap-4 items-center'>
                        <BiSolidCoinStack className='w-[25px] h-[25px]' />
                        <div className='text-[20px]'>Send Batch Transaction</div>
                    </div>

                    <div onClick={() => setActiveTab(7)} className='flex cursor-pointer flex-row gap-4 items-center'>
                        <BiSolidCoinStack className='w-[25px] h-[25px]' />
                        <div className='text-[20px]'>Claim and Withdraw</div>
                    </div>
                </div>
                <div>


                </div>
            </div>


        </div>
    );
};

export default Sidebar;