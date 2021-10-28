import { Box, Button, Container, HStack, Link, Text } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';

import discordIcon from '../images/icons/discord.png';
import openSeaIcon from '../images/icons/open-sea.png';
import twitterIcon from '../images/icons/twitter.png';
import { useEthereum } from '../providers/EthereumProvider';
import { getTruncatedAddress } from '../utils/frontend';

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
                        <Link href="https://etherscan.com" isExternal>
                            <Image
                                height="51px"
                                width="51px"
                                src={discordIcon.src}
                                alt="discordIcon"
                            />
                        </Link>
                        <Image height="60px" width="60px" src={twitterIcon.src} alt="twitterIcon" />
                        <Image height="55px" width="54px" src={openSeaIcon.src} alt="openSeaIcon" />
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
