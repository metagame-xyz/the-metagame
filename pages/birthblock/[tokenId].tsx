import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import { generateSVG } from 'pages/api/v1/image/[tokenId]';
import { Metadata } from 'utils/utils';

import Example from '../../images/example.svg';
import { ioredisClient } from '../../utils/utils';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { tokenId } = params;
    const tokenIdString: string = Array.isArray(tokenId) ? tokenId[0] : tokenId;
    const data = await ioredisClient.hget(tokenIdString, 'metadata');
    const metadata: Metadata = JSON.parse(data);

    const svgString = generateSVG(metadata);

    return {
        props: { tokenId: tokenIdString, metadata, svgString }, // will be passed to the page component as props
    };
};

function Birthblock({
    tokenId,
    metadata,
    svgString,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { name, description, attributes } = metadata;
    console.log(attributes);
    console.log(svgString);
    return (
        <>
            <div>id {tokenId} </div>
            <div>{name}</div>
            <div>{description}</div>
            {/* <div>{attributes[0].value}</div> */}
            <Image
                src={`data:image/svg+xml;utf8,${svgString}`}
                width={500}
                height={500}
                alt="a big tree"
            />
        </>
    );
}

export default Birthblock;
