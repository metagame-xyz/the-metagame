import { WEBSITE_URL } from '@utils/constants';

export interface MetaProps {
    description?: string;
    image?: string;
    title: string;
    type?: string;
}

export const headMetadata: MetaProps = {
    title: 'Birthblock',
    description: 'A NFT created using the data from your first Ethereum transaction',
    image: `https://${WEBSITE_URL}/images/site-preview.png`,
    type: 'website',
};

export const copy = {
    title: 'Birthblock',
    nameLowercase: 'birthblock',
    heading1: 'Minted Fairly',
    text1: 'Unlimited total mints with one mint per wallet. No rush to mint, no gas wars, and open to everyone.',
    heading2: 'Naturally Scarce',
    text2: 'The number of possible Birthblock NFTs with 100+ rings is set by existing on-chain data instead of by an artificial limit.',
    heading3: 'Earned',
    text3: 'Part of the infant category of earned NFTs where you earn attributes based on your actions. The older your wallet, the bigger your tree.',
    heroSubheading:
        'An NFT with art and attributes based on the data from your first transaction on Ethereum',
    bottomSectonHeading: 'The Metagame',
    bottomSectionText:
        'Birthblock is the first NFT in an infinite series of achievements you earn by playing a game many of us are already playing whether we know it or not: The Metagame. These earned achievements will allow access to private spaces gated by shared experiences. Each achievement will contribute to leveling up your character. Follow along: ',
};
