import { Box, Button, Heading, Stack, StackDivider, Text, VStack } from '@chakra-ui/react';
import { parseEther } from '@ethersproject/units';
import { BigNumber, Contract } from 'ethers';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { useEthereum } from '@providers/EthereumProvider';

import Navbar from '@components/Navbar';

import { CONTRACT_ADDRESS } from '@utils/constants';
import { debug } from '@utils/frontend';

import Birthblock from '../birthblock.json';
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
        <VStack maxW={['md', 'sm', 'md', 'full']}>
            <Heading as="h2" fontSize="24px">
                {heading}
            </Heading>
            <Text>{text}</Text>
        </VStack>
    );
}

function Ui() {
    const { provider, signer, userAddress, openWeb3Modal } = useEthereum();

    const birthblockContract = new Contract(CONTRACT_ADDRESS, Birthblock.abi, provider);

    let [minted, setMinted] = useState(false);
    let [minting, setMinting] = useState(false);
    let [freeMintsLeft, setFreeMintsLeft] = useState<number>(null);
    let [freeMints, _setFreeMints] = useState<number>(null);

    const freeMintsRef = React.useRef<number>(freeMints);
    const setFreeMints = (value: number) => {
        freeMintsRef.current = value;
        _setFreeMints(value);
    };

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
        getMintedCount();

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

    const mintsLeftText = () => {
        return `${freeMintsLeft}/144 Free Mints Left`;
    };

    return (
        <Box
            align="center"
            // justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
            direction={{ base: 'column-reverse', md: 'row' }}
            wrap="no-wrap"
            minH="70vh"
            px={8}
            backgroundColor="#B9EBEB">
            <Box pt={8} width="fit-content" mx="auto">
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

            <Box mx={4} mt={20}>
                <Stack
                    direction={['column', 'column', 'column', 'row']}
                    align="center"
                    spacing={8}
                    // shouldWrapChildren
                >
                    <About heading={heading1} text={text1} />
                    <About heading={heading2} text={text2} />
                    <About heading={heading3} text={text3} />
                </Stack>
            </Box>

            <VStack justifyContent="center" mt={20} py={10} bgColor="#00B8B6">
                <Text fontWeight="light" fontSize="54px">
                    {freeMintsLeft}/{freeMints} free mints left
                </Text>

                <Button
                    onClick={userAddress ? mint : openWeb3Modal}
                    mt={10}
                    fontWeight={'300'}
                    colorScheme="teal"
                    width={250}
                    height={20}
                    boxShadow="0px 3px 6px rgba(0, 0, 0, 0.160784);"
                    fontSize={32}
                    borderRadius={56}>
                    {userAddress ? mintText() : 'Connect Wallet'}
                </Button>
            </VStack>
        </Box>
    );
}

export default Ui;
