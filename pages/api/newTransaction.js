// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const fetcher = url => fetch(url).then(r => r.json());

// need to add which testnet
const etherscanAPI = address => `https://api.etherscan.io/api?apikey=${process.env.ETHERSCAN_API_KEY}&module=account&action=txlist&address=${address}&startblock=0&endblock=999999999&sort=asc`;

export default function handler(req, res) {
  console.log('query', req.query);
  console.log('body', req.body);

  APP_NAME = 'StarSheet Achievements';
  NETWORK = process.env.NETWORK;

  ({ app, network, activity } = req.body);

  const newUserAddress = activity.fromAddress;
  if(app==APP_NAME && network==NETWORK) {
    const etherscanURL = etherscanAPI(newUserAddress);

    const data = await fetcher(etherscanURL);
    // console.log
  }
  

  res.status(200).json(req.body);
}
// https://api.etherscan.io/api?apikey={{etherscan api key}}&module=account&action=txlist&address={{brenner.eth addresss}}&startblock=0&endblock=999999999&sort=asc