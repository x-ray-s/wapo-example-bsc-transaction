#!/usr/bin/env node

import dotenv from 'dotenv';

dotenv.config();

const r = await fetch('http://127.0.0.1:8000/vaults', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    cid: 'local',
    data: {
      SECRET_KEY: process.env.SECRET_KEY,
    },
  }),
}).then((r) => r.json());

console.info('open browser to http://localhost:8000/local?key=' + r.key);
