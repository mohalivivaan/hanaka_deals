# 🚀 Quick Contract Deployment Guide

## Step 1: Get Required Credentials

### 1. Create Test Wallet
- Create a new MetaMask wallet (for testing only)
- Export the private key (without 0x prefix)
- **⚠️ NEVER use your main wallet!**

### 2. Get Test BNB
- Visit: https://testnet.binance.org/faucet-smart
- Enter your test wallet address
- Request 0.1 BNB for gas fees

### 3. Get BSCScan API Key (Optional)
- Visit: https://bscscan.com/apis
- Create account and generate API key
- This enables automatic contract verification

## Step 2: Quick Setup

### 1. Initialize Environment
```bash
npm run setup
```

### 2. Add Your Credentials
Edit the `.env` file:
```env
PRIVATE_KEY=your_private_key_without_0x_prefix
BSCSCAN_API_KEY=your_api_key_optional
```

### 3. Deploy Contract
```bash
npm run deploy
```

## Step 3: Verify Deployment

After deployment, you'll see:
```
✅ BNBDistributor deployed successfully!
📍 Contract address: 0xYourNewContractAddress
📝 Updating React app configuration...
✅ React config updated successfully!
```

Your app will automatically refresh with the new contract address!

## Troubleshooting

### "Insufficient funds"
- Get more test BNB from the faucet
- Make sure you have at least 0.01 BNB

### "Private key invalid"
- Remove 0x prefix from private key
- Ensure it's 64 characters long

### "Network error"
- Check internet connection
- Try again in a few minutes

## Alternative: Manual Deployment

If automated deployment doesn't work:

1. **Use Remix IDE**: https://remix.ethereum.org/
2. **Copy contract code** from `contracts/BNBDistributor.sol`
3. **Deploy to BSC Testnet** (Chain ID: 97)
4. **Copy contract address**
5. **Update** `src/config/contract.ts` manually:
   ```typescript
   export const CONTRACT_ADDRESS = "0xYourDeployedAddress";
   ```

## Need Help?

- Check console for detailed error messages
- Verify you're on BSC Testnet (Chain ID: 97)
- Ensure contract address is valid (42 characters, starts with 0x)