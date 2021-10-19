import {
    isValidAlchemySignature,
    ioredisClient,
    timestampToDate,
    Metadata,
    getOldestTransaction,
    getTokenIdForAddress,
    zodiac,
    sleep,
    logger,
} from '../../../utils/utils';
import {
    NETWORK,
    ALCHEMY_APP_NAME,
    CONTRACT_ADDRESS,
    CONTRACT_BIRTHBLOCK,
    VERCEL_URL,
} from '../../../utils/constants';
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
    if (!isValidAlchemySignature(req)) {
        const error = 'invalid Alchemy Signature';
        logger.error({ error });
        return res.status(400).send({ error });
    }

    const { app, network, activity } = req.body;

    // check the message is coming from the right network in regards to what environment we're in (prod vs dev)
    if (network.toLowerCase() !== NETWORK.toLowerCase()) {
        const error = `expected the request's network (${network}) to match the environment's network (${NETWORK})`;
        logger.error({ error });
        return res.status(400).send({ error });
    }

    // check the message is for the app we're building for
    if (!app.includes(ALCHEMY_APP_NAME)) {
        const error = `expected the request for (${app}) to match the environment's app (${ALCHEMY_APP_NAME})`;
        logger.error({ error });
        return res.status(400).send({ error });
    }

    const newUserAddressArray = [];

    for (let i = 0; i < activity.length; i++) {
        const newUserAddress = activity[i].fromAddress;
        newUserAddressArray.push(newUserAddress);
        // const newUserAddress = '0x17A059B6B0C8af433032d554B0392995155452E6';
        let { status, message, result } = await getOldestTransaction(newUserAddress);

        // check that etherscan API returned successfully
        if (status != 1) {
            logger.error({ error: 'Etherscan error getOldestTransaction', message });
            return res.status(400).send({ message, errorType: 'etherscan API' });
        }

        const oldestTxnData = {
            address: newUserAddress,
            blockNumber: result[0].blockNumber,
            fromAddress: result[0].from,
            timeStamp: result[0].timeStamp,
            hash: String(result[0].hash),
            value: Number(formatUnits(result[0].value, 'ether')),
        };

        let tokenIDsRawData;

        const maxRetry = 4;
        let tryCounter = 1;
        // need to stay under 10s for now cuz Vercel lambda timeout
        const wait = [0, 1000, 2000, 3000, 3000];

        while (tryCounter <= maxRetry) {
            logger.info({ message: `Try #${tryCounter} to get Token ID for ${newUserAddress}` });

            ({
                status,
                message,
                result: tokenIDsRawData,
            } = await getTokenIdForAddress(newUserAddress, CONTRACT_ADDRESS));

            // we got it!
            if (status == 1) {
                logger.info({
                    message: `Try #${tryCounter} successful. Token ID for ${newUserAddress}: ${tokenIDsRawData[0].tokenID}`,
                });
                break;
            } else if (tryCounter != maxRetry) {
                logger.info({
                    message: `try # ${tryCounter} to get Token ID for ${newUserAddress} failed. Waiting ${
                        wait[tryCounter] / 1000
                    } second(s)`,
                });
                await sleep(wait[tryCounter]);
                tryCounter++;
            } else {
                logger.warn({
                    message: `Tried ${tryCounter} times. Either it's not a mint, or it's taking a really long time. Sending a 400 to Alchemy, which will trigger another hit to the newTransactin endpoint`,
                });
                return res.status(400).send({ message, errorType: 'etherscan API' });
            }
        }

        const tokenId = tokenIDsRawData[0].tokenID;

        const dateObj = timestampToDate(oldestTxnData.timeStamp);

        const metadata: Metadata = {
            name: `Birthblock ${oldestTxnData.blockNumber}: ${oldestTxnData.hash.substr(0, 6)}`,
            description: `A ${dateObj.year} ${zodiac(dateObj.day, dateObj.month)} wallet born at ${
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
        await ioredisClient.hset(newUserAddress, { tokenId, metadata: JSON.stringify(metadata) });

        // index by tokenId
        await ioredisClient.hset(tokenId, {
            address: newUserAddress,
            metadata: JSON.stringify(metadata),
        });
    }

    res.status(200).send({ message: `${newUserAddressArray} added or updated` });
}
