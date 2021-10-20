import {
    ioredisClient,
    timestampToDate,
    Metadata,
    getOldestTransaction,
    getTokenIdForAddress,
    zodiac,
} from '../../../../utils/utils';
import { CONTRACT_ADDRESS, CONTRACT_BIRTHBLOCK, VERCEL_URL } from '../../../../utils/constants';
import type { NextApiRequest, NextApiResponse } from 'next';
import { formatUnits } from '@ethersproject/units';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'GET') {
        const { address } = req.query;
        const newUserAddress = (Array.isArray(address) ? address[0] : address).toLowerCase();

        let { status, message, result } = await getOldestTransaction(newUserAddress);

        // check that etherscan API returned successfully
        if (status != 1) {
            console.log('Etherscan error getOldestTransaction. Message:', message);
            return res.status(400).send({ message, errorType: 'etherscan API' });
        }

        const oldestTxnData = {
            address: newUserAddress,
            blockNumber: result[0].blockNumber,
            fromAddress: result[0].from,
            timeStamp: result[0].timeStamp,
            hash: result[0].hash,
            value: Number(formatUnits(result[0].value, 'ether')),
        };

        // let tokenIDsRawData;
        // ({
        //     status,
        //     message,
        //     result: tokenIDsRawData,
        // } = await getTokenIdForAddress(newUserAddress, CONTRACT_ADDRESS));

        // // check that etherscan API returned successfully
        // if (status != 1) {
        //     console.log('Etherscan error getTokenIdForAddress. Message:', message);
        //     return res.status(400).send({ message, errorType: 'etherscan API' });
        // }

        // const tokenId = tokenIDsRawData[0].tokenID;
        const tokenId = 1337;

        const dateObj = timestampToDate(oldestTxnData.timeStamp);

        const metadata: Metadata = {
            name: `eth age name? idk`,
            description: ``,
            image: `${VERCEL_URL}/api/v1/image/${address}`,
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
                    value: newUserAddress,
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

        // // index by tokenId
        // await ioredisClient.hset(tokenId, {
        //     address: newUserAddress,
        //     metadata: JSON.stringify(metadata),
        // });

        const data = await ioredisClient.hgetall(newUserAddress);

        return res.status(200).send(JSON.parse(data.metadata));
    }
}
