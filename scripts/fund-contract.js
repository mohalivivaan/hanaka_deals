const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const network = hre.network.name;
  const deploymentFile = path.join(__dirname, `../deployments/${network}.json`);

  if (!fs.existsSync(deploymentFile)) {
    console.log("❌ No deployment found for network:", network);
    return;
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  const contractAddress = deployment.contractAddress;
  const fundAmount = process.argv[2] || "0.1"; // Default 0.1 BNB

  console.log("💰 Funding contract with test BNB...");
  console.log("📍 Contract:", contractAddress);
  console.log("💵 Amount:", fundAmount, "BNB");

  const [deployer] = await hre.ethers.getSigners();
  
  try {
    const tx = await deployer.sendTransaction({
      to: contractAddress,
      value: hre.ethers.parseEther(fundAmount),
    });

    console.log("📤 Transaction sent:", tx.hash);
    await tx.wait();
    console.log("✅ Contract funded successfully!");
    
    // Check new balance
    const balance = await hre.ethers.provider.getBalance(contractAddress);
    console.log("💰 New contract balance:", hre.ethers.formatEther(balance), "BNB");
    
  } catch (error) {
    console.log("❌ Funding failed:", error.message);
  }
}

main().catch(console.error);