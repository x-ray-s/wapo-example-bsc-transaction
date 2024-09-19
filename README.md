### Overview

This is a simple example code for wapo.js. It implements the following features:

- Secure Transactions: Utilize a secure private key to facilitate transactions.
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
npm run dev:server
```

if you want to run the project in wapo runtime, you can run:

```bash
npm run watch

# in another terminal window
npm run start
```

### Build

You can build the project by running:

```bash
npm run build
```

It will genurate a final bundle js contain the client code and the server code, All of modules will be put in this file.

### Run in wapo runtime

docker image: [phalanetwork/wapo-devserver]()

```bash
# MD5 checksum:
md5sum ~/Downloads/wapo-devserver-v0.0.6.tar
4b98246110ac81be71bbd7de475d18adad678d93f26688ea59016edb7a411472

# load image
sudo docker load -i wapo-devserver-v0.0.6.tar
sudo docker tag 7abe9b275764 phalanetwork/wapo-devserver:latest

# run container with our project
# or npm run start
docker run --rm --name wapo -p 8000:80 -v $(pwd)/dist:/home/wapo phalanetwork/wapo-devserver


# post .env to container
curl http://127.0.0.1:8000/vaults -H 'Content-Type: application/json' -d '{"cid":"local", "data": {"SECRET_KEY": "YOUR_SECRET_KEY"}}'

# get container logs
curl http://127.0.0.1:8000/logs/all/local
```

### Deploy in phala network

1. Build project

2. Upload to IPFS

I use [thirdweb](https://thirdweb.com/) to upload the dist folder to IPFS, and get the IPFS CID.

```bash
 thirdweb upload dist/index.js -k MY_THIRDWEB_SECRET_KEY --skip-update-check
# Files stored at the following IPFS URI: ipfs://YOUR_CID
```

3. set secret key through the API

```bash
curl https://wapo-testnet.phala.network/vaults -H 'Content-Type: application/json' -d '{"cid": "YOUR_CID", "data": {"SECRET_KEY": "YOUR_SECRET_KEY"}'
# result: {"token":"13ea...77597","key":"3f6ae...75e88","succeed":true}

# or use script
CID=YOUR_CID node ./scripts/publish-env.mjs
```

4. visit https://wapo-testnet.phala.network/ipfs/IPFS_CID?key=KEY

### Useful links

- Get testnet TEST token from [testnet faucet](https://www.alchemy.com/faucets/base-sepolia)
- Get testnet RPC from [JSON-RPC Endpoint](https://docs.base.org/docs/using-base)
- A starter project for wapo.js: [minimal-wapo-ts-starter](https://github.com/Leechael/minimal-wapo-ts-starter)
