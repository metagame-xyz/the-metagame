import { Box, ChakraProvider, extendTheme, Flex } from '@chakra-ui/react';
import { url } from 'inspector';
import type { AppProps } from 'next/app';

import Layout from '@components/Layout';

import bg from '../images/background.png';
import EthereumProvider from '../providers/EthereumProvider';
import '../styles/globals.css';

const theme = extendTheme({
    colors: {
        teal: {
            500: '#007B7A',
        },
    },
    fonts: {
        heading:
            '-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, roboto, noto, arial, sans-serif;',
        body: '-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, roboto, noto, arial, sans-serif;',
    },
});

function App({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <EthereumProvider>
            <ChakraProvider theme={theme}>
                <Flex
                    backgroundImage={bg.src}
                    bgPosition="center"
                    bgSize="cover"
                    bgRepeat="no-repeat"
                    height="100%">
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </Flex>
            </ChakraProvider>
        </EthereumProvider>
    );
}

export default App;
