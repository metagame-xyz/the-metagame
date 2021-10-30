import { Box, Button, Flex, HStack, Link, Stack, Text } from '@chakra-ui/react';
import React from 'react';

import { useEthereum } from '@providers/EthereumProvider';

import { Etherscan, Logo, Opensea, Twitter } from '@components/Icons';

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

    function IconLink({ Icon, url }) {
        return (
            <Link href={url} isExternal>
                <Icon boxSize={8} />
            </Link>
        );
    }

    return (
        <Flex
            as="navbar"
            width="100%"
            justify="space-between"
            align="center"
            wrap="wrap"
            py={4}
            px={4}
            {...props}>
            <HStack spacing={4} align="center" pr={2}>
                <Logo h={iconSize} w={iconSize} />
                <Text align="center" as="h1" fontSize="50px" fontWeight="light">
                    Birthblock
                </Text>
            </HStack>
            <Stack wrap="wrap" direction={['column', 'row', 'row', 'row']}>
                <HStack align="center" spacing={4}>
                    <IconLink Icon={Twitter} url={twitterUrl} />
                    <IconLink Icon={Opensea} url={openseaUrl} />
                    <IconLink Icon={Etherscan} url={etherscanUrl} />
                </HStack>
                {!userAddress && (
                    <Button
                        onClick={openWeb3Modal}
                        fontWeight={'300'}
                        colorScheme="teal"
                        size="lg"
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
            </Stack>
        </Flex>
    );
}

export default Navbar;
