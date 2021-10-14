import Head from 'next/head';

export default function Home() {
    return (
        <div>
            <Head>
                <title>A Pretty profile page</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1>A Pretty profile page</h1>
                with the art and other stuff here
            </main>
        </div>
    );
}
