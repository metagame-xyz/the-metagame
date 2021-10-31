import { Box, Flex, Spacer } from '@chakra-ui/react';
import React from 'react';

import Footer from './Footer';
import Navbar from './Navbar';

// import Footer from "../sections/Footer" // will add this in the part 2

export const maxW = { xl: '1280px' };

export default function Layout(props) {
    return (
        <Flex direction="column" width="100%" {...props}>
            <Navbar maxW={maxW} />
            <Box width="100%" justify="center">
                {props.children}
            </Box>
            <Spacer />
            <Footer maxW={maxW} />
        </Flex>
    );
}
