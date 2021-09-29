// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const fetcher = url => fetch(url).then(r => r.json());

const NETWORK = process.env.NETWORK;
const ETHERSCAN_API_KEY = process.env.NETWORK;
const APP_NAME = 'StarSheet Achievements';
const etherscanNetworkString = process.env.NETWORK == "ethereum" ? "" : `${NETWORK}`;

const etherscanAPI = address => `https://api${etherscanNetworkString}.etherscan.io/api?apikey=${ETHERSCAN_API_KEY}&module=account&action=txlist&address=${address}&startblock=0&endblock=999999999&sort=asc`;

export default async function handler(req, res) {
  console.log('query', req.query);
  console.log('body', req.body);

  const { app, network, activity } = req.body;

  const newUserAddress = activity.fromAddress;
  if(app==APP_NAME && network==NETWORK) {
    const etherscanURL = etherscanAPI(newUserAddress);

    const data = await fetcher(etherscanURL);
    console.log('data', data);
  }
  

  res.status(200).json(req.body);
}
// https://api.etherscan.io/api?apikey={{etherscan api key}}&module=account&action=txlist&address={{brenner.eth addresss}}&startblock=0&endblock=999999999&sort=asc   