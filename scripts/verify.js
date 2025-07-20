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

  console.log("🔐 Verifying contract on BSCScan...");
  console.log("📍 Contract address:", contractAddress);
  console.log("🌐 Network:", network);

  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });
    console.log("✅ Contract verified successfully!");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract is already verified!");
    } else {
      console.log("❌ Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });