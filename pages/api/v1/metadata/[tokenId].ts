import type { NextApiRequest, NextApiResponse } from 'next';

import { ioredisClient, metadataToOpenSeaMetadata } from '@utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { tokenId } = req.query;
    const tokenIdString: string = Array.isArray(tokenId) ? tokenId[0] : tokenId;

    const metadata = await ioredisClient.hget(tokenIdString.toLowerCase(), 'metadata');

    if (!metadata) {
        return res.status(404).json({ message: `Token id ${tokenId} not found.` });
    }

    const openseaMetadata = metadataToOpenSeaMetadata(JSON.parse(metadata));
    res.send(openseaMetadata);
}
