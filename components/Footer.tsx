import { Center, Flex, Grid, Link, Stack, Text } from '@chakra-ui/react';

import { Etherscan, Opensea, TwelveCircles, Twitter } from './Icons';

const hover = { color: 'brand.300' };

export default function Footer(props) {
    return (
        <Flex width="100%" bgColor="brand.700">
            <Grid
                as="footer"
                w={'100%'}
                margin="auto"
                p={4}
                gap={1}
                templateColumns="repeat(3, 1fr)"
                color="brand.50"
                {...props}>
                <Flex align="center">
                    <Text fontSize="sm">
                        {`code & art by `}
                        <Link isExternal href="https://www.twitter.com/brennerspear">
                            brenner.eth
                        </Link>
                    </Text>
                </Flex>
                <Stack
                    direction={['column', 'column', 'row']}
                    spacing={2}
                    align="center"
                    justify="center">
                    <TwelveCircles boxSize={8} color="white" />
                    {/* pt=1 cuz this font sits too high */}
                    <Center fontFamily="courier prime" pt={1} fontSize={['sm', 'md', 'xl', 'xl']}>
                        The Metagame
                    </Center>
                </Stack>
                <Stack
                    direction={'row'}
                    spacing={2}
                    align="center"
                    justify="flex-end"
                    color="brand.100">
                    <Twitter boxSize={[6, 8]} _hover={hover} boxShadow={''} />
                    <Opensea boxSize={[6, 8]} _hover={hover} boxShadow={''} />
                    <Etherscan boxSize={[6, 8]} _hover={hover} boxShadow={''} />
                </Stack>
            </Grid>
        </Flex>
    );
}
