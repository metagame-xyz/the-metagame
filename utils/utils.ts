import { createHmac } from 'crypto';
import type { NextApiRequest } from 'next';
import * as ethers from 'ethers';
import fetch from 'node-fetch-retry';
import Redis from 'ioredis';

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
