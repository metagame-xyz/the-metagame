import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, Link, Stack, Text, VStack } from '@chakra-ui/react';
import { parseEther } from '@ethersproject/units';
import { BigNumber, Contract } from 'ethers';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { useEthereum } from '@providers/EthereumProvider';

import { maxW } from '@components/Layout';

import { CONTRACT_ADDRESS, NETWORK } from '@utils/constants';
import { debug } from '@utils/frontend';

import Birthblock from '../birthblock.json';
import bg from '../images/background.png';
import BirthblockImage from '../images/example-birthblock.svg';

const heading1 = 'Unlimited Total Mints, One Mint per Wallet';
const text1 =
    'As fair of a mint process as possible. No need to rush to mint, no gas wars, open to literally every wallet on Ethereum.';
const heading2 = 'Natural Scarcity';
const text2 =
    'The number of possible Birthblock NFTs with 100+ rings is set by existing on-chain data, not artificially set.';
const heading3 = 'Earned';
const text3 =
    'Part of the infant category of earned NFTs. You earn attributes based on your actions. The older your wallet is, the bigger your tree will be.';

function About({ heading, text }) {
    return (
        <VStack maxW={['sm', 'md', 'md', 'full']}>
            <Heading as="h2" fontSize="24px">
                {heading}
            </Heading>
            <Text>{text}</Text>
        </VStack>
    );
}

function openseaLink(tokenId: number) {
    const network = NETWORK == 'ethereum' ? '' : 'testnets.';
    return `https://${network}opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId}`;
}

function Ui({}) {
    const { provider, signer, userAddress, userName, openWeb3Modal } = useEthereum();

    console.log('userName', userName);
    console.log('userAddress', userAddress);

    const birthblockContract = new Contract(CONTRACT_ADDRESS, Birthblock.abi, provider);

    let [minted, setMinted] = useState(false);
    let [minting, setMinting] = useState(false);
    let [userTokenId, setUserTokenId] = useState<number>(null);

    let [freeMintsLeft, setFreeMintsLeft] = useState<number>(0);
    let [freeMints, _setFreeMints] = useState<number>(144);

    const freeMintsRef = React.useRef<number>(freeMints);
    const setFreeMints = (value: number) => {
        freeMintsRef.current = value;
        _setFreeMints(value);
    };

    useEffect(() => {
        console.log('getUserMintedTokenId');
        async function getUserMintedTokenId() {
            try {
                if (userAddress) {
                    const filter = birthblockContract.filters.Mint(userAddress);
                    const data = await birthblockContract.queryFilter(filter);
                    for (const event of data) {
                        console.log('event:', event.args);
                        const tokenId = event.args[1].toNumber();
                        setUserTokenId(tokenId);
                        break;
                    }
                }
            } catch (error) {
                debug({ error });
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
                setFreeMints(freeMints.toNumber());
                setFreeMintsLeft(freeMints.toNumber() - mintCount.toNumber());
            } catch (error) {
                debug({ error });
            }

            // console.log('getMintedCount async finish');
        }
        // getMintedCount();

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
            setMinting(false);
            // no from specified
            console.log(error);
            console.log(error?.error?.message);
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
        } else if (freeMintsLeft) {
            return (
                <Text fontWeight="light" fontSize={['2xl', '3xl']}>
                    {`${freeMintsLeft}/${freeMints} free mints left`}
                </Text>
            );
        } else {
            return (
                <div>
                    <Text fontWeight="light" fontSize={['xl', '2xl']}>
                        0.01 ETH to mint
                    </Text>
                    <Text fontWeight="light" fontSize={['sm', 'md']}>
                        {`(All ${freeMintsRef.current} free mints have been minted)`}
                    </Text>
                </div>
            );
        }
    };

    const mintsLeftText = () => {
        return `${freeMintsLeft}/144 Free Mints Left`;
    };

    return (
        <Box align="center">
            <Box px={8} pt={8} width="fit-content" mx="auto" maxW={maxW}>
                <Heading as="h1" fontSize={[72, 84, 144]} fontWeight="bold" textAlign="center">
                    Birthblock
                </Heading>
                <Text fontSize={[24, 24, 36]} fontWeight="light">
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

            <Box px={8} width="fit-content" margin="auto" maxW={maxW}>
                <Stack
                    direction={['column', 'column', 'column', 'row']}
                    align="center"
                    spacing={16}>
                    <About heading={heading1} text={text1} />
                    <About heading={heading2} text={text2} />
                    <About heading={heading3} text={text3} />
                </Stack>
            </Box>

            <VStack minH="xs" justifyContent="center" spacing={4} mt={12} px={4} bgColor="#00B8B6">
                {!minted && !userTokenId ? (
                    <Button
                        onClick={userAddress ? mint : openWeb3Modal}
                        isLoading={minting}
                        loadingText="Minting..."
                        isDisabled={minted}
                        fontWeight="normal"
                        colorScheme="teal"
                        size="lg"
                        height="60px"
                        minW="xs"
                        boxShadow="0px 3px 6px rgba(0, 0, 0, 0.160784);"
                        fontSize="4xl"
                        borderRadius={60}>
                        {userAddress ? mintText() : 'Connect Wallet'}
                    </Button>
                ) : (
                    <Text fontSize={[24, 24, 36]}>
                        {`${userName}'s Birthblock (#${userTokenId}) has been minted. `}
                        <Link isExternal href={openseaLink(userTokenId)}>
                            View on Opensea <ExternalLinkIcon />
                        </Link>
                    </Text>
                )}
                {textUnderButton()}
            </VStack>
        </Box>
    );
}

export default Ui;
