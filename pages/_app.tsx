import { ChakraProvider, extendTheme, Flex } from '@chakra-ui/react';
import '@fontsource/courier-prime';
import '@fontsource/lato';
import type { AppProps } from 'next/app';

import Layout from '@components/Layout';

import leftBg from '../images/left-bg.png';
import rightBg from '../images/right-bg.png';
import EthereumProvider from '../providers/EthereumProvider';
import '../styles/globals.css';

const theme = extendTheme({
    styles: {
        global: {
            'html, body': {
                color: '#FAF5FF',
            },
        },
    },
    colors: {
        white: '#FAF5FF',
        brand: {
            '50': '#F0F0F4',
            '100': '#D6D6E0',
            '200': '#BCBCCD',
            '300': '#A2A2B9',
            '400': '#8888A5',
            '500': '#6E6E91',
            '600': '#585874',
            '700': '#424257',
            '800': '#2C2C3A',
            '900': '#16161D', // rgba(22, 22, 26, 0.9)
            '100opaque': 'rgba(22, 22, 26, 0.9)',
        },
    },
    fonts: {
        heading: 'Courier Prime, Courier, monospace',
        body: 'Courier Prime, Courier, monospace',
    },
});

const bgSize = ['100px', '120px', '220px', '300px'];

function App({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <ChakraProvider theme={theme}>
            <EthereumProvider>
                <Flex bgColor="brand.900" width="100%" minH="100vh">
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </Flex>
            </EthereumProvider>
        </ChakraProvider>
    );
}

export default App;
