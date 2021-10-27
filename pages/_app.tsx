import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import EthereumProvider from '../providers/EthereumProvider';

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
