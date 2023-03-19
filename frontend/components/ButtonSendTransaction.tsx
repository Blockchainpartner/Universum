import React, { useState } from 'react'
import { sendMetaTx2 } from "../service/metaTx"
import { useContractRead } from 'wagmi'
import useDebounce from './useDebounce'
const namehash = require('eth-ens-namehash');
let ensABI = require('../service/ensABI.js');



const ButtonSendTransaction = () => {
    const [name, setName] = useState('');
    const debouncedName = useDebounce(name, 500);
    const [isFree, setIsFree] = useState(false);
    const [isTaken, setIsTaken] = useState(false);

    const { refetch } = useContractRead(
        {
            address: '0x9EBEe49a631f179f927B721d526080c100A82C4D',
            abi: ensABI,
            functionName: 'owner',
            args: [namehash.hash(name + ".test")],
        }
    );

    async function handleClick(name: string) {
        sendMetaTx2(name);
    };

    async function handleVerify() {
        setIsFree(false);
        setIsTaken(false);
        const res = await refetch();
        const stringRes = res.data?.toString();
        console.log("resultat de l'appel: ", stringRes);
        if (stringRes == "0x0000000000000000000000000000000000000000") {
            setIsFree(true);
        }
        else {
            setIsTaken(true);
        }
    };

    return (
        <div className='flex flex-col'>
            <div className='flex flex-row'>
                <input
                    className='border rounded p-2'
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Search name"
                    value={name}>
                </input>
                <p className='flex justify-center items-center'>.uni</p>
                <button
                    className='border rounded p-2 ml-4'
                    onClick={() => handleVerify()}
                >Search</button>
            </div>
            {isFree && (
                <>
                    <p className='text-green-500 p-2'>The name is available</p>
                    <button
                        className='border rounded p-2'
                        onClick={() => handleClick(name)}>Register it on all L2's
                    </button>
                    <h1 className='p-4 font-bold text-lg text-center'>Supported networks</h1>
                </>
            )}
            {isTaken && (
                <p className='text-red-500 p-2'>The name is already registered</p>
            )}
        </div>
    )
}

export default ButtonSendTransaction;
