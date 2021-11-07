import { Button, Center, Flex, Heading, HStack, Link, Spacer, Stack, Text } from '@chakra-ui/react';
import React from 'react';

import { useEthereum } from '@providers/EthereumProvider';

import { Etherscan, Logo, Opensea, Twitter } from '@components/Icons';

import { NETWORK } from '@utils/constants';

export const etherscanNetworkString = NETWORK.toLowerCase() == 'ethereum' ? '' : `${NETWORK}.`;

function Navbar(props) {
    const { userName, openWeb3Modal } = useEthereum();

    return (
        <Flex width="100%" borderBottom="1px" borderColor="black">
            <Stack
                direction={['column', 'column', 'row', 'row']}
                as="nav"
                width="100%"
                margin="auto"
                justify="center"
                align="center"
                p={4}
                {...props}>
                <HStack align="center" spacing={4} pr={2}>
                    <Logo boxSize={12} />
                    <Heading as="h1" fontSize="40px">
                        Birthblock
                    </Heading>
                </HStack>
                <Spacer />
                <HStack align="center" spacing={4}>
                    <Twitter />
                    <Opensea />
                    <Etherscan />
                    {userName ? (
                        <Center as="h1" fontSize="32px" fontWeight="light">
                            {userName}
                        </Center>
                    ) : (
                        <Button
                            onClick={openWeb3Modal}
                            fontWeight="normal"
                            colorScheme="teal"
                            size="lg"
                            boxShadow="dark-lg"
                            fontSize="2xl"
                            borderRadius="full">
                            Connect
                        </Button>
                    )}
                </HStack>
            </Stack>
        </Flex>
    );
}

export default Navbar;
