import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
    Box,
    Container,
    Image,
    Link,
    ResponsiveValue,
    SimpleGrid,
    Text,
    VStack,
} from '@chakra-ui/react';
import { AlchemyProvider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Countdown, { zeroPad } from 'react-countdown';
import { BeatLoader } from 'react-spinners';

import { maxW } from '@components/Layout';

import {
    ALCHEMY_PROJECT_ID,
    BIRTHBLOCK_CONTRACT_ADDRESS,
    HEARTBEAT_CONTRACT_ADDRESS,
    networkStrings,
    TOKEN_GARDEN_CONTRACT_ADDRESS,
} from '@utils/constants';
import { copy } from '@utils/content';
import { debug, event } from '@utils/frontend';

import Birthblock from '../birthblock.json';
import BirthblockLogo from '../images/birthblockLogo.png';
import HeartbeatLogo from '../images/heartbeatLogo.png';
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

const logoSize = '100px';

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
        return <span style={{ color: '#FBB6CE' }}>Heartbeat is live!</span>;
    } else {
        // Render a countdown
        return (
            <span style={{ color: '#FBB6CE' }}>
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
const tokengardenUrl = 'https://www.tokengarden.art';
const heartbeatUrl = 'https://heartbeat.themetagame.xyz/';
const logbookUrl = 'https://logbook.themetagame.xyz/';

function Home() {
    const provider = new AlchemyProvider(1, ALCHEMY_PROJECT_ID);

    const birthblockContract = new Contract(BIRTHBLOCK_CONTRACT_ADDRESS, Birthblock.abi, provider);
    const heartbeatContract = new Contract(HEARTBEAT_CONTRACT_ADDRESS, Birthblock.abi, provider);
    const tokenGardenContract = new Contract(
        TOKEN_GARDEN_CONTRACT_ADDRESS,
        Birthblock.abi,
        provider,
    );

    const [birthblockMintCount, setBirthblockMintCount] = useState<number>(null);
    const [tokenGardenMintCount, setTokenGardenMintCount] = useState<number>(null);
    const [heartbeatMintCount, setHeartbeatMintCount] = useState<number>(null);

    // Mint Count
    useEffect(() => {
        async function getMintedCount() {
            try {
                const [bb, tg, hb] = await Promise.all([
                    birthblockContract.mintedCount(),
                    tokenGardenContract.mintedCount(),
                    heartbeatContract.mintedCount(),
                ]);
                // const birthblockMintCount: BigNumber = await birthblockContract.mintedCount();
                // const tokenGardenMintCount: BigNumber = await tokenGardenContract.mintedCount();
                // const heartbeatMintCount: BigNumber = await heartbeatContract.mintedCount();
                setBirthblockMintCount(bb.toNumber());
                setTokenGardenMintCount(tg.toNumber());
                setHeartbeatMintCount(hb.toNumber());
            } catch (error) {
                debug({ error });
            }
        }
        getMintedCount();
    }, []);

    return (
        <Box align="center">
            <Image src={Logo.src} alt="Logo" width={logoSize} height={logoSize} />
            <Head>
                <title>{copy.title}</title>
            </Head>
            <Box px={8} pb={8} width="fit-content" mx="auto" maxW={maxW}>
                <Text
                    lineHeight="shorter"
                    fontSize={[44, 54, 90]}
                    textAlign="center"
                    fontFamily={'Courier Prime'}>
                    {copy.title}
                </Text>
                <Text
                    fontSize={[16, 22, 24]}
                    fontWeight="light"
                    maxW={['container.lg']}
                    letterSpacing="-1px"
                    lineHeight="taller">
                    {copy.heroSubheading}
                    <Text>
                        {`Infrastructure for aesthetically pleasing NFTs earned by your on-chain and off-chain activity.`}
                    </Text>
                </Text>
            </Box>
            <Box width="fit-content" margin="auto" maxW={maxW}>
                <Text
                    fontSize={[16, 22, 24]}
                    pb={[0, 0, 0, 8]}
                    fontWeight="light"
                    maxW={['container.lg']}>
                    {copy.heroSubheading3}
                </Text>
            </Box>
            <Box px={8} py={4} width="fit-content" margin="auto" maxW={maxW}>
                <SimpleGrid columns={[1, 1, 1, 3]} align="center" spacingX={24} spacingY={12}>
                    {/**** BIRTHBLOCK ****/}
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
                                <Text fontFamily={'Courier Prime'} fontSize={'4xl'}>
                                    {copy.heading1}
                                </Text>
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
                            <Link isExternal href={birthblockUrl} color={'teal.200'}>
                                {copy.text1} <ExternalLinkIcon />
                            </Link>
                        </Text>
                    </VStack>
                    {/**** TOKEN GARDEN ****/}
                    <VStack maxW={about.maxW}>
                        <Box>
                            <Link isExternal href={tokengardenUrl}>
                                <Image
                                    src={TokenGardenLogo.src}
                                    alt={copy.heading2}
                                    width={about.imgSize}
                                    height={about.imgSize}
                                />
                            </Link>
                        </Box>
                        <Box fontSize={about.fontSize}>
                            <Link isExternal href={tokengardenUrl}>
                                <Text fontFamily={'Courier Prime'} fontSize={'4xl'}>
                                    {copy.heading2}
                                </Text>
                            </Link>
                        </Box>
                        {!tokenGardenMintCount ? (
                            <BeatLoader color={'#FAF5FF'} size={8} speedMultiplier={0.5} />
                        ) : (
                            <Text align={about.align}>
                                {tokenGardenMintCount} Token Gardens minted
                            </Text>
                        )}
                        <Text align={about.align}>
                            <Link isExternal href={tokengardenUrl} color={'purple.200'}>
                                {copy.text2} <ExternalLinkIcon />
                            </Link>
                        </Text>
                    </VStack>
                    {/**** THIRD NFT ****/}
                    <VStack maxW={about.maxW}>
                        <Box>
                            <Image
                                src={HeartbeatLogo.src}
                                alt={copy.heading3}
                                width={about.imgSize}
                                height={about.imgSize}
                            />
                        </Box>
                        <Box fontSize={about.fontSize}>
                            <Text fontFamily={'Courier Prime'} fontSize={'4xl'}>
                                {copy.heading3}
                            </Text>
                        </Box>
                        {!heartbeatMintCount ? (
                            <BeatLoader color={'#FFF5F7'} size={8} speedMultiplier={0.5} />
                        ) : (
                            <Text align={about.align}>{heartbeatMintCount} Heartbeats minted</Text>
                        )}
                        <Link isExternal href={heartbeatUrl} color={'pink.200'}>
                            {copy.text3} <ExternalLinkIcon />
                        </Link>
                    </VStack>
                </SimpleGrid>
            </Box>
            <Box width="fit-content" margin="auto" maxW={maxW} pt={16}>
                <Text
                    fontSize={[16, 22, 24]}
                    pb={[0, 0, 0, 8]}
                    fontWeight="light"
                    maxW={['container.lg']}>
                    {`Phase Two: Human Readable Web3 Activity`}
                </Text>
                <Box w="600px">
                    <Image src={'/assets/logbookLogo.svg'} alt="Logbook Logo" />
                </Box>
                <Text
                    fontSize={[10, 12, 14]}
                    pt={3}
                    pb={[0, 0, 0, 6]}
                    fontWeight="light"
                    fontStyle={'italic'}
                    maxW={['container.lg']}>
                    Powered by{' '}
                    <Link
                        isExternal
                        href={`https://twitter.com/BrennerSpear/status/1552091025887281152`}>
                        evm-translator
                    </Link>
                </Text>

                <Text
                    fontSize={[14, 16, 18]}
                    // pb={[0, 0, 0, 8]}
                    fontWeight="light"
                    maxW={['container.lg']}>
                    Minting is open now!
                </Text>
                <Link isExternal href={logbookUrl} color={'#C84414'}>
                    {copy.text3} <ExternalLinkIcon />
                </Link>
            </Box>
        </Box>
    );
}

export default Home;
