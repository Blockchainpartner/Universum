import React, { useState } from 'react'
import { sendMetaTx2 } from "../service/metaTx"
import { useContractRead, useNetwork } from 'wagmi'
import useDebounce from './useDebounce'
const namehash = require('eth-ens-namehash');
let ensABI = require('../service/ensABI.js');
import { OPTIMISTIC_GOERLI_ENS_ADDRESS, ARBITRUM_GOERLI_ENS_ADDRESS, SCROLL_ENS_ADDRESS, POLYGONZK_ENS_ADDRESS } from '../service/contractAddresses';

const ButtonSendTransaction = () => {
    const [name, setName] = useState('');
    const debouncedName = useDebounce(name, 500);
    const [isFree, setIsFree] = useState(false);
    const [isTaken, setIsTaken] = useState(false);

    const { chain } = useNetwork();

    function getContractAddress() {
        switch (chain?.network) {
            case "optimism-goerli":
                return OPTIMISTIC_GOERLI_ENS_ADDRESS;
                break;
            case "arbitrum-goerli":
                return ARBITRUM_GOERLI_ENS_ADDRESS;
                break;
            case "scroll-testnet":
                return SCROLL_ENS_ADDRESS;
                break;
            case "polygon-zkevm-testnet":
                return POLYGONZK_ENS_ADDRESS;
                break;
            default:
            // code block
        }
    };

    const { refetch } = useContractRead(
        {
            address: getContractAddress(),
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
                    className='border rounded p-2 ml-4 font-bold text-white bg-blue-500 border-blue-500'
                    onClick={() => handleVerify()}
                >Search</button>
            </div>
            <h1 className='p-4 font-bold text-lg text-center'>Supported networks</h1>
            <div className='grid grid-cols-2 gap-2 place-items-center'>
                <div className='flex'>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><rect width="26.6" height="26.6" x=".7" y=".7" fill="#2D374B" stroke="#96BEDC" stroke-width="1.4" rx="13.3"/><mask id="a" width="28" height="28" x="0" y="0" maskUnits="userSpaceOnUse"><rect width="28" height="28" fill="#C4C4C4" rx="14"/></mask><g mask="url(#a)"><path fill="#28A0F0" d="m14.0861 18.6041 6.5014 10.2239 4.0057-2.3213-7.86-12.3943-2.6471 4.4917Zm13.0744 3.4692-.003-1.8599-7.3064-11.407-2.3087 3.9173 7.091 11.4303 2.172-1.2586a.9628.9628 0 0 0 .3555-.7009l-.0004-.1212Z"/><rect width="25.9" height="25.9" x="1.05" y="1.05" fill="url(#b)" fill-opacity=".3" stroke="#96BEDC" stroke-width="2.1" rx="12.95"/><path fill="#fff" d="m.3634 28.2207-3.07-1.7674-.234-.8333L7.7461 9.0194c.7298-1.1913 2.3197-1.575 3.7957-1.5541l1.7323.0457L.3634 28.2207ZM19.1655 7.511l-4.5653.0166L2.24 27.9533l3.6103 2.0788.9818-1.6652L19.1655 7.511Z"/></g><defs><linearGradient id="b" x1="0" x2="14" y1="0" y2="28" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs></svg> */}
                    <p className='pl-2 flex items-center'>Arbitrum</p>
                </div>
                <div className='flex'>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><rect width="28" height="28" fill="#FF3131" rx="14" /><rect width="28" height="28" fill="url(#a)" fill-opacity=".3" rx="14" /><path fill="#fff" d="M9.22 18.35c2.7 0 4.86-2.2 4.86-5.38 0-2.19-1.47-3.8-3.98-3.8-2.72 0-4.85 2.2-4.85 5.38 0 2.2 1.5 3.8 3.97 3.8Zm.83-7.35c1.06 0 1.74.81 1.74 2.1 0 1.9-1.11 3.42-2.51 3.42-1.06 0-1.74-.82-1.74-2.1 0-1.89 1.11-3.42 2.5-3.42Zm6.38-1.68-1.88 8.88h2.26l.55-2.6h1.47c2.43 0 4.01-1.38 4.01-3.6 0-1.61-1.17-2.68-3.1-2.68h-3.3Zm1.9 1.74h.94c.83 0 1.3.38 1.3 1.14 0 1-.68 1.7-1.74 1.7h-1.11l.6-2.84Z" /><defs><linearGradient id="a" x1="0" x2="14" y1="0" y2="28" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" /><stop offset="1" stop-color="#fff" stop-opacity="0" /></linearGradient></defs></svg> */}
                    <p className='pl-2 flex items-center'>Optimism</p>
                </div>
                <div>ZkSync Era</div>
                <div>Scroll</div>
                <div>Polygon zkEVM</div>
                <div className='disabled'>Taiko (incoming)</div>
            </div>
            {isFree && (
                <>
                    <p className='text-green-500 p-4 text-center'>The name is available</p>
                    <button
                        className='border rounded p-2 font-bold text-white bg-blue-500 border-blue-500'
                        onClick={() => handleClick(name)}>Register it on all L2's
                    </button>
                </>
            )}
            {isTaken && (
                <p className='text-red-500 p-4 text-center'>The name is already registered</p>
            )}
        </div>
    )
}

export default ButtonSendTransaction;
