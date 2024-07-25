async function main() {
   const [deployer] = await ethers.getSigners();

   console.log("Deploying contracts with the account:", deployer.address);
   console.log("Account balance:", (await deployer.getBalance()).toString());

   const KZToken = await ethers.getContractFactory("KZToken");
   const token = await KZToken.deploy(deployer.address);
   await token.deployed();

   console.log("KZToken deployed to:", token.address);
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
       console.error(error);
       process.exit(1);
   });
