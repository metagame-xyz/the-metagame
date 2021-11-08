import { Box, ChakraProvider, extendTheme, Flex } from '@chakra-ui/react';
import '@fontsource/lato';
import type { AppProps } from 'next/app';

import Layout from '@components/Layout';

import leftBg from '../images/left-bg.png';
import rightBg from '../images/right-bg.png';
import EthereumProvider from '../providers/EthereumProvider';
import '../styles/globals.css';

const theme = extendTheme({
    colors: {
        teal: {
            500: '#007B7A',
            100: '#B9EBEB', // rgb(185, 235, 235)
        },
    },
    fonts: {
        heading: 'Lato',
        body: 'Lato',
    },
});

console.log(leftBg.src);
const bgSize = ['100px', '120px', '220px', '300px'];

function App({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <ChakraProvider theme={theme}>
            <EthereumProvider>
                <Flex
                    backgroundImage={leftBg.src}
                    // bgColor="teal.100"
                    bgBlendMode="overlay"
                    bgPosition={'left 0px top -70px'}
                    bgSize={bgSize}
                    width="100%"
                    bgRepeat="no-repeat repeat">
                    <Flex
                        backgroundImage={rightBg.src}
                        // bgColor="teal.100"
                        width="100%"
                        bgPosition={'right 0px top -70px'}
                        bgSize={bgSize}
                        bgRepeat="no-repeat repeat">
                        <Flex bgColor="rgb(185, 235, 235,.92)" width="100%">
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
