import React, { PropsWithChildren } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <div className="h-screen bg-gradient-radial">
            <div className="flex justify-end p-4">
                <ConnectButton />
            </div>


            {children}
            
            <p className="absolute bottom-0 text-center w-full">
                Made with ❤️ by your frens at Blockchain Partner
            </p>
        </div>
    );
};
export default Layout;