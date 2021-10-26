import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import rainbowLogo from '../images/rainbow.png';
import { createContext, useState } from 'react';
import { INFURA_ID, NETWORK } from '../utils/constants';
import { Web3Context, providerOptions, openWeb3Modal, web3ObjType } from '../utils/web3Context';
import Web3 from 'web3';

const infuraNetworkString = NETWORK == 'ethereum' ? 'mainnet' : `${NETWORK}`;

function MyApp({ Component, pageProps }: AppProps): JSX.Element {

    const infuraProvider = new Web3.providers.WebsocketProvider(
        `wss://${infuraNetworkString}.infura.io/ws/v3/${INFURA_ID}`,
    );
    
    const [web3, setWeb3] = useState(new Web3(infuraProvider));

    const web3Obj: web3ObjType = {
        web3,
        openWeb3Modal: () => openWeb3Modal(setWeb3),
    };

    return (
        <Web3Context.Provider value={web3Obj}>
            <ChakraProvider>
                <Component {...pageProps} />
            </ChakraProvider>
        </Web3Context.Provider>
    );
}

export default MyApp;
