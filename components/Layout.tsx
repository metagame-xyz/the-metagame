import { Box, Flex, Spacer } from '@chakra-ui/react';
import React from 'react';

import Footer from './Footer';
import Navbar from './Navbar';

// import Footer from "../sections/Footer" // will add this in the part 2

const maxW = { xl: '1280px' };

export default function Layout(props) {
    return (
        <Flex direction="column" align="center" m="0 auto" {...props}>
            <Navbar maxW={maxW} />
            <Flex maxW={maxW}>{props.children}</Flex>
            <Spacer />
            <Footer maxW={maxW} />
        </Flex>
    );
}
