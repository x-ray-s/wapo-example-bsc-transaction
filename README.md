### Overview

This is a simple example code for wapo.js. It implements the following features:

- Secure BNB Transactions: Utilize a secure private key to facilitate BNB (Binance Coin) transactions.
- Whitelist Verification: Implement a check to determine if a given address is in the whitelist.
- Simplified API Interface: Offer a API to pass information
- Simplified UI: A example UI to use the API

### Development

You can develop like other web projects, use vite to build and run the client project.

```bash
npm run dev:client
```

and run the server project:

```bash
npm run serve
```

You also use other js runtime to run the project, like `deno` or `bun`, or use `ts-node-dev` or `nodemon` to run the server project for better development experience.

### Build

You can build the project by running:

```bash
npm run build
```

It will genurate a final bundle js contain the client code and the server code, All of modules will be put in this file.

### Run in wapo runtime

docker image: [phalanetwork/wapo-devserver]() or [download](https://cdn.discordapp.com/attachments/1270048783266353256/1283797522946461757/wapo-devserver-v0.0.5.tar?ex=66e6475d&is=66e4f5dd&hm=779ea1103c8c104eaf5ade3a1f54379de643044928a6e4f34a53eb7bde63d9e0&)

```bash
# MD5 checksum:
md5sum ~/Downloads/wapo-devserver-v0.0.5.tar
6b1bf31d3a75f0d534ba6d5a9aa9853f

# load image
sudo docker load -i wapo-devserver-v0.0.5.tar
sudo docker tag 7abe9b275764 phalanetwork/wapo-devserver:latest

# run container with our project
docker run --rm --name wapo -p 8000:80 -v $(pwd)/dist:/home/wapo phalanetwork/wapo-devserver
```

### Useful links

- Get testnet BNB token from [BNB testnet faucet](https://www.bnbchain.org/en/testnet-faucet)
- Get testnet RPC from [BNB JSON-RPC Endpoint](https://docs.bnbchain.org/bnb-smart-chain/developers/rpc/#bsc-testnet-chainid-0x61-97-in-decimal)
