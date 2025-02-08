const hre = require("hardhat");

async function main() {
  const ReviewStorage = await hre.ethers.getContractFactory("ReviewStorage");
  const reviewStorage = await ReviewStorage.deploy();

  await reviewStorage.waitForDeployment();  

  const contractAddress = await reviewStorage.getAddress();  // ✅ FIXED!

  console.log(`✅ Contract deployed at: ${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
