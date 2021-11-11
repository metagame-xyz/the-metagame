import { commify, formatUnits } from '@ethersproject/units';
import type { NextApiRequest, NextApiResponse } from 'next';

import {
    formatDateObjToShortTime,
    getOldestTransaction,
    ioredisClient,
    isValidEventForwarderSignature,
    logger,
    Metadata,
    timestampToDate,
    zodiac,
} from '@utils';
import { CONTRACT_BIRTHBLOCK, WEBSITE_URL } from '@utils/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    logger.info(req.body);
    if (req.method !== 'POST') {
        /**
         * During development, it's useful to un-comment this block
         * so you can test some of your code by just hitting this page locally
         *
         * return res.status(200).send({});
         */

        return res.status(404).send({ error: '404' });
    }

    // check the message is coming from the event-forwarder
    if (!isValidEventForwarderSignature(req)) {
        const error = 'invalid event-forwarder Signature';
        logger.error({ error });
        return res.status(400).send({ error });
    }

    const { minterAddress, tokenId } = req.body;

    const { status, message, result } = await getOldestTransaction(minterAddress);

    // check that etherscan API returned successfully
    if (status != 1) {
        logger.error({ error: 'Etherscan error getOldestTransaction', message });
        return res
            .status(400)
            .send({ error: `Etherscan getOldestTransaction had an issue: ${message}` });
    }

    const { hash, timeStamp: timestamp, value, from, blockNumber } = result[0];

    const dateObj = timestampToDate(timestamp);
    const birthblock = commify(blockNumber);
    const blockAge = Math.max(CONTRACT_BIRTHBLOCK - Number(blockNumber), 0); // Age is based on the contract's birthblock, not the current block, but we don't want negative ages
    const treeRingsLevel = Math.floor(blockAge / 10 ** 5);
    const firstRecieved = Number(formatUnits(value, 'ether')) ? 'ether' : 'token(s)';
    const shortTime = formatDateObjToShortTime(dateObj);
    const zodiacSign = zodiac(dateObj.day, dateObj.month);

    const metadata: Metadata = {
        name: `${minterAddress.substr(0, 6)}'s Birthblock`,
        description: `A ${dateObj.year} ${zodiacSign} address born at ${shortTime}. It's grown ${treeRingsLevel} rings.`,
        image: `https://${WEBSITE_URL}/api/v1/image/${tokenId}`,
        external_url: `https://${WEBSITE_URL}/birthblock/${tokenId}`,
        address: minterAddress,
        parent: from,
        firstRecieved,
        treeRings: treeRingsLevel.toString(),
        timestamp,
        birthblock,
        txnHash: String(hash),
        zodiacSign,
        blockAge,
        treeRingsLevel,
    };

    // index by wallet address
    await ioredisClient.hset(minterAddress, { tokenId, metadata: JSON.stringify(metadata) });

    // index by tokenId
    await ioredisClient.hset(tokenId, {
        address: minterAddress,
        metadata: JSON.stringify(metadata),
    });

    res.status(200).send({ minterAddress, tokenId });
}
