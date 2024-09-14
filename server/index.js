if (process.env.RUNTIME !== "wapo") {
  require("dotenv").config();
} else {
  require("@phala/wapo-env");
}

const ethers = require("ethers");
const BSC_RPC_URL = "https://bsc-testnet-dataseed.bnbchain.org"; // testnet
const bscProvider = new ethers.JsonRpcProvider(BSC_RPC_URL);

async function sendBNB(to, amount) {
  const signer = new ethers.Wallet(process.env.SECRET_KEY, bscProvider);

  const balance = ethers.formatUnits(
    await bscProvider.getBalance(signer.address)
  );

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
  const signer = new ethers.Wallet(process.env.SECRET_KEY, bscProvider);

  const address = signer.address;
  const balance = ethers.formatUnits(await bscProvider.getBalance(address));
  return {
    address,
    balance,
  };
}

module.exports = {
  sendBNB,
  checkWhitelist,
  info,
  getWhitelist,
};
