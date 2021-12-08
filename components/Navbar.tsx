import {
    Avatar,
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Spacer,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react';
import React from 'react';

import { useEthereum } from '@providers/EthereumProvider';

import { Etherscan, Logo, Opensea, Twitter } from '@components/Icons';

function Navbar(props) {
    const { userName, openWeb3Modal, avatarUrl } = useEthereum();

    const showName = useBreakpointValue({ base: false, md: true });

    return (
        <Flex width="100%" bgColor="transparent">
            <HStack
                as="nav"
                width="100%"
                margin="auto"
                justify="center"
                align="center"
                p={4}
                h="56px"
                {...props}></HStack>
        </Flex>
    );
}

export default Navbar;
