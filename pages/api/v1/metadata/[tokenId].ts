import type { NextApiRequest, NextApiResponse } from 'next';
import { ioredisClient } from '../../../../utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { tokenId } = req.query;
    const tokenIdString: string = Array.isArray(tokenId) ? tokenId[0] : tokenId;

    const data = await ioredisClient.hget(tokenIdString.toLowerCase(), 'metadata');

    if (!data) {
        return res.status(404).json({ message: `Token id ${tokenId} not found.` });
    }

    const metadata = JSON.parse(data);
    res.send(metadata);
}
