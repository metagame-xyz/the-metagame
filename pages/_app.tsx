import { ChakraProvider, extendTheme, Flex } from '@chakra-ui/react';
import '@fontsource/courier-prime';
import '@fontsource/lato';
import '@fontsource/major-mono-display';
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
                color: 'teal.900',
            },
        },
    },
    colors: {
        white: '#E6FFFA',
        teal: {
            '100opaque': 'rgb(178, 245, 234,.92)',
        },
    },
    fonts: {
        heading: 'Lato',
        body: 'Lato',
    },
});

// --chakra-colors-teal-100: #B2F5EA; rgb(178, 245, 234)

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
                        <Flex bgColor="teal.100opaque" width="100%">
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
