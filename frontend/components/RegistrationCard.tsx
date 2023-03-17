import React from 'react'
import ButtonSendTransaction from './ButtonSendTransaction';

const RegistrationCard = () => {
    return (

        <div className='flex justify-center items-center pt-20'>

            <div className='flex flex-col w-2/5 h-96  bg-white/70 rounded-lg items-center justify-center border-neutral-800 border m-10 pb-10'>
                <h1 className='p-4 font-bold text-lg'>Check availability name</h1>
                <ButtonSendTransaction />
            </div>

            <div className='flex flex-col w-2/5 h-96 items-center justify-center m-10 pb-10'>
                <h1 className='text-lg font-bold'>Buy your universal name</h1>
                <p className='p-4'>Register now your universal name on every layer 2's currently available. No more different identity. Welcome to a cross-chain world. </p>
            </div>
        </div>
    )
}

export default RegistrationCard;
