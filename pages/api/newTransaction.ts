import {
    fetcher,
    isValidAlchemySignature,
    signMessage,
    ioredisClient,
    timestampToDate,
} from '../../utils/utils';
import {
    ACHIEVEMENT_NAME,
    NETWORK,
    ETHERSCAN_API_KEY,
    PUBLIC_KEY,
    APP_NAME,
} from '../../utils/constants';
import type { NextApiRequest, NextApiResponse } from 'next';

const etherscanNetworkString = process.env.NETWORK.toLowerCase() == 'ethereum' ? '' : `-${NETWORK}`;

const etherscanAPIURLBuilder = (address: string) =>
    `https://api${etherscanNetworkString}.etherscan.io/api?apikey=${ETHERSCAN_API_KEY}&module=account&action=txlist&address=${address}&startblock=0&endblock=999999999&sort=asc&page=1&offset=1`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
        const message = 'invalid Alchemy Signature';
        console.log(message);
        return res.status(400).send({ message });
    }

    const { app, network, activity } = req.body;

    // check the message is coming from the right network in regards to what environment we're in (prod vs dev)
    if (network !== NETWORK) {
        const message = `expected the request's network (${network}) to match the environment's network (${NETWORK})`;
        console.log(message);
        return res.status(400).send({ message });
    }

    // check the message is for the app we're building for
    if (!app.includes(APP_NAME)) {
        const message = `expected the request for (${app}) to match the environment's app (${APP_NAME})`;
        console.log(message);
        return res.status(400).send({ message });
    }

    const newUserAddress = activity[0].fromAddress;
    const etherscanAPIURL = etherscanAPIURLBuilder(newUserAddress);
    const { status, message, result } = await fetcher(etherscanAPIURL);

    // check that etherscan API returned successfully
    if (status != 1) {
        console.log('Etherscan error. Message:', message);
        return res.status(400).send({ message, errorType: 'etherscan API' });
    }

    const data = {
        address: newUserAddress,
        blockNumber: result[0].blockNumber,
        timeStamp: result[0].timeStamp,
        hash: result[0].hash,
        achievementName: ACHIEVEMENT_NAME,
        signature: null,
        publicKey: PUBLIC_KEY,
    };

    const messageToSign = newUserAddress + ACHIEVEMENT_NAME + result[0].blockNumber;
    const signature = signMessage(messageToSign);
    data.signature = signature;

    await ioredisClient.hset(newUserAddress, data);

    res.status(200).send({ message: `${newUserAddress} added or updated with ${data}` });
}
