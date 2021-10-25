import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';


function getLibrary(provider) {
    const library = new Web3Provider(provider);
    console.log('getLibrary');
    return library;
}

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
        <ChakraProvider>
            <Component {...pageProps} />
        </ChakraProvider>
        </Web3ReactProvider>
    );
}

export default MyApp;
