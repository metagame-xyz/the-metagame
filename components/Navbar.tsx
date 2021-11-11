import { ChevronDownIcon, EditIcon } from '@chakra-ui/icons';
import {
    Avatar,
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Spacer,
    Stack,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react';
import React from 'react';

import { useEthereum } from '@providers/EthereumProvider';

import { Etherscan, Logo, Opensea, Twitter } from '@components/Icons';

import { NETWORK } from '@utils/constants';

export const etherscanNetworkString = NETWORK.toLowerCase() == 'ethereum' ? '' : `${NETWORK}.`;

function Navbar(props) {
    const { userName, openWeb3Modal, avatarUrl } = useEthereum();

    const showName = useBreakpointValue({ base: false, md: true });

    return (
        <Flex width="100%" bgColor="transparent" boxShadow="md">
            <HStack
                as="nav"
                width="100%"
                margin="auto"
                justify="center"
                align="center"
                p={4}
                {...props}>
                <HStack align="center" spacing={2} pr={[0, 2]}>
                    <Logo boxSize={10} />
                    {showName && (
                        <Heading as="h1" fontSize="34px">
                            Birthblock
                        </Heading>
                    )}
                </HStack>
                <Spacer />
                <HStack align="center" spacing={[3, 4, 5, 6]}>
                    <Twitter />
                    <Opensea />
                    <Etherscan />
                    {userName ? (
                        <Box bgColor="teal.700" color="white" px={4} py={3} borderRadius="full">
                            <HStack>
                                {avatarUrl && <Avatar size="xs" src={`${avatarUrl}`} />}
                                <Text>{userName}</Text>
                            </HStack>
                        </Box>
                    ) : (
                        <Button
                            onClick={openWeb3Modal}
                            fontWeight="normal"
                            colorScheme="teal"
                            bg="teal.700"
                            size="lg"
                            boxShadow="lg"
                            fontSize="2xl"
                            borderRadius="full">
                            Connect
                        </Button>
                    )}
                </HStack>
            </HStack>
        </Flex>
    );
}

export default Navbar;
