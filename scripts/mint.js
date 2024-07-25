const hre = require("hardhat");
const { ethers } = hre;
const { encryptDataField } = require("@swisstronik/utils");

const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpclink = hre.network.config.url;
  const [encryptedData] = await encryptDataField(rpclink, data);
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  const contractAddress = "0xdc44675a2E3Ac9FC6eF6882251af414821c19E18"; // Replace with your deployed contract address
  const [signer] = await ethers.getSigners();
  const contractFactory = await ethers.getContractFactory("KZToken");
  const contract = contractFactory.attach(contractAddress);

  const toAddress = "0xb9E500CF14b355f50217f1a89040DF1765C5E70e"; // Replace with the recipient address
  const tokenId = 101; // Replace with the token ID you want to mint

  const mintFunctionName = "mint";
  const mintData = contract.interface.encodeFunctionData(mintFunctionName, [toAddress, tokenId]);

  const mintTx = await sendShieldedTransaction(signer, contractAddress, mintData, 0);
  await mintTx.wait();

  console.log(`Token ID ${tokenId} minted to ${toAddress}`);
  console.log("Transaction Receipt: ", mintTx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
