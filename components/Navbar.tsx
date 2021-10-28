import React from 'react';
import { Box, Button, Container, HStack, Text } from '@chakra-ui/react';
import discordIcon from '../images/icons/discord.png';
import openSeaIcon from '../images/icons/open-sea.png';
import twitterIcon from '../images/icons/twitter.png';

function Navbar() {
    return (
        <Box as="header" paddingTop="40px">
            <Container maxW={1280}>
                <Box d="flex" width="100%" justifyContent="space-between">
                    <Text as="h1" fontSize="50px" fontWeight="light">
                        Birthblock
                    </Text>
                    <HStack align="center" spacing="20px">
                        <img height="51px" width="51px" src={discordIcon.src} />
                        <img height="60px" width="60px" src={twitterIcon.src} />
                        <img height="55px" width="54px" src={openSeaIcon.src} />
                        <Button
                            fontWeight={'300'}
                            colorScheme="teal"
                            width={209}
                            height={59}
                            fontSize={28}
                            borderRadius={30}>
                            Connect
                        </Button>
                    </HStack>
                </Box>
            </Container>
        </Box>
    );
}

export default Navbar;
