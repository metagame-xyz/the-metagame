import type { NextApiRequest, NextApiResponse } from 'next';
import { ioredisClient } from '../../../../utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { tokenId } = req.query;
    const tokenIdString: string = Array.isArray(tokenId) ? tokenId[0] : tokenId;
    const data = await ioredisClient.hgetall(tokenIdString.toLowerCase());

    const metadata = JSON.parse(data.metadata);

    let attributeSVgArray = [];
    for (let i = 0; i < metadata.attributes.length; i++) {
        attributeSVgArray.push(
            `<text x="10" y="${i * 20}" class="text">${metadata.attributes[i].value}</text>`,
        );
    }
    const attributeSvgString = attributeSVgArray.join('');

    let svgData = [];
    svgData.push(
        `<svg width="350" height="350" viewBox="0 0 350 350" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="350" height="350" fill="white"/><style>.text { fill: black; font-family: serif; font-size: 14px; }</style>`,
    );
    svgData.push(attributeSvgString);
    svgData.push(`</svg>`);
    const svgString = svgData.join('');

    const svgBuffer = Buffer.from(svgString, 'utf-8');

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svgBuffer);
}
