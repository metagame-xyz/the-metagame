import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Button, Heading, Link, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { parseEther } from '@ethersproject/units';
import { BigNumber, Contract } from 'ethers';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { ethersNetworkString, useEthereum, wrongNetworkToast } from '@providers/EthereumProvider';

import { maxW } from '@components/Layout';

import { CONTRACT_ADDRESS, NETWORK } from '@utils/constants';
import { debug } from '@utils/frontend';

import Birthblock from '../birthblock.json';
import BirthblockImage from '../images/example-birthblock.svg';

const heading1 = 'Minted Fairly';
const text1 =
    'Unlimited total mints with one mint per wallet. No rush to mint, no gas wars, and open to everyone.';
const heading2 = 'Naturally Scarce';
const text2 =
    'The number of possible Birthblock NFTs with 100+ rings is set by existing on-chain data instead of by an artificial limit.';
const heading3 = 'Earned';
const text3 =
    'Part of the infant category of earned NFTs where you earn attributes based on your actions. The older your wallet, the bigger your tree.';
const bottomSectonHeading = 'The Metagame';
const bottomSectionText =
    'Birthblock is the first NFT in an infinite series of achievements you earn by playing a game many of us are already playing whether we know it or not: The Metagame. These earned achievements will allow access to private spaces gated by shared experiences. Each achievement will contribute to leveling up your character. Follow along: ';

function About({ heading, text }) {
    return (
        <VStack maxW={['sm', 'md', 'md', 'full']}>
            <Heading as="h2" fontSize="24px">
                {heading}
            </Heading>
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

function openseaLink(tokenId: number) {
    const network = NETWORK == 'ethereum' ? '' : 'testnets.';
    return `https://${network}opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId}`;
}

const blackholeAddress = '0x0000000000000000000000000000000000000000';

function Home() {
    const { provider, signer, userAddress, userName, openWeb3Modal, toast } = useEthereum();

    const birthblockContract = new Contract(CONTRACT_ADDRESS, Birthblock.abi, provider);

    let [minted, setMinted] = useState(false);
    let [minting, setMinting] = useState(false);
    let [userTokenId, setUserTokenId] = useState<number>(null);

    let [freeMintsLeft, setFreeMintsLeft] = useState<number>(null);
    let [mintCount, setMintCount] = useState<number>(null);
    let [freeMints, _setFreeMints] = useState<number>(144);

    const freeMintsRef = React.useRef<number>(freeMints);
    const setFreeMints = (value: number) => {
        freeMintsRef.current = value;
        _setFreeMints(value);
    };

    useEffect(() => {
        console.log('getUserMintedTokenId');
        async function getUserMintedTokenId() {
            // userAddress has changed. TokenId defaults to null
            let tokenId = null;
            try {
                if (userAddress) {
                    const filter = birthblockContract.filters.Transfer(
                        blackholeAddress,
                        userAddress,
                    );
                    const [event] = await birthblockContract.queryFilter(filter); // get first event, should only be one
                    if (event) {
                        tokenId = event.args[2].toNumber();
                    }
                }
            } catch (error) {
                toast(toastErrorData('Get User Minted Token Error', JSON.stringify(error)));
                debug({ error });
            } finally {
                // set it either to null, or to the userAddres's tokenId
                setUserTokenId(tokenId);
            }
        }
        getUserMintedTokenId();
    }, [userAddress]);

    // Mint Count
    useEffect(() => {
        console.log('subscribe effect');

        async function getMintedCount() {
            try {
                console.log('via load');
                const mintCount: BigNumber = await birthblockContract.mintedCount();
                const freeMints: BigNumber = await birthblockContract.freeMints();
                setMintCount(mintCount.toNumber());
                setFreeMints(freeMints.toNumber());
                setFreeMintsLeft(freeMints.toNumber() - mintCount.toNumber());
            } catch (error) {
                debug({ error });
            }
        }
        getMintedCount();

        birthblockContract.removeAllListeners();

        birthblockContract.on('Mint', (address: string, tokenId: BigNumber) => {
            console.log('via subscribe');

            debug({ address });
            debug({ tokenId });
            console.log('freeMints', freeMintsRef.current);
            console.log('tokenId', tokenId.toNumber());
            console.log('math', freeMints - tokenId.toNumber());
            setFreeMintsLeft(freeMintsRef.current - tokenId.toNumber());
        });
    }, []);

    const mint = async () => {
        const network = await provider.getNetwork();
        if (network.name != ethersNetworkString) {
            toast(wrongNetworkToast);
            return;
        }

        setMinting(true);
        console.log('contract address:', CONTRACT_ADDRESS);
        const birthblockContractWritable = birthblockContract.connect(signer);
        const value = freeMintsLeft ? '0' : parseEther('0.01');
        try {
            const data = await birthblockContractWritable.mint({ value });
            const moreData = await data.wait();
            debug({ moreData });
            const [_, address, tokenId] = moreData.events.find((e) => (e.event = 'Mint')).args;
            console.log('minted', address, tokenId);
            setUserTokenId(tokenId.toNumber());

            setMinting(false);
            setMinted(true);
        } catch (error) {
            // const { reason, code, error, method, transaction } = error
            setMinting(false);
            if (error?.error?.message) {
                toast(toastErrorData(error.reason, error.error.message));
            }
        }
    };

    const mintText = () => {
        if (!minting && !minted) {
            return 'Mint';
        } else if (minting) {
            return 'Minting...';
        } else if (minted) {
            return 'Minted';
        } else {
            return 'wtf';
        }
    };

    const textUnderButton = () => {
        if (userTokenId) {
            return <></>;
        } else if (freeMintsLeft === null || freeMintsLeft > 0) {
            return (
                <Text fontWeight="light" fontSize={['2xl', '3xl']} color="white">
                    {`${freeMintsLeft || '?'}/${freeMints} free mints left`}
                </Text>
            );
        } else {
            return (
                <div>
                    <Text fontWeight="light" fontSize={['xl', '2xl']} color="white">
                        0.01 ETH to mint
                    </Text>
                    <Text fontWeight="light" fontSize={['sm', 'md']} color="white">
                        {`${mintCount} Birthblocks have been minted`}
                    </Text>
                </div>
            );
        }
    };

    return (
        <Box align="center">
            <Box px={8} pt={8} width="fit-content" mx="auto" maxW={maxW}>
                <Heading as="h1" fontSize={[54, 72, 96]} textAlign="center" color="teal.900">
                    Birthblock
                </Heading>
                <Text fontSize={[16, 22, 30]} fontWeight="light" maxW={['container.md']}>
                    An NFT with art and attributes based on the data from your first transaction on
                    Ethereum
                </Text>
                <Image
                    src={BirthblockImage.src}
                    alt="birthblock image"
                    width="432px"
                    height="432px"
                />
            </Box>

            <Box px={8} py={8} width="fit-content" margin="auto" maxW={maxW}>
                <SimpleGrid columns={[1, 1, 1, 3]} align="center" spacing={16}>
                    <About heading={heading1} text={text1} />
                    <About heading={heading2} text={text2} />
                    <About heading={heading3} text={text3} />
                </SimpleGrid>
            </Box>

            <VStack justifyContent="center" spacing={4} px={4} py={8} bgColor="teal.700">
                {!minted && !userTokenId ? (
                    <Button
                        onClick={userAddress ? mint : openWeb3Modal}
                        isLoading={minting}
                        loadingText="Minting..."
                        isDisabled={minted}
                        fontWeight="normal"
                        colorScheme="teal"
                        bgColor="teal.600"
                        // color="teal.900"
                        _hover={{ bg: 'teal.500' }}
                        size="lg"
                        height="60px"
                        minW="xs"
                        boxShadow="lg"
                        fontSize="4xl"
                        borderRadius="full">
                        {userAddress ? mintText() : 'Connect Wallet'}
                    </Button>
                ) : (
                    <Box fontSize={[24, 24, 36]} color="white">
                        <Text>{`${userName}'s Birthblock (#${userTokenId}) has been minted.`}</Text>
                        <Button
                            colorScheme="teal"
                            color="white"
                            variant="outline"
                            _hover={{ bgColor: 'teal.600' }}
                            _active={{ bgColor: 'teal.500' }}
                            mt={2}
                            size="lg"
                            rightIcon={<ExternalLinkIcon />}
                            onClick={() => window.open(openseaLink(userTokenId))}>
                            View on Opensea
                        </Button>
                    </Box>
                )}
                {textUnderButton()}
            </VStack>
            <Box px={8} py={20} width="fit-content" margin="auto" maxW={maxW}>
                <Heading as="h1" fontSize={['24', '24', '36']} textAlign="center">
                    {bottomSectonHeading}
                </Heading>
                <Text mt={4} fontWeight="light" maxW="xl">
                    {bottomSectionText}
                    <Link isExternal href={'https://twitter.com/The_Metagame'}>
                        @The_Metagame
                    </Link>
                </Text>
            </Box>
        </Box>
    );
}

export default Home;
