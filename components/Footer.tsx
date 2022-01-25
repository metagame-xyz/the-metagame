import { Box, Flex, Link, Text } from '@chakra-ui/react';

import { TwitterLogo } from '@components/Icons';

import { copy } from '@utils/content';

export default function Footer(props) {
    return (
        <Flex width="100%">
            <Box p={8} width="fit-content" margin="auto">
                <Text mt={2} fontWeight="light" maxW="xl" _hover={{ color: 'green.200' }}>
                    <Link isExternal href={'https://twitter.com/The_Metagame'}>
                        {copy.bottomSectionText}
                        <TwitterLogo boxSize={4} />
                    </Link>
                </Text>
            </Box>
        </Flex>
    );
}
