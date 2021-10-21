import { createHmac } from 'crypto';
import type { NextApiRequest } from 'next';
import * as ethers from 'ethers';
import fetch from 'node-fetch-retry';
import Redis from 'ioredis';
import pino from 'pino';
import { logflarePinoVercel } from 'pino-logflare';
import {
    EVENT_FORWARDER_AUTH_TOKEN,
    ETHERSCAN_API_KEY,
    LOGFLARE_API_KEY,
    LOGFLARE_SOURCE_UUID,
    NETWORK,
    PRIVATE_KEY,
    REDIS_URL,
} from './constants';

const fetchOptions = {
    retry: 12,
    pause: 2000,
    callback: (retry: any) => {
        console.log(`Retrying: ${retry}`);
    },
};

export const fetcher = (url: string) => fetch(url, fetchOptions).then((r: any) => r.json());

export const isValidEventForwarderSignature = (request: NextApiRequest) => {
    const token = EVENT_FORWARDER_AUTH_TOKEN;
    const headers = request.headers;
    const signature = headers['x-event-forwarder-signature'];
    console.log('signature:', signature);
    const body = request.body;
    const hmac = createHmac('sha256', token); // Create a HMAC SHA256 hash using the auth token
    hmac.update(JSON.stringify(body), 'utf8'); // Update the token hash with the request body using utf8
    const digest = hmac.digest('hex');
    return signature === digest;
};

export const signMessage = (message: string) => {
    const privateKey = PRIVATE_KEY;
    const signingKey = new ethers.Wallet(privateKey)._signingKey();
    const digest = ethers.utils.id(message);
    const signature = signingKey.signDigest(digest);
    const joinedSignature = ethers.utils.joinSignature(signature);
    return joinedSignature;
};

export const checkSignature = (message: string, joinedSignature: string, walletAddress: string) => {
    const digest = ethers.utils.id(message);
    const signature = ethers.utils.splitSignature(joinedSignature);
    const recoveredAddress = ethers.utils.recoverAddress(digest, signature);
    return walletAddress === recoveredAddress;
};

export const ioredisClient = new Redis(REDIS_URL);

// create pino-logflare console stream for serverless functions and send function for browser logs
const { stream, send } = logflarePinoVercel({
    apiKey: LOGFLARE_API_KEY,
    sourceToken: LOGFLARE_SOURCE_UUID,
});

// create pino loggger
export const logger = pino(
    {
        browser: {
            transmit: {
                level: 'info',
                send: send,
            },
        },
        level: 'debug',
        base: {
            env: process.env.NODE_ENV || 'unknown-env',
            revision: process.env.VERCEL_GITHUB_COMMIT_SHA,
        },
    },
    stream,
);

const etherscanNetworkString = NETWORK.toLowerCase() == 'ethereum' ? '' : `-${NETWORK}`;

export const getOldestTransaction = async (address: string) =>
    await fetcher(
        `https://api${etherscanNetworkString}.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=999999999&sort=asc&page=1&offset=1&apikey=${ETHERSCAN_API_KEY}`,
    );

export const timestampToDate = (ts: number): Record<string, number> => {
    const date = new Date(ts * 1000);
    const dateObj = {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
    };

    return dateObj;
};

// returns the zodiac sign according to day and month ( https://coursesweb.net/javascript/zodiac-signs_cs )
export const zodiac = (day: number, month: number) => {
    var zodiac = [
        '',
        'Capricorn',
        'Aquarius',
        'Pisces',
        'Aries',
        'Taurus',
        'Gemini',
        'Cancer',
        'Leo',
        'Virgo',
        'Libra',
        'Scorpio',
        'Sagittarius',
        'Capricorn',
    ];
    var last_day = ['', 19, 18, 20, 20, 21, 21, 22, 22, 21, 22, 21, 20, 19];
    return day > last_day[month] ? zodiac[month * 1 + 1] : zodiac[month];
};

// birthblock.art/api/v1/metadata/[tokenId]
export interface Metadata {
    name: string;
    description: string;
    image: string; // birthblock.art/api/v1/image/[tokenId]
    external_url: string; // birthblock.art/birthblock/[tokenId]
    attributes: [
        {
            trait_type: 'year';
            value: number;
        },
        {
            trait_type: 'month';
            value: number;
        },
        {
            trait_type: 'day';
            value: number;
        },
        {
            trait_type: 'hour';
            value: number;
        },
        {
            trait_type: 'minute';
            value: number;
        },
        {
            trait_type: 'second';
            value: number;
        },
        {
            display_type: 'date';
            trait_type: 'birthday';
            value: number; // 1546360800
        },
        {
            trait_type: 'address';
            value: string;
        },
        {
            trait_type: 'parent';
            value: string;
        },
        {
            trait_type: 'eth received';
            value: number; // 0.08 eth
        },
        {
            trait_type: 'block age';
            value: number;
        },
        {
            trait_type: 'birthblock';
            value: number;
        },
        {
            trait_type: 'txn hash';
            value: string;
        },
        {
            trait_type: 'zodiac';
            value: string;
        },
    ];
}
