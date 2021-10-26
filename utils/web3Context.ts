import { Web3Provider, BaseProvider } from '@ethersproject/providers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import rainbowLogo from '../images/rainbow.png';
import { createContext, SetStateAction, useContext } from 'react';
import { NETWORK, INFURA_ID } from '../utils/constants';
import { debug } from './frontend';
import Web3 from 'web3';

export const providerOptions = {
    'custom-rainbow': {
        display: {
            logo: rainbowLogo.src,
            name: 'Rainbow',
            description: 'Connect using rainbow',
        },
        package: WalletConnectProvider,
        options: {
            infuraId: INFURA_ID, // required
        },
        connector: async (ProviderPackage, options) => {
            const provider = new ProviderPackage(options);

            await provider.enable();

            return provider;
        },
    },
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            infuraId: INFURA_ID, // required
        },
    },
};

export async function openWeb3Modal(setWeb3: { (value: SetStateAction<Web3>): void; (arg0: Web3): void; }) {
    const web3Modal = new Web3Modal({
        network: NETWORK, // optional
        cacheProvider: false, // optional
        providerOptions, // required
    });

    const provider = await web3Modal.connect();
    debug({ provider });
    setWeb3(new Web3(provider));
}

export type web3ObjType = {
    web3: Web3;
    openWeb3Modal: (setWeb3: any) => void;
};

export const Web3Context = createContext<web3ObjType>({ web3: null, openWeb3Modal });
export const useWeb3 = () => useContext(Web3Context);
