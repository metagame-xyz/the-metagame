import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Button, Heading, Link, SimpleGrid, Spacer, Text, VStack } from '@chakra-ui/react';
import { parseEther } from '@ethersproject/units';
import { BigNumber, Contract } from 'ethers';
import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { useEthereum, wrongNetworkToast } from '@providers/EthereumProvider';

import { maxW } from '@components/Layout';

import { CONTRACT_ADDRESS, networkStrings } from '@utils/constants';
import { copy } from '@utils/content';
import { debug, event } from '@utils/frontend';

import Birthblock from '../birthblock.json';
import BirthblockLogo from '../images/birthblockLogo.png';
import Logo from '../images/logo.png';
import TokenGardenLogo from '../images/tokenGardenLogo2.png';

function About({ heading, text, image }) {
    const imgSize = '144px';
    return (
        <VStack maxW={['sm', 'md', 'md', 'full']}>
            <Box>
                <Image src={image.src} alt={heading} width={imgSize} height={imgSize} />
            </Box>
            <Box fontSize="24px">
                <Heading>{heading}</Heading>
            </Box>
            <Text align={['center', 'center', 'center', 'left']}>{text}</Text>
        </VStack>
    );
}

const toastErrorData = (title: string, description: string) => ({
    title,
    description,
    status: 'error',
    position: 'top',
    duration: 8000,
    isClosable: true,
});

function openseaLink(tokenId: number): string {
    return `https://${networkStrings.opensea}opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId}`;
}

const blackholeAddress = '0x0000000000000000000000000000000000000000';

function Home() {
    const { provider, signer, userAddress, userName, eventParams, openWeb3Modal, toast } =
        useEthereum();

    const birthblockContract = new Contract(CONTRACT_ADDRESS, Birthblock.abi, provider);

    let [mintCount, setMintCount] = useState<number>(null);
    let [freeMints, setFreeMints] = useState<number>(144);

    // Mint Count
    useEffect(() => {
        async function getMintedCount() {
            try {
                const mintCount: BigNumber = await birthblockContract.mintedCount();
                setMintCount(mintCount.toNumber());
            } catch (error) {
                debug({ error });
            }
        }
        getMintedCount();
    }, []);

    const logoSize = '144px';

    return (
        <Box align="center">
            <Image src={Logo.src} alt="Logo" width={logoSize} height={logoSize} />
            <Head>
                <title>{copy.title}</title>
            </Head>
            <Box px={8} pt={4} pb={8} width="fit-content" mx="auto" maxW={maxW}>
                <Heading as="h1" fontSize={[54, 72, 96]} textAlign="center">
                    {copy.title}
                </Heading>
                <Text fontSize={[16, 22, 30]} fontWeight="light" maxW={['container.lg']}>
                    {copy.heroSubheading}
                </Text>
            </Box>
            <Box width="fit-content" margin="auto" maxW={maxW}>
                <Text
                    fontSize={[16, 22, 30]}
                    pb={[0, 0, 0, 8]}
                    fontWeight="light"
                    maxW={['container.lg']}>
                    {copy.heroSubheading2}
                </Text>
            </Box>
            <Box px={8} py={8} width="fit-content" margin="auto" maxW={maxW}>
                <SimpleGrid columns={[1, 1, 1, 3]} align="center" spacingX={24} spacingY={12}>
                    <About heading={copy.heading1} text={copy.text1} image={BirthblockLogo} />
                    <About heading={copy.heading2} text={copy.text2} image={TokenGardenLogo} />
                    <About heading={copy.heading3} text={copy.text3} image={TokenGardenLogo} />
                </SimpleGrid>
            </Box>
            <Box px={8} pt={8} pb={20} width="fit-content" margin="auto" maxW={maxW}>
                <Text mt={4} fontWeight="light" maxW="xl">
                    {copy.bottomSectionText}
                    <Link isExternal href={'https://twitter.com/The_Metagame'}>
                        @The_Metagame
                    </Link>
                </Text>
            </Box>
        </Box>
    );
}

export default Home;
