import { Box, Button, Container, Flex, HStack, Link, Text } from '@chakra-ui/react';
import React from 'react';

import { useEthereum } from '@providers/EthereumProvider';

import { Etherscan, Opensea, Twitter } from '@components/Icons';

import { CONTRACT_ADDRESS, NETWORK } from '@utils/constants';
import { getTruncatedAddress } from '@utils/frontend';

export const etherscanNetworkString = NETWORK.toLowerCase() == 'ethereum' ? '' : `${NETWORK}.`;

function Navbar(props) {
    const { userAddress, ensName, openWeb3Modal } = useEthereum();

    const userName = ensName || getTruncatedAddress(userAddress);

    const etherscanUrl = `https://${etherscanNetworkString}etherscan.io/address/${CONTRACT_ADDRESS}`;
    const twitterUrl = 'https://twitter.com/brennerspear';
    const openseaUrl = `https://testnets.opensea.io/collection/birthblock-ywaqkwbxvq`;

    const iconSize = 12;

    return (
        <Flex
            as="navbar"
            width="100%"
            justify="space-between"
            align="center"
            wrap="wrap"
            py={4}
            px={8}
            {...props}>
            <Text align="center" as="h1" fontSize="50px" fontWeight="light">
                Birthblock
            </Text>
            <HStack align="center" spacing="20px">
                <Link href={twitterUrl} isExternal>
                    <Twitter h={iconSize} w={iconSize} />
                </Link>
                <Link href={openseaUrl} isExternal>
                    <Opensea h={iconSize} w={iconSize} />
                </Link>
                <Link href={etherscanUrl} isExternal>
                    <Etherscan h={iconSize} w={iconSize} />
                </Link>
                {!userAddress && (
                    <Button
                        onClick={openWeb3Modal}
                        fontWeight={'300'}
                        colorScheme="teal"
                        width={209}
                        height={59}
                        fontSize={28}
                        borderRadius={30}>
                        Connect
                    </Button>
                )}
                {userAddress && (
                    <Text as="h1" fontSize="32px" fontWeight="light">
                        {userName}
                    </Text>
                )}
            </HStack>
        </Flex>
    );
}

export default Navbar;
