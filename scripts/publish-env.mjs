#!/usr/bin/env node

import dotenv from 'dotenv';

dotenv.config();

const r = await fetch('https://wapo-testnet.phala.network/vaults', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    cid: process.env.CID,
    data: {
      SECRET_KEY: process.env.SECRET_KEY,
    },
  }),
}).then((r) => r.json());

console.info(
  `open browser to https://wapo-testnet.phala.network/ipfs/${process.env.CID}?key=${r.key}"`
);
