import type { NextApiRequest, NextApiResponse } from 'next';

import { ioredisClient, isValidEventForwarderSignature, logger } from '@utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        console.log('Invalid request method');
        return res.status(404).send({ error: '404' });
    }

    // check the message is coming from the event-forwarder
    if (!isValidEventForwarderSignature(req)) {
        const error = 'Someone tryna clear your DB!';
        logger.error({ error });
        return res.status(400).send({ error });
    }

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
