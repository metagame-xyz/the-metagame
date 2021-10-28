import { Box, Button, Container, HStack, Link, Text } from '@chakra-ui/react';
// import { Etherscan, Opensea, Twitter } from 'images/icons';
import Image from 'next/image';
import React from 'react';

import etherscanIcon from '../images/icons/etherscan.svg';
import openseaIcon from '../images/icons/opensea.svg';
import twitterIcon from '../images/icons/twitter.svg';
import { useEthereum } from '../providers/EthereumProvider';
import { CONTRACT_ADDRESS, NETWORK } from '../utils/constants';
import { getTruncatedAddress } from '../utils/frontend';

export const etherscanNetworkString = NETWORK.toLowerCase() == 'ethereum' ? '' : `${NETWORK}.`;

function Navbar() {
    const { userAddress, ensName, openWeb3Modal } = useEthereum();

    const userName = ensName || getTruncatedAddress(userAddress);

    return (
        <Box as="header" paddingTop="40px">
            <Container maxW={1280}>
                <Box d="flex" width="100%" justifyContent="space-between">
                    <Text as="h1" fontSize="50px" fontWeight="light">
                        Birthblock
                    </Text>
                    <HStack align="center" spacing="20px">
                        <Link
                            href={`https://${etherscanNetworkString}etherscan.io/address/${CONTRACT_ADDRESS}`}
                            isExternal>
                            <Image
                                height="48px"
                                width="48px"
                                src={etherscanIcon}
                                alt="etherscanIcon"
                            />
                        </Link>
                        <Link href="https://twitter.com/brennerspear" isExternal>
                            <Image height="48px" width="48px" src={twitterIcon} alt="twitterIcon" />
                        </Link>
                        <Link
                            href="https://testnets.opensea.io/collection/birthblock-ywaqkwbxvq"
                            isExternal>
                            <Image height="48px" width="48px" src={openseaIcon} alt="openseaIcon" />
                        </Link>
                        {/* <Twitter h={48} w={48} href="https://twitter.com/brennerspear" /> */}
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
