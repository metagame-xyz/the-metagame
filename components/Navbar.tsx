import React from 'react';
import { Box, Button, Container, HStack } from '@chakra-ui/react';
import Image from 'next/image';
import discordIcon from '../images/icons/discord.png';
import openSeaIcon from '../images/icons/open-sea.png';
import twitterIcon from '../images/icons/twitter.png';

function Navbar(props) {
    return (
        <Box as="header" paddingTop="40px">
            <Container>
                <Box d="flex" width="100%" justifyContent="flex-end">
                    <HStack align="center" spacing="41px">
                        <img height="51px" width="51px" src={discordIcon.src} />
                        <img height="60px" width="60px" src={twitterIcon.src} />
                        <img height="55px" width="54px" src={openSeaIcon.src} />
                        <Button
                            fontWeight={'300'}
                            colorScheme="teal"
                            width={209}
                            height={59}
                            fontSize={28}
                            borderRadius={30}
                            isFullWidth>
                            Connect
                        </Button>
                    </HStack>
                </Box>
            </Container>
        </Box>
    );
}

export default Navbar;
