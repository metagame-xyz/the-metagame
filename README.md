## Adress Block Age

Deployed on Vercel

Alchemy Notify when a wallet interacts with a specific contract (The StarSheet Contract, for instance)

We take the `fromAddress` and query the Etherscan API to find the earliest block the address has interacted with

We store relevant data in upstashDB (a presistent database wrapper for redis)

This data can now be queried by a StarSheet holder to get their data and append it to their Ceramic / IDX DID (decentralized ID)


To run a development server locally:

```bash
npm run dev
# or
yarn dev
```
