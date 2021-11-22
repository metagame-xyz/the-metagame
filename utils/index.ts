import { createHmac } from 'crypto';
import { ethers } from 'ethers';
import Redis from 'ioredis';
import type { NextApiRequest } from 'next';
import fetch from 'node-fetch-retry';
import pino from 'pino';
import { logflarePinoVercel } from 'pino-logflare';

import {
    ETHERSCAN_API_KEY,
    EVENT_FORWARDER_AUTH_TOKEN,
    LOGFLARE_API_KEY,
    LOGFLARE_SOURCE_UUID,
    networkStrings,
    REDIS_URL,
} from './constants';

const fetchOptions = {
    retry: 12,
    pause: 2000,
    callback: (retry: any) => {
        logger.warn(`Retrying: ${retry}`);
    },
};

export const fetcher = (url: string) => fetch(url, fetchOptions).then((r: any) => r.json());

export const isValidEventForwarderSignature = (request: NextApiRequest) => {
    const token = EVENT_FORWARDER_AUTH_TOKEN;
    const headers = request.headers;
    const signature = headers['x-event-forwarder-signature'];
    const body = request.body;
    const hmac = createHmac('sha256', token); // Create a HMAC SHA256 hash using the auth token
    hmac.update(JSON.stringify(body), 'utf8'); // Update the token hash with the request body using utf8
    const digest = hmac.digest('hex');
    return signature === digest;
};

export const checkSignature = (message: string, joinedSignature: string, walletAddress: string) => {
    const digest = ethers.utils.id(message);
    const signature = ethers.utils.splitSignature(joinedSignature);
    const recoveredAddress = ethers.utils.recoverAddress(digest, signature);
    return walletAddress === recoveredAddress;
};

export const ioredisClient = new Redis(REDIS_URL);

// create pino-logflare console stream for serverless functions
const { stream } = logflarePinoVercel({
    apiKey: LOGFLARE_API_KEY,
    sourceToken: LOGFLARE_SOURCE_UUID,
});

// create pino loggger
export const logger = pino(
    {
        base: {
            env: process.env.VERCEL_ENV || 'unknown-env',
            revision: process.env.VERCEL_GITHUB_COMMIT_SHA,
        },
    },
    stream,
);

export const localLogger = pino({}, stream);

export const getOldestTransaction = async (address: string) =>
    await fetcher(
        `https://${networkStrings.etherscanAPI}etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=999999999&sort=asc&page=1&offset=1&apikey=${ETHERSCAN_API_KEY}`,
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

export const formatDateObjToTime = (dateObj: Record<string, number>): string => {
    const { hour, minute, second } = dateObj;
    const ampm = hour >= 12 ? 'pm' : 'am';
    let ampmHour = hour % 12;
    ampmHour = ampmHour ? ampmHour : 12; // the hour '0' should be '12'
    const minuteStr = minute < 10 ? '0' + minute : minute;
    const secondStr = second < 10 ? '0' + second : second;
    return `${ampmHour}:${minuteStr}:${secondStr} ${ampm}`;
};

export const formatDateObjToShortTime = (dateObj: Record<string, number>): string => {
    const { hour, minute } = dateObj;
    const ampm = hour >= 12 ? 'pm' : 'am';
    let ampmHour = hour % 12;
    ampmHour = ampmHour ? ampmHour : 12; // the hour '0' should be '12'
    const minuteStr = minute < 10 ? '0' + minute : minute;
    return `${ampmHour}:${minuteStr} ${ampm}`;
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

export type Metadata = {
    name: string;
    description: string;
    image: string; // birthblock.art/api/v1/image/[tokenId]
    external_url: string; // birthblock.art/birthblock/[tokenId]
    address: string;
    parent: string;
    firstRecieved: 'ether' | 'token(s)';
    treeRings: string;
    timestamp: number;
    // birthTime?: string;
    // date?: number;
    birthblock: string;
    txnHash: string;
    zodiacSign: string;
    blockAge: number;
    treeRingsLevel: number;
};

// birthblock.art/api/v1/metadata/[tokenId]
export type OpenSeaMetadata = {
    name: string;
    description: string;
    image: string; // birthblock.art/api/v1/image/[tokenId]
    external_url: string; // birthblock.art/birthblock/[tokenId]
    attributes: [
        // properties
        {
            trait_type: 'address';
            value: string;
        },
        {
            trait_type: 'parent';
            value: string;
        },
        {
            trait_type: 'first recieved';
            value: 'ether' | 'token(s)';
        },
        {
            trait_type: 'tree rings';
            value: string;
        },
        {
            trait_type: 'birth time';
            value: string;
        },
        {
            trait_type: 'birthblock';
            value: string;
        },
        {
            trait_type: 'txn hash';
            value: string;
        },
        {
            trait_type: 'zodiac sign';
            value: string;
        },
        // levels
        {
            trait_type: 'block age';
            value: number;
        },
        {
            trait_type: 'tree rings level';
            value: number;
        },
        // Date
        {
            display_type: 'date';
            trait_type: 'birthday';
            value: number; // 1546360800
        },
    ];
};

export function metadataToOpenSeaMetadata(metadata: Metadata): OpenSeaMetadata {
    const openseaMetadata: OpenSeaMetadata = {
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        external_url: metadata.external_url,
        attributes: [
            // properties
            {
                trait_type: 'address',
                value: metadata.address,
            },
            {
                trait_type: 'parent',
                value: metadata.parent,
            },
            {
                trait_type: 'first recieved',
                value: metadata.firstRecieved,
            },
            {
                trait_type: 'tree rings',
                value: Math.floor(metadata.blockAge / 10 ** 5).toString(),
            },
            {
                trait_type: 'birth time',
                value: formatDateObjToTime(timestampToDate(metadata.timestamp)),
            },
            {
                trait_type: 'birthblock',
                value: metadata.birthblock,
            },
            {
                trait_type: 'txn hash',
                value: metadata.txnHash,
            },
            {
                trait_type: 'zodiac sign',
                value: metadata.zodiacSign,
            },
            // levels
            {
                trait_type: 'block age',
                value: metadata.blockAge,
            },
            {
                trait_type: 'tree rings level',
                value: metadata.treeRingsLevel,
            },
            // Date
            {
                display_type: 'date',
                trait_type: 'birthday',
                value: metadata.timestamp, // 1546360800
            },
        ],
    };

    return openseaMetadata;
}
