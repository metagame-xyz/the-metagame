import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import Footer from './Footer';
import Navbar from './Navbar';

// import Footer from "../sections/Footer" // will add this in the part 2

const maxW = { xl: '1280px' };

export default function Layout(props) {
    return (
        <Flex
            // minH="full"
            // h="full"
            direction="column"
            align="center"
            maxW={maxW}
            m="0 auto"
            {...props}>
            <Navbar />
            <Box h="full">{props.children}</Box>
            <Footer maxW={maxW} />
        </Flex>
    );
}
