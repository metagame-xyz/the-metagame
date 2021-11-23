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
                color: 'brand.900',
            },
        },
    },
    colors: {
        white: '#FAF5FF',
        brand: {
            '50': '#FAF5FF',
            '100': '#E9D8FD',
            '100opaque': 'rgba(233, 216, 253, 0.92)',
            '200': '#D6BCFA',
            '300': '#B794F4',
            '400': '#9F7AEA',
            '500': '#805AD5',
            '600': '#6B46C1',
            '700': '#553C9A',
            '800': '#44337A',
            '900': '#322659',
        },
    },
    fonts: {
        heading: 'Lato',
        body: 'Lato',
    },
});

const bgSize = ['100px', '120px', '220px', '300px'];

function App({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <ChakraProvider theme={theme}>
            <EthereumProvider>
                <Flex
                    backgroundImage={leftBg.src}
                    bgBlendMode="overlay"
                    bgPosition={'left 0px top -70px'}
                    bgSize={bgSize}
                    width="100%"
                    bgRepeat="no-repeat repeat">
                    <Flex
                        backgroundImage={rightBg.src}
                        width="100%"
                        bgPosition={'right 0px top -70px'}
                        bgSize={bgSize}
                        bgRepeat="no-repeat repeat">
                        <Flex bgColor="brand.100opaque" width="100%">
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </Flex>
                    </Flex>
                </Flex>
            </EthereumProvider>
        </ChakraProvider>
    );
}

export default App;
