import { createHmac } from 'crypto';
import type { NextApiRequest } from 'next';
import * as ethers from 'ethers';
import fetch from 'node-fetch-retry';
import Redis from 'ioredis';
import { ETHERSCAN_API_KEY, NETWORK } from './constants';

const fetchOptions = {
    retry: 12,
    pause: 1000,
    callback: (retry: any) => {
        console.log(`Etherscan API Error. Retrying: ${retry}`);
    },
};

export const fetcher = (url: string) => fetch(url, fetchOptions).then((r: any) => r.json());

export const isValidAlchemySignature = (request: NextApiRequest) => {
    const token = process.env.ALCHEMY_AUTH_TOKEN;
    const headers = request.headers;
    const signature = headers['x-alchemy-signature'];
    const body = request.body;
    const hmac = createHmac('sha256', token); // Create a HMAC SHA256 hash using the auth token
    hmac.update(JSON.stringify(body), 'utf8'); // Update the token hash with the request body using utf8
    const digest = hmac.digest('hex');
    return signature === digest;
};

export const signMessage = (message: string) => {
    const privateKey = process.env.PRIVATE_KEY;
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

export const ioredisClient = new Redis(process.env.REDIS_URL);

const etherscanNetworkString = process.env.NETWORK.toLowerCase() == 'ethereum' ? '' : `-${NETWORK}`;

export const getOldestTransaction = async (address: string) =>
    await fetcher(
        `https://api${etherscanNetworkString}.etherscan.io/api?apikey=${ETHERSCAN_API_KEY}&module=account&action=txlist&address=${address}&startblock=0&endblock=999999999&sort=asc&page=1&offset=1`,
    );

export const getTokenIdForAddress = async (address: string, contractAddress: string) =>
    await fetcher(
        `https://api${etherscanNetworkString}.etherscan.io/api?apikey=${ETHERSCAN_API_KEY}&module=account&action=tokennfttx&contractaddress=${contractAddress}&address=${address}&page=1&offset=100&sort=asc`,
    );

export const timestampToDate = (ts: number): Record<string, number> => {
    console.log(ts);
    const date = new Date(ts * 1000);
    console.log(date);
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

// ethAge.com/api/v1/metadata/[tokenId]
export interface Metadata {
    name: string;
    description: string;
    image: string; // ethAge.com/api/v1/image/[tokenId]
    external_url: string; // ethAge.com/ethAge/[tokenId]
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
            trait_type: 'parent';
            value: string;
        },
        {
            trait_type: 'eth recieved';
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
    ];
}
