const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
  console.log("🚀 Starting automated BNB Distributor deployment...\n");

  // Get deployment configuration
  const recipient1 = process.env.RECIPIENT1 || "0xf52f981dafb26dc2ce86e48fbf6fbc2e35cd9444";
  const recipient2 = process.env.RECIPIENT2 || "0x73D5906Cbf60ecD8b5C0F89ae25fbEabeFdc894E";
  const autoUpdateConfig = process.env.AUTO_UPDATE_CONFIG === "true";
  const verifyContract = process.env.VERIFY_CONTRACT === "true";

  console.log("📋 Deployment Configuration:");
  console.log(`   Network: ${hre.network.name}`);
  console.log(`   Recipient 1: ${recipient1}`);
  console.log(`   Recipient 2: ${recipient2}`);
  console.log(`   Auto-update config: ${autoUpdateConfig}`);
  console.log(`   Verify contract: ${verifyContract}\n`);

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Deploying with account:", deployer.address);

  // Check balance
  const balance = await deployer.provider.getBalance(deployer.address);
  const balanceInBNB = hre.ethers.formatEther(balance);
  console.log("💰 Account balance:", balanceInBNB, "BNB");

  if (parseFloat(balanceInBNB) < 0.01) {
    console.log("⚠️  Warning: Low balance. You may need more test BNB for deployment.");
    console.log("   Get test BNB: https://testnet.binance.org/faucet-smart\n");
  }

  // Deploy the contract
  console.log("📦 Compiling and deploying BNBDistributor...");
  const BNBDistributor = await hre.ethers.getContractFactory("BNBDistributor");
  
  const contract = await BNBDistributor.deploy({
    gasLimit: 2000000,
    gasPrice: hre.ethers.parseUnits("10", "gwei"),
  });

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("✅ BNBDistributor deployed successfully!");
  console.log("📍 Contract address:", contractAddress);
  console.log("🔗 BSCScan URL:", `https://testnet.bscscan.com/address/${contractAddress}\n`);

  // Verify contract configuration
  console.log("🔍 Verifying contract configuration...");
  try {
    const contractInfo = await contract.getContractInfo();
    console.log("   Recipient 1:", contractInfo[0]);
    console.log("   Recipient 2:", contractInfo[1]);
    console.log("   Total Amount:", hre.ethers.formatEther(contractInfo[2]), "BNB");
    console.log("   Amount 1:", hre.ethers.formatEther(contractInfo[3]), "BNB");
    console.log("   Amount 2:", hre.ethers.formatEther(contractInfo[4]), "BNB");
  } catch (error) {
    console.log("⚠️  Could not verify contract configuration:", error.message);
  }

  // Update React app configuration
  if (autoUpdateConfig) {
    console.log("\n📝 Updating React app configuration...");
    await updateReactConfig(contractAddress);
  }

  // Verify contract on BSCScan
  if (verifyContract && process.env.BSCSCAN_API_KEY) {
    console.log("\n🔐 Verifying contract on BSCScan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on BSCScan!");
    } catch (error) {
      console.log("⚠️  Contract verification failed:", error.message);
      console.log("   You can manually verify at: https://testnet.bscscan.com/verifyContract");
    }
  }

  // Save deployment info
  await saveDeploymentInfo(contractAddress, hre.network.name);

  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 Next steps:");
  console.log("   1. Fund the contract with test BNB if needed");
  console.log("   2. Test the payment distribution");
  console.log("   3. Update your frontend if auto-update is disabled");
  console.log(`   4. View contract: https://testnet.bscscan.com/address/${contractAddress}`);
}

async function updateReactConfig(contractAddress) {
  const configPath = path.join(__dirname, "../src/config/contract.ts");
  
  try {
    // Read current config
    let configContent = "";
    if (fs.existsSync(configPath)) {
      configContent = fs.readFileSync(configPath, "utf8");
    }

    // Update contract address
    const updatedContent = configContent.replace(
      /export const CONTRACT_ADDRESS = "[^"]*";/,
      `export const CONTRACT_ADDRESS = "${contractAddress}";`
    );

    // Write updated config
    fs.writeFileSync(configPath, updatedContent);
    console.log("✅ React config updated successfully!");
    console.log(`   Updated: ${configPath}`);
  } catch (error) {
    console.log("⚠️  Failed to update React config:", error.message);
    console.log(`   Please manually update CONTRACT_ADDRESS to: ${contractAddress}`);
  }
}

async function saveDeploymentInfo(contractAddress, network) {
  const deploymentInfo = {
    contractAddress,
    network,
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
    deployer: (await hre.ethers.getSigners())[0].address,
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const deploymentFile = path.join(deploymentsDir, `${network}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("💾 Deployment info saved to:", deploymentFile);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });