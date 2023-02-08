import { ethers } from 'hardhat';

async function main() {
  const [owner] = await ethers.getSigners();
  let ownerAddress = process.env.OWNER_ADDRESS;
  if (!ownerAddress) ownerAddress = owner.address;
  console.log(`OWNER FOR NFT CONTRACT: ${ownerAddress}`);
  const ERC721CustomFactory = await ethers.getContractFactory('ERC721Custom');
  const tokenName = process.env.TOKEN_NAME ?? '';
  const tokenSymbol = process.env.TOKEN_SYMBOL ?? '';
  const baseURI = process.env.BASE_URI ?? '';
  console.log(`TOKEN NAME: ${tokenName}`);
  console.log(`TOKEN SYMBOL: ${tokenSymbol}`);
  console.log(`BASE URI: ${baseURI}`);
  const ERC721Custom = await ERC721CustomFactory.deploy(
    tokenName,
    tokenSymbol,
    baseURI,
    owner.address
  );
  console.log(`NFT CONTRACT DEPLOYING`);
  await ERC721Custom.deployed();
  console.log(`NFT CONTRACT DEPLOYED: ${ERC721Custom.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
