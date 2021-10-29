import type { NextApiRequest, NextApiResponse } from 'next';

import { VERCEL_URL } from '@utils/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const metadata = {
        name: 'Birthblock',
        description:
            "Birthblocks are art and attributes based on the birthblock of the minter's wallet address",
        image: `https://${VERCEL_URL}/public/logo.png`,
        external_link: `https://${VERCEL_URL}`,
        seller_fee_basis_points: 800, // 8%,
        fee_recipient: '0x7d0414B0622f485D0368602E76F502CabEf57bf4',
    };

    res.send(metadata);
}
