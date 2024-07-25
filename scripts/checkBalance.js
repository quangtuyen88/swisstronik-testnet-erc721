const hre = require("hardhat");
const { ethers } = hre;
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

const sendShieldedQuery = async (provider, destination, data) => {
  const rpclink = hre.network.config.url;
  const [encryptedData, usedEncryptedKey] = await encryptDataField(rpclink, data);
  const response = await provider.call({
    to: destination,
    data: encryptedData,
  });
  return await decryptNodeResponse(rpclink, response, usedEncryptedKey);
};

async function main() {
  const contractAddress = "0xdc44675a2E3Ac9FC6eF6882251af414821c19E18"; // Replace with your deployed contract address
  const [signer] = await ethers.getSigners();
  const contractFactory = await ethers.getContractFactory("KZToken");
  const contract = contractFactory.attach(contractAddress);

  const toAddress = "0xb9E500CF14b355f50217f1a89040DF1765C5E70e"; // Replace with the recipient address
  const balanceOfFunctionName = "balanceOf";
  const balanceData = contract.interface.encodeFunctionData(balanceOfFunctionName, [toAddress]);

  const response = await sendShieldedQuery(signer.provider, contractAddress, balanceData);
  const decodedResponse = contract.interface.decodeFunctionResult(balanceOfFunctionName, response);

  console.log(`Token balance of ${toAddress}: ${decodedResponse[0].toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
