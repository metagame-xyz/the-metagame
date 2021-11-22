import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';

import { GOOGLE_ANALYTICS_ID, WEBSITE_URL } from '@utils/constants';

/**
 * Prop Types
 */
export interface MetaProps {
    description?: string;
    image?: string;
    title: string;
    type?: string;
}

const meta: MetaProps = {
    title: 'Birthblock',
    description: 'A NFT created using the data from your first Ethereum transaction',
    image: `https://${WEBSITE_URL}/images/site-preview.png`,
    type: 'website',
};

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        console.log('env', process.env.VERCEL_ENV);
        return initialProps;
    }

    render() {
        return (
            <Html>
                <Head>
                    <meta content={meta.description} name="description" />
                    <meta property="og:url" content={`${WEBSITE_URL}`} />
                    <link rel="canonical" href={`${WEBSITE_URL}`} />
                    <meta property="og:type" content={meta.type} />
                    <meta property="og:site_name" content="Birthblock.art" />
                    <meta property="og:description" content={meta.description} />
                    <meta property="og:title" content={meta.title} />
                    <meta property="og:image" content={meta.image} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content="@the_metagame" />
                    <meta name="twitter:title" content={meta.title} />
                    <meta name="twitter:description" content={meta.description} />
                    <meta name="twitter:image" content={meta.image} />
                    <script
                        async
                        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GOOGLE_ANALYTICS_ID}', {page_path: window.location.pathname,});`,
                        }}
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
