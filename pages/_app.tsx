import { Box, ChakraProvider, extendTheme, Flex } from '@chakra-ui/react';
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
        black: '#000',
        teal: {
            // 100: '#B2F5EA', // rgb(178, 245, 234)
            // 300: '#7ED6D6', // rgb(126, 214, 214)
            // 400: '#00ADAB', // rgb(0, 173, 171)
            // 500: '#007B7A',
            900: 'rgb(29, 64, 68)',
            '100opaque': 'rgb(178, 245, 234,.92)',
            '700opaque': 'rgb(40, 94, 97, .7)',
        },
    },
    fonts: {
        heading: 'Lato',
        body: 'Lato',
    },
});

// --chakra-colors-teal-50: #E6FFFA; rgb(230, 255, 250)
// --chakra-colors-teal-100: #B2F5EA; rgb(178, 245, 234)
// --chakra-colors-teal-200: #81E6D9;
// --chakra-colors-teal-300: #4FD1C5;
// --chakra-colors-teal-400: #38B2AC;
// --chakra-colors-teal-500: #319795;
// --chakra-colors-teal-600: #2C7A7B;
// --chakra-colors-teal-700: #285E61; rgb(40, 94, 97)
// --chakra-colors-teal-800: #234E52;
// --chakra-colors-teal-900: #1D4044; rgb(29, 64, 68)

console.log(leftBg.src);
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
