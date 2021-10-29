import { Box, Button, Container, HStack, Link, Text } from '@chakra-ui/react';
import { Etherscan, Opensea, Twitter } from 'images/icons';
import React from 'react';

import { useEthereum } from '@providers/EthereumProvider';

import { CONTRACT_ADDRESS, NETWORK } from '@utils/constants';
import { getTruncatedAddress } from '@utils/frontend';

export const etherscanNetworkString = NETWORK.toLowerCase() == 'ethereum' ? '' : `${NETWORK}.`;

function Navbar() {
    const { userAddress, ensName, openWeb3Modal } = useEthereum();

    const userName = ensName || getTruncatedAddress(userAddress);

    const etherscanUrl = `https://${etherscanNetworkString}etherscan.io/address/${CONTRACT_ADDRESS}`;
    const twitterUrl = 'https://twitter.com/brennerspear';
    const openseaUrl = `https://testnets.opensea.io/collection/birthblock-ywaqkwbxvq`;

    const iconSize = 12;

    return (
        <Box as="header" paddingTop="40px">
            <Container maxW={1280}>
                <Box d="flex" width="100%" justifyContent="space-between">
                    <Text as="h1" fontSize="50px" fontWeight="light">
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
                </Box>
            </Container>
        </Box>
    );
}

export default Navbar;
