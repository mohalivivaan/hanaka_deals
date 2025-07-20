const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const network = hre.network.name;
  const deploymentFile = path.join(__dirname, `../deployments/${network}.json`);

  if (!fs.existsSync(deploymentFile)) {
    console.log("❌ No deployment found for network:", network);
    console.log("   Run deployment first: npm run deploy");
    return;
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  const contractAddress = deployment.contractAddress;

  console.log("📋 Contract Information");
  console.log("========================");
  console.log("📍 Address:", contractAddress);
  console.log("🌐 Network:", network);
  console.log("📅 Deployed:", new Date(deployment.timestamp).toLocaleString());
  console.log("👤 Deployer:", deployment.deployer);
  console.log("🔗 Explorer:", `https://testnet.bscscan.com/address/${contractAddress}\n`);

  // Connect to contract and get info
  try {
    const BNBDistributor = await hre.ethers.getContractFactory("BNBDistributor");
    const contract = BNBDistributor.attach(contractAddress);

    console.log("💰 Contract Configuration:");
    const contractInfo = await contract.getContractInfo();
    console.log("   Recipient 1:", contractInfo[0]);
    console.log("   Recipient 2:", contractInfo[1]);
    console.log("   Total Amount:", hre.ethers.formatEther(contractInfo[2]), "BNB");
    console.log("   Amount 1:", hre.ethers.formatEther(contractInfo[3]), "BNB");
    console.log("   Amount 2:", hre.ethers.formatEther(contractInfo[4]), "BNB");

    // Get contract balance
    const balance = await contract.getBalance();
    console.log("   Contract Balance:", hre.ethers.formatEther(balance), "BNB");

    // Check if contract is verified
    console.log("\n🔐 Verification Status:");
    try {
      const code = await hre.ethers.provider.getCode(contractAddress);
      console.log("   Contract Code:", code.length > 2 ? "✅ Deployed" : "❌ Not found");
    } catch (error) {
      console.log("   Contract Code: ❌ Error checking");
    }

  } catch (error) {
    console.log("❌ Error connecting to contract:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });