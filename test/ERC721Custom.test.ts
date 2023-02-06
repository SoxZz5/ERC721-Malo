import * as chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers } from 'hardhat';
import { expect } from 'chai';
import { ERC721Custom, ERC721Custom__factory } from '../typechain-types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(solidity);

describe('ERC721Custom Contract test', function () {
  let ContractFactory: ERC721Custom__factory,
    Contract: ERC721Custom,
    owner: SignerWithAddress,
    receiver: SignerWithAddress,
    impostor: SignerWithAddress;

  before(async function () {
    [owner, receiver, impostor] = await ethers.getSigners();
    ContractFactory = await ethers.getContractFactory('ERC721Custom');
  });

  beforeEach(async function () {
    Contract = await ContractFactory.deploy(
      'tokenName',
      'tokenSymbol',
      'ipfs://',
      owner.address
    );
    await Contract.deployed();
  }),
    it('Must deploy', async function () {
      expect(Contract !== null);
    });

  it('Must be possible to mint 12 NFT if owner', async function () {
    for (let i = 0; i < 12; i++) {
      await Contract.mint(receiver.address);
    }
    expect(
      await (await Contract.balanceOf(receiver.address)).toNumber()
    ).to.equal(12);
  });

  it('Must not be possible to mint a NFT if not owner', async function () {
    try {
      await Contract.connect(impostor).mint(receiver.address);
    } catch (error: any) {
      expect(error.message).to.include('Ownable: caller is not the owner');
    }
  });

  it('Must not be possible to mint more than 12 NFT', async function () {
    for (let i = 0; i < 12; i++) {
      await Contract.mint(receiver.address);
    }
    expect(
      await (await Contract.balanceOf(receiver.address)).toNumber()
    ).to.equal(12);
    try {
      await Contract.mint(receiver.address);
    } catch (error: any) {
      expect(error.message).to.include("Can't mint more token");
    }
  });

  it('Must return base URI', async function () {
    const baseURI = await Contract.baseTokenURI();
    expect(baseURI).to.equal('ipfs://');
    const uri = await Contract.tokenURI(0);
    expect(uri).to.equal('ipfs://.json');
  });
});
