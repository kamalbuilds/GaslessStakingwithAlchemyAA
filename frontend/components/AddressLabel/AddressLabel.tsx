'use client'
import useMemoizedAddressLabel from '@/hooks/useMemoizedAddressLabel';
import React, { useState } from 'react';
import { MdOpenInNew } from "react-icons/md";
import { AiOutlineCopy } from "react-icons/ai";
import { ImNewTab } from "react-icons/im";
import Link from 'next/link';
import { TiTick } from "react-icons/ti";



type AddressLabelProps = {
    address: string
    isTransactionAddress?: boolean
    showBlockExplorerLink?: boolean
    showCopyIntoClipboardButton?: boolean
    enableTransaction?: boolean
    showFullAddress?: boolean
}


const AddressLabel = ({
    address,
    isTransactionAddress,
    showBlockExplorerLink,
    showCopyIntoClipboardButton = true,
    enableTransaction = false,
    showFullAddress,
}: AddressLabelProps) => {

    const [copyToClipBoard, setCopyToClipBoard] = useState(false);

    const addressLabel = showFullAddress ? address : useMemoizedAddressLabel(address)
    const blockExplorerLink = `https://sepolia.etherscan.io/${isTransactionAddress ? 'tx' : 'address'}/${address}`;

    const handleCopy = () => {
        navigator?.clipboard?.writeText?.(address)
        setCopyToClipBoard(true);

        setTimeout(() => {
            setCopyToClipBoard(false);
        }, 3000);

    }

    return (
        <div className='flex flex-row gap-1 items-center'>
            <span>{addressLabel}</span>

            {showBlockExplorerLink && blockExplorerLink && (
                <Link target='_blank' href={blockExplorerLink}><MdOpenInNew /></Link>
            )}

            {showCopyIntoClipboardButton && (
                <div onClick={handleCopy}>
                    {copyToClipBoard ? <TiTick className='w-[16px] h-[20px] fill-green-700' /> : <AiOutlineCopy />}
                </div>
            )}

            {enableTransaction && (
                <Link href={`/transactions/${address}`}>
                    {<ImNewTab />}
                </Link>

            )}

        </div>
    );
};

export default AddressLabel;