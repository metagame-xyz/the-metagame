import { Box, Button, Center, Flex, HStack, Link, Spacer, Stack, Text } from '@chakra-ui/react';
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

    function IconLink({ Icon, url }) {
        return (
            <Link href={url} isExternal>
                <Icon boxSize={[8, 8, 12, 12]} />
            </Link>
        );
    }

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
                    <Text align="center" as="h1" fontSize="48px" fontWeight="light">
                        Birthblock
                    </Text>
                </HStack>
                <Spacer Stack={[0, 0, 1, 1]} />
                <HStack align="center" spacing={4}>
                    <IconLink Icon={Twitter} url={twitterUrl} />
                    <IconLink Icon={Opensea} url={openseaUrl} />
                    <IconLink Icon={Etherscan} url={etherscanUrl} />
                    {userAddress ? (
                        <Center as="h1" fontSize="32px" fontWeight="light">
                            {userName}
                        </Center>
                    ) : (
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
                </HStack>
            </Stack>
        </Flex>
    );
}

export default Navbar;
