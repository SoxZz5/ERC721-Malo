import * as dotenv from 'dotenv';

import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

dotenv.config();

task('verify:contract', async (taskArgs, hre) => {
  const [owner] = await hre.ethers.getSigners();
  let ownerAddress = process.env.OWNER_ADDRESS;
  if (!ownerAddress) ownerAddress = owner.address;
  console.log(`OWNER FOR NFT CONTRACT: ${ownerAddress}`);
  const tokenName = process.env.TOKEN_NAME ?? '';
  const tokenSymbol = process.env.TOKEN_SYMBOL ?? '';
  const baseURI = process.env.BASE_URI ?? '';
  console.log(`TOKEN NAME: ${tokenName}`);
  console.log(`TOKEN SYMBOL: ${tokenSymbol}`);
  console.log(`BASE URI: ${baseURI}`);
  await hre.run('verify:verify', {
    address: process.env.CONTRACT_ADDRESS ?? '',
    constructorArguments: [tokenName, tokenSymbol, baseURI, owner.address],
  });
});

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.18',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    main: {
      url: process.env.ETH_URL || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    mumbai: {
      url: process.env.MUMBAI_URL || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    token: 'ETH',
    showTimeSpent: true,
    showMethodSig: true,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY ?? '',
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_APIKEY ?? '',
      polygonMumbai: process.env.POLYGONSCAN_APIKEY ?? '',
    },
  },
};

export default config;
