// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const fetcher = url => fetch(url).then(r => r.json());

const NETWORK = process.env.NETWORK;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const APP_NAME = 'StarSheet Achievements';
const etherscanNetworkString = process.env.NETWORK == 'ethereum' ? '' : `-${NETWORK}`;

const etherscanAPI = address => `https://api${etherscanNetworkString}.etherscan.io/api?apikey=${ETHERSCAN_API_KEY}&module=account&action=txlist&address=${address}&startblock=0&endblock=999999999&sort=asc&page=1&offset=1`;

export default async function handler(req, res) {
  // console.log('query', req.query);
  // console.log('body', req.body);

  // console.log('alchemy signature', req.headers?.['x-alchemy-signature']);

  const { app, network, activity } = req.body;

  //check alchemy signature

  const newUserAddress = activity[0].fromAddress;

  // console.log('app:', app, '\nnetwork', network, '\nactivity', activity);

  if(app.includes(APP_NAME) && network==NETWORK) {
    const etherscanURL = etherscanAPI(newUserAddress);
    // console.log('etherscanURL:', etherscanURL);

    const { status, message, result} = await fetcher(etherscanURL);

    // check if status is other than 1

    const data = {
      address: newUserAddress,
      blockNumber: result[0].blockNumber,
      timeStamp: result[0].timeStamp,
      hash: result[0].hash,
      achievementName: 'Adress Block Age',
      signature: 'temp signature',
    };

    console.log('data:', data);
  }
  

  res.status(200).json(req.body);
}
// https://api.etherscan.io/api?apikey={{etherscan api key}}&module=account&action=txlist&address={{brenner.eth addresss}}&startblock=0&endblock=999999999&sort=asc   