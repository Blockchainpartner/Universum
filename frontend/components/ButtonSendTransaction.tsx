import React, { useState } from 'react'
import { sendMetaTx2 } from "../service/metaTx"


const ButtonSendTransaction = () => {
    const [name, setName] = useState('');

    async function handleClick(name: string) {
        sendMetaTx2(name);
    }


    return (
        <div>
            <input
                onChange={(e) => setName(e.target.value)}
                placeholder="ens name"
                value={name}></input>
            <button onClick={() => handleClick(name)}>Lancer la metaTx</button>
        </div>
    )
}

export default ButtonSendTransaction;
