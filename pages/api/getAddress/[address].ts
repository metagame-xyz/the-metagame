import type { NextApiRequest, NextApiResponse } from 'next';
import { ioredisClient } from '../../../utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { address } = req.query;
    const addressString: string = Array.isArray(address) ? address[0] : address;
    const data = await ioredisClient.hgetall(addressString.toLowerCase());
    res.send(data);
}
