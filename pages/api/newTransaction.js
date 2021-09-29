// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  console.log('query', req.query);
  console.log('body', req.body);

  res.status(200).json(req.body);
}