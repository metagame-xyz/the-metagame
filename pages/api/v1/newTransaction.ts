import { getDefaultProvider } from '@ethersproject/providers';
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
import {
    ALCHEMY_PROJECT_ID,
    CONTRACT_BIRTHBLOCK,
    INFURA_PROJECT_ID,
    networkStrings,
    WEBSITE_URL,
} from '@utils/constants';

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

    let status, message, result;
    try {
        ({ status, message, result } = await getOldestTransaction(minterAddress));
    } catch (error) {
        logger.error({ error });
        return res.status(500).send({ error });
    }

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

    const defaultProvider = getDefaultProvider(networkStrings.ethers, {
        infura: INFURA_PROJECT_ID,
        alchemy: ALCHEMY_PROJECT_ID,
    });

    let ensName = null;
    try {
        ensName = await defaultProvider.lookupAddress(minterAddress);
    } catch (error) {
        logger.error({ error });
        logger.error({ message: 'ensName lookup failed' });
    }

    const userName = ensName || minterAddress.substr(0, 6);

    const metadata: Metadata = {
        name: `${userName}'s Birthblock`,
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

    try {
        // index by wallet address
        await ioredisClient.hset(minterAddress, { tokenId, metadata: JSON.stringify(metadata) });
    } catch (error) {
        logger.error({ error });
        return res.status(500).send({ message: 'ioredis error', error });
    }

    try {
        // index by tokenId
        await ioredisClient.hset(tokenId, {
            address: minterAddress,
            metadata: JSON.stringify(metadata),
        });
    } catch (error) {
        logger.error({ error });
        return res.status(500).send({ message: 'ioredis error 2', error });
    }

    // res.status(504).end();
    res.status(200).send({
        minterAddress,
        tokenId,
        ensName,
        status: 1,
        message: 'success',
        result: { minterAddress, tokenId, ensName },
    });
}
