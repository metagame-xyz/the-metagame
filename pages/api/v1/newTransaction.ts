import {
    isValidEventForwarderSignature,
    ioredisClient,
    timestampToDate,
    Metadata,
    getOldestTransaction,
    zodiac,
    logger,
} from '../../../utils/utils';
import { CONTRACT_BIRTHBLOCK, VERCEL_URL } from '../../../utils/constants';
import type { NextApiRequest, NextApiResponse } from 'next';
import { formatUnits } from '@ethersproject/units';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    logger.info({ request_body: req.body });
    if (req.method !== 'POST') {
        /**
         * During development, it's useful to un-comment this block
         * so you can test some of your code by just hitting this page locally
         *
         * return res.status(200).send({});
         */

        return res.status(404).send({ message: '404' });
    }

    // check the message is coming from the right Alchemy account
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
        return res.status(400).send({ message, errorType: 'etherscan API' });
    }

    const oldestTxnData = {
        address: minterAddress,
        blockNumber: result[0].blockNumber,
        fromAddress: result[0].from,
        timeStamp: result[0].timeStamp,
        hash: String(result[0].hash),
        value: Number(formatUnits(result[0].value, 'ether')),
    };

    const dateObj = timestampToDate(oldestTxnData.timeStamp);

    const metadata: Metadata = {
        name: `${oldestTxnData.hash.substr(0, 6)}'s Birthblock: ${oldestTxnData.blockNumber} `,
        description: `A ${dateObj.year} ${zodiac(dateObj.day, dateObj.month)} address born at ${
            dateObj.hour
        }:${dateObj.minute}`,
        image: `${VERCEL_URL}/api/v1/image/${tokenId}`,
        external_url: `${VERCEL_URL}/birthblock/${tokenId}`,
        attributes: [
            {
                trait_type: 'year',
                value: dateObj.year,
            },
            {
                trait_type: 'month',
                value: dateObj.month,
            },
            {
                trait_type: 'day',
                value: dateObj.day,
            },
            {
                trait_type: 'hour',
                value: dateObj.hour,
            },
            {
                trait_type: 'minute',
                value: dateObj.minute,
            },
            {
                trait_type: 'second',
                value: dateObj.second,
            },
            {
                display_type: 'date',
                trait_type: 'birthday',
                value: oldestTxnData.timeStamp, // 1546360800
            },
            {
                trait_type: 'address',
                value: minterAddress,
            },
            {
                trait_type: 'parent',
                value: oldestTxnData.fromAddress,
            },
            {
                trait_type: 'eth received',
                value: oldestTxnData.value, // 0.08 eth
            },
            {
                trait_type: 'block age',
                value: CONTRACT_BIRTHBLOCK - oldestTxnData.blockNumber,
            },
            {
                trait_type: 'birthblock',
                value: oldestTxnData.blockNumber,
            },
            {
                trait_type: 'txn hash',
                value: oldestTxnData.hash,
            },
            {
                trait_type: 'zodiac',
                value: zodiac(dateObj.day, dateObj.month),
            },
        ],
    };

    // index by wallet address
    await ioredisClient.hset(minterAddress, { tokenId, metadata: JSON.stringify(metadata) });

    // index by tokenId
    await ioredisClient.hset(tokenId, {
        address: minterAddress,
        metadata: JSON.stringify(metadata),
    });

    res.status(200).send({ message: `${minterAddress} added or updated` });
}
