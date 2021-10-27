import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

import EthereumProvider from '../providers/EthereumProvider';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <EthereumProvider>
            <ChakraProvider>
                <Component {...pageProps} />
            </ChakraProvider>
        </EthereumProvider>
    );
}

export default MyApp;
