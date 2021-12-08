import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Heading,
    Link,
    ResponsiveValue,
    SimpleGrid,
    Spacer,
    Text,
    VStack,
} from '@chakra-ui/react';
import { parseEther } from '@ethersproject/units';
import { BigNumber, Contract } from 'ethers';
import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Countdown, { zeroPad } from 'react-countdown';
import { BeatLoader } from 'react-spinners';

import { useEthereum, wrongNetworkToast } from '@providers/EthereumProvider';

import { TwitterLogo } from '@components/Icons';
import { maxW } from '@components/Layout';

import { BIRTHBLOCK_CONTRACT_ADDRESS, networkStrings } from '@utils/constants';
import { copy } from '@utils/content';
import { debug, event } from '@utils/frontend';

import Birthblock from '../birthblock.json';
import BirthblockLogo from '../images/birthblockLogo.png';
import Logo from '../images/logo.png';
import QuestionMark from '../images/questionMark.png';
import TokenGardenLogo from '../images/tokenGardenLogo.png';

type About = {
    maxW: string[];
    fontSize: string;
    align: ResponsiveValue<'left' | 'center' | 'right'>;
    imgSize: string;
};

const about: About = {
    maxW: ['sm', 'md', 'md', 'full'],
    fontSize: '24px',
    align: ['center', 'center', 'center', 'left'],
    imgSize: '144px',
};

// Renderer callback with condition
const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    const dayStr = (d) => {
        if (d === 1) {
            return `${d} day `;
        } else if (d === 0) {
            return '';
        } else {
            return `${d} days `;
        }
    };
    if (completed) {
        // Render a completed state
        return <span>Token Garden is live!</span>;
    } else {
        // Render a countdown
        return (
            <span>
                {dayStr(days)}
                {zeroPad(hours)}h {zeroPad(minutes)}m {zeroPad(seconds)}s
            </span>
        );
    }
};

const toastErrorData = (title: string, description: string) => ({
    title,
    description,
    status: 'error',
    position: 'top',
    duration: 8000,
    isClosable: true,
});

function openseaLink(tokenId: number): string {
    return `https://${networkStrings.opensea}opensea.io/assets/${BIRTHBLOCK_CONTRACT_ADDRESS}/${tokenId}`;
}

const birthblockUrl = 'https://www.birthblock.art';

function Home() {
    const { provider } = useEthereum();

    const birthblockContract = new Contract(BIRTHBLOCK_CONTRACT_ADDRESS, Birthblock.abi, provider);

    let [birthblockMintCount, setBirthblockMintCount] = useState<number>(null);

    // Mint Count
    useEffect(() => {
        async function getMintedCount() {
            try {
                const birthblockMintCount: BigNumber = await birthblockContract.mintedCount();
                setBirthblockMintCount(birthblockMintCount.toNumber());
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
                    <VStack maxW={about.maxW}>
                        <Box>
                            <Link isExternal href={birthblockUrl}>
                                <Image
                                    src={BirthblockLogo.src}
                                    alt={copy.heading1}
                                    width={about.imgSize}
                                    height={about.imgSize}
                                />
                            </Link>
                        </Box>
                        <Box fontSize={about.fontSize}>
                            <Link isExternal href={birthblockUrl}>
                                <Heading>{copy.heading1}</Heading>
                            </Link>
                        </Box>
                        {!birthblockMintCount ? (
                            <BeatLoader color={'#FAF5FF'} size={8} speedMultiplier={0.5} />
                        ) : (
                            <Text align={about.align}>
                                {birthblockMintCount} Birthblocks minted
                            </Text>
                        )}
                        <Text align={about.align}>
                            <Link isExternal href={birthblockUrl}>
                                {copy.text1} <ExternalLinkIcon />
                            </Link>
                        </Text>
                    </VStack>
                    <VStack maxW={about.maxW}>
                        <Box>
                            <Image
                                src={TokenGardenLogo.src}
                                alt={copy.heading2}
                                width={about.imgSize}
                                height={about.imgSize}
                            />
                        </Box>
                        <Box fontSize={about.fontSize}>
                            <Heading>{copy.heading2}</Heading>
                        </Box>
                        <Text fontWeight="bold" align={about.align}>
                            {copy.text2}
                        </Text>
                        <Countdown date={1639692000000} renderer={countdownRenderer} />
                    </VStack>
                    <VStack maxW={about.maxW}>
                        <Box>
                            <Image
                                src={QuestionMark.src}
                                alt={copy.heading3}
                                width={about.imgSize}
                                height={about.imgSize}
                            />
                        </Box>
                        <Box fontSize={about.fontSize}>
                            <Heading>{copy.heading3}</Heading>
                        </Box>
                    </VStack>
                </SimpleGrid>
            </Box>
            <Box p={8} width="fit-content" margin="auto" maxW={maxW}>
                <Text mt={4} fontWeight="light" maxW="xl">
                    <Link isExternal href={'https://twitter.com/The_Metagame'}>
                        {copy.bottomSectionText}
                        <TwitterLogo boxSize={4} />
                    </Link>
                </Text>
            </Box>
            <Spacer />
        </Box>
    );
}

export default Home;
