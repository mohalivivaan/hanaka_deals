const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

async function main() {
  console.log("🔧 Setting up automated deployment environment...\n");

  // Check if .env exists
  const envPath = path.join(__dirname, "../.env");
  const envExamplePath = path.join(__dirname, "../.env.example");

  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log("📋 Created .env file from .env.example");
    } else {
      // Create basic .env file
      const envContent = `# BSC Testnet Configuration
PRIVATE_KEY=your_private_key_here_without_0x_prefix
BSCTEST_RPC=https://data-seed-prebsc-1-s1.binance.org:8545
BSCSCAN_API_KEY=your_bscscan_api_key_for_verification

# Contract Recipients
RECIPIENT1=0xf52f981dafb26dc2ce86e48fbf6fbc2e35cd9444
RECIPIENT2=0x73D5906Cbf60ecD8b5C0F89ae25fbEabeFdc894E

# Deployment Settings
AUTO_UPDATE_CONFIG=true
VERIFY_CONTRACT=true
`;
      fs.writeFileSync(envPath, envContent);
      console.log("📋 Created .env file with default configuration");
    }
  } else {
    console.log("✅ .env file already exists");
  }

  // Create deployments directory
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
    console.log("📁 Created deployments directory");
  }

  // Create contracts directory if it doesn't exist
  const contractsDir = path.join(__dirname, "../contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
    console.log("📁 Created contracts directory");
  }

  console.log("\n⚠️  IMPORTANT: Please update your .env file with:");
  console.log("   1. Your private key (test wallet only!)");
  console.log("   2. BSCScan API key (optional, for verification)");
  console.log("   3. Recipient addresses if different");
  console.log("\n🔗 Get test BNB: https://testnet.binance.org/faucet-smart");
  console.log("🔗 Get BSCScan API key: https://bscscan.com/apis");
  console.log("\n✅ Setup completed! Run 'npm run deploy' to deploy your contract.");
}

main().catch(console.error);