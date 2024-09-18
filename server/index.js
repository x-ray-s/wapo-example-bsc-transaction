if (process.env.RUNTIME !== "wapo") {
  require("dotenv").config();
} else {
  require("@phala/wapo-env");
}

const ethers = require("ethers");
// const fetch = require("node-fetch");
const BSC_RPC_URL = "https://sepolia.base.org"; // testnet
const provider = new ethers.JsonRpcProvider(BSC_RPC_URL);
let wapoENV = {};
if (process.env.RUNTIME === "wapo") {
  wapoENV = JSON.parse(process.env.secret);
}
const secret = process.env.SECRET_KEY || wapoENV.SECRET_KEY;
async function send(to, amount) {
  const signer = new ethers.Wallet(secret, provider);

  const balance = ethers.formatUnits(await provider.getBalance(signer.address));

  if (balance < amount) {
    throw new Error("Insufficient balance");
  }

  const tx = await signer.sendTransaction({
    to,
    value: ethers.parseUnits(amount),
  });

  return tx;
}
const whitelist = ["0x6572005F94AfbbeE1EdF2D5143C8514459C8760D"];
function checkWhitelist(address) {
  //You can use external contracts or APIs, the hardcoded code is just for example
  return whitelist
    .map((address) => address.toLowerCase())
    .includes(address.toLowerCase());
}
function getWhitelist() {
  return whitelist;
}

async function info() {
  // example code, you can get transaction info from the blockchain

  const signer = new ethers.Wallet(secret, provider);

  const address = signer.address;
  const balance = ethers.formatUnits(await provider.getBalance(address));

  return {
    address,
    balance,
  };
}

module.exports = {
  send,
  checkWhitelist,
  info,
  getWhitelist,
};
