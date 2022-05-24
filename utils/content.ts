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
    text2: 'mint page',
    heading3: 'Heartbeat',
    text3: 'mint page',
    heroSubheading: `You’re playing it right now.`,
    heroSubheading2: `Infrastructure for fun, aesthetically pleasing earned NFTs by using your on-chain and off-chain activity.`,
    heroSubheading3: 'Phase One: 3 earned NFTs',
    bottomSectionText: 'Follow along ',
};
