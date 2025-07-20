# 🚀 Automated Smart Contract Deployment Guide

This guide provides a complete automated deployment solution for your BSC Testnet BNB Distributor contract.

## 📋 Prerequisites

### Required Credentials:
1. **Private Key** - Test wallet private key (without 0x prefix)
2. **BSCScan API Key** - For contract verification (optional)
3. **Test BNB** - For deployment gas fees

### Get Required Credentials:

#### 1. Test Wallet Private Key
```bash
# Create a new test wallet in MetaMask
# Export private key (Settings > Security & Privacy > Export Private Key)
# ⚠️ NEVER use your main wallet private key!
```

#### 2. BSCScan API Key (Optional)
```bash
# Visit: https://bscscan.com/apis
# Create account and generate API key
# This enables automatic contract verification
```

#### 3. Test BNB
```bash
# Visit: https://testnet.binance.org/faucet-smart
# Enter your test wallet address
# Request test BNB for gas fees
```

## 🔧 Setup Process

### 1. Initialize Environment
```bash
npm run setup
```
This creates `.env` file and necessary directories.

### 2. Configure Environment
Edit `.env` file with your credentials:
```env
PRIVATE_KEY=your_private_key_here_without_0x_prefix
BSCSCAN_API_KEY=your_bscscan_api_key_for_verification
```

### 3. Deploy Contract
```bash
npm run deploy
```

## 🎯 Available Commands

| Command | Description |
|---------|-------------|
| `npm run setup` | Initialize deployment environment |
| `npm run compile` | Compile smart contracts |
| `npm run deploy` | Deploy to BSC Testnet |
| `npm run deploy:local` | Deploy to local Hardhat network |
| `npm run verify` | Verify contract on BSCScan |
| `npm run contract:info` | Get deployed contract information |
| `npm run test:contract` | Run contract tests |
| `npm run node` | Start local Hardhat node |

## 🔄 Automated Process

The deployment script automatically:

1. ✅ **Compiles** the smart contract
2. ✅ **Validates** deployment configuration
3. ✅ **Checks** deployer balance
4. ✅ **Deploys** contract to BSC Testnet
5. ✅ **Verifies** contract configuration
6. ✅ **Updates** React app config automatically
7. ✅ **Verifies** contract on BSCScan (if API key provided)
8. ✅ **Saves** deployment information
9. ✅ **Provides** next steps and links

## 📁 Generated Files

After deployment, you'll have:

```
deployments/
├── bscTestnet.json     # Deployment info
contracts/
├── BNBDistributor.sol  # Smart contract
scripts/
├── deploy.js           # Main deployment script
├── verify.js           # Contract verification
├── contract-info.js    # Contract information
└── setup-env.js        # Environment setup
```

## 🔍 Verification

### Automatic Verification
If you provide `BSCSCAN_API_KEY`, the contract will be automatically verified.

### Manual Verification
```bash
npm run verify
```

### Check Contract Info
```bash
npm run contract:info
```

## 🧪 Testing

### Run Contract Tests
```bash
npm run test:contract
```

### Local Development
```bash
# Start local blockchain
npm run node

# Deploy to local network
npm run deploy:local
```

## 🚨 Security Notes

1. **Never use real wallet private keys**
2. **Only use test networks for development**
3. **Keep private keys secure and never commit them**
4. **Use environment variables for sensitive data**
5. **Verify contract addresses before use**

## 🔧 Troubleshooting

### Common Issues:

#### "Insufficient funds for gas"
- Get more test BNB from faucet
- Check wallet balance: `npm run contract:info`

#### "Network connection failed"
- Check BSC Testnet RPC URL
- Verify internet connection
- Try alternative RPC: `https://data-seed-prebsc-2-s1.binance.org:8545`

#### "Contract verification failed"
- Check BSCScan API key
- Wait a few minutes and retry: `npm run verify`
- Manually verify on BSCScan if needed

#### "Private key invalid"
- Ensure private key is without 0x prefix
- Check private key format (64 characters)
- Verify wallet has test BNB

## 📊 Deployment Output Example

```
🚀 Starting automated BNB Distributor deployment...

📋 Deployment Configuration:
   Network: bscTestnet
   Recipient 1: 0xf52f981dafb26dc2ce86e48fbf6fbc2e35cd9444
   Recipient 2: 0x73D5906Cbf60ecD8b5C0F89ae25fbEabeFdc894E
   Auto-update config: true
   Verify contract: true

👤 Deploying with account: 0x1234...5678
💰 Account balance: 0.1 BNB

📦 Compiling and deploying BNBDistributor...
✅ BNBDistributor deployed successfully!
📍 Contract address: 0xabcd...ef01
🔗 BSCScan URL: https://testnet.bscscan.com/address/0xabcd...ef01

🔍 Verifying contract configuration...
   Recipient 1: 0xf52f981dafb26dc2ce86e48fbf6fbc2e35cd9444
   Recipient 2: 0x73D5906Cbf60ecD8b5C0F89ae25fbEabeFdc894E
   Total Amount: 0.05 BNB
   Amount 1: 0.02 BNB
   Amount 2: 0.03 BNB

📝 Updating React app configuration...
✅ React config updated successfully!

🔐 Verifying contract on BSCScan...
✅ Contract verified on BSCScan!

💾 Deployment info saved to: deployments/bscTestnet.json

🎉 Deployment completed successfully!
```

## 🔄 CI/CD Integration

For GitHub Actions automation, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Contract
on:
  push:
    branches: [main]
    paths: ['contracts/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run deploy
        env:
          PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
          BSCSCAN_API_KEY: ${{ secrets.BSCSCAN_API_KEY }}
```

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review console output for specific errors
3. Verify all prerequisites are met
4. Test with local network first: `npm run deploy:local`