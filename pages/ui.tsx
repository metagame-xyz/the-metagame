import React from 'react';
import { Box, Button, Container, Grid, Heading, Text, VStack } from '@chakra-ui/react';
import Navbar from '@components/Navbar';

function Ui() {
    return (
        <Box backgroundColor="#B9EBEB">
            <Navbar />
            <Box mt={20} width="fit-content" mx="auto">
                <Heading as="h1" fontSize={144} fontWeight="normal" textAlign="center">
                    Birthblock
                </Heading>
                <Text fontSize={36} fontWeight="light">
                    An NFT with art and attributes based on the data from your first transaction on{' '}
                    <br />
                    Ethereum
                </Text>
            </Box>

            <Container maxW={1280} mt={20}>
                <Grid
                    fontSize="24px"
                    fontWeight="light"
                    rowGap="10px"
                    justifyContent="space-between"
                    templateRows="repeat(2, auto)"
                    templateColumns="repeat(3, 30%)"
                    gridAutoFlow="column">
                    <Heading as="h2" fontSize="24px">
                        Unlimited Total Mints, One Mint per Wallet
                    </Heading>
                    <Text>
                        As fair of a mint process as possible. No need to rush to mint, no gas wars,
                        open to literally every wallet on Ethereum.
                    </Text>
                    <Heading as="h2" fontSize="24px">
                        Natural Scarcity
                    </Heading>
                    <Text>
                        The number of possible Birthblock NFTs with 100+ rings is set by existing
                        on-chain data, not artificially set.
                    </Text>
                    <Heading as="h2" fontSize="24px">
                        Earned
                    </Heading>
                    <Text>
                        Part of the infant category of earned NFTs. You earn attributes based on
                        your actions. The older your wallet is, the bigger your tree will be.
                    </Text>
                </Grid>
            </Container>

            <VStack justifyContent="center" mt={20} py={10} bgColor="#00B8B6">
                <Text fontWeight="light" fontSize="54px">
                    89/144 free mints left
                </Text>
                <Button
                    mt={10}
                    fontWeight={'300'}
                    colorScheme="teal"
                    width={250}
                    height={20}
                    boxShadow="0px 3px 6px rgba(0, 0, 0, 0.160784);"
                    fontSize={32}
                    borderRadius={56}>
                    Connect
                </Button>
            </VStack>
        </Box>
    );
}

export default Ui;
