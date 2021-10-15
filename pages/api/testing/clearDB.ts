import { ioredisClient } from '../../../utils/utils';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // const [cursor, keys] = await ioredisClient.keys

    // console.log('cursor:', cursor);
    // console.log('keys:', keys);

    // Create a readable stream (object mode)
    const stream = ioredisClient.scanStream();
    stream.on('data', async (resultKeys) => {
        // `resultKeys` is an array of strings representing key names.
        // Note that resultKeys may contain 0 keys, and that it will sometimes
        // contain duplicates due to SCAN's implementation in Redis.
        const pipeline = ioredisClient.pipeline();

        for (let i = 0; i < resultKeys.length; i++) {
            pipeline.del(resultKeys[i]);
            console.log('deleting', resultKeys[i]);
        }

        const data = await pipeline.exec();
        console.log('data:', data);
    });
    stream.on('end', () => {
        console.log('all keys have been visited');
    });
    res.status(200).send({ message: 'ok' });
}

// await ioredisClient.hset(newUserAddress, { tokenId, metadata: JSON.stringify(metadata) });

// // index by tokenId
// await ioredisClient.hset(tokenId, {
//     address: newUserAddress,
//     metadata: JSON.stringify(metadata),
// });
