import { WEBSITE_URL } from '@utils/constants';

export interface MetaProps {
    description?: string;
    image?: string;
    title: string;
    type?: string;
}

export const headMetadata: MetaProps = {
    title: 'The Metagame',
    description: 'Infrastructure For earned NFTs',
    image: `https://${WEBSITE_URL}/site-preview.png`,
    type: 'website',
};

export const copy = {
    title: 'The Metagame',
    nameLowercase: 'the-metagame',
    heading1: 'Birthblock',
    text1: 'mint page',
    heading2: 'Token Garden',
    text2: 'Minting opens Dec 28th 8pm EST',
    heading3: 'Jan 2022',
    // text3: 'Jan 2022',
    heroSubheading: `You’re playing it right now.`,
    heroSubheading2: `We are building infrastructure for on-chain achievements.`,
    heroSubheading3: 'Phase One: 3 earned NFTs',
    bottomSectionText: 'Follow along ',
};
