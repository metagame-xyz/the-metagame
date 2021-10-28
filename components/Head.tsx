import NextHead from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { VERCEL_URL } from '../utils/constants';

/**
 * Constants & Helpers
 */
export const WEBSITE_HOST_URL = VERCEL_URL;

/**
 * Prop Types
 */
export interface MetaProps {
    description?: string;
    image?: string;
    title: string;
    type?: string;
}

/**
 * Component
 */
export const Head = ({ customMeta }: { customMeta?: MetaProps }): JSX.Element => {
    const router = useRouter();
    const meta: MetaProps = {
        title: 'Birthblock NFT',
        description: 'A NFT created using the data from your first Ethereum transaction',
        image: `https://${WEBSITE_HOST_URL}/images/site-preview.png`,
        type: 'website',
        ...customMeta,
    };

    return (
        <NextHead>
            <title>{meta.title}</title>
            <meta content={meta.description} name="description" />
            <meta property="og:url" content={`${WEBSITE_HOST_URL}${router.asPath}`} />
            <link rel="canonical" href={`${WEBSITE_HOST_URL}${router.asPath}`} />
            <meta property="og:type" content={meta.type} />
            <meta property="og:site_name" content="Birthblock.art" />
            <meta property="og:description" content={meta.description} />
            <meta property="og:title" content={meta.title} />
            <meta property="og:image" content={meta.image} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@brennerspear" />
            <meta name="twitter:title" content={meta.title} />
            <meta name="twitter:description" content={meta.description} />
            <meta name="twitter:image" content={meta.image} />
        </NextHead>
    );
};
