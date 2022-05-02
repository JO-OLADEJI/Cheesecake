import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";


describe('CreamToken', () => {
  let Whitelist: Contract;
  let CheesecakeNFT: Contract;
  let CreamToken: Contract;
  let creamTokenPrice: BigNumber;

  beforeEach(async () => {
    const maxWhitelistedAddresses = 10;
    const whitelist = await ethers.getContractFactory('Whitelist');
    Whitelist = await whitelist.deploy(maxWhitelistedAddresses);

    const baseURI = 'https://test.com/example.jpeg';
    const maxSupply = 20;
    const cheesecakeNft = await ethers.getContractFactory('CheesecakeNFT');
    CheesecakeNFT = await cheesecakeNft.deploy(baseURI, Whitelist['address'], maxSupply);

    const creamToken = await ethers.getContractFactory('CreamToken');
    CreamToken = await creamToken.deploy(CheesecakeNFT['address']);
    creamTokenPrice = await CreamToken.tokenPrice();
  });


  describe('Mint', () => {

    it('should mint the specified amount of tokens when mint() is called', async () => {
      const [deployer, addr1] = await ethers.getSigners();
      const amount = 1;
      const mintTx = await CreamToken.connect(addr1).mint(
        amount, 
        { value: creamTokenPrice.mul(BigNumber.from(amount)) }
      );
      await mintTx.wait();
      
      expect(
        await CreamToken.balanceOf(addr1['address'])
      ).to.equal(ethers.utils.parseEther(String(amount)));
    });

    it('should revert when mint() is called with an incorrect value sent', async () => {
      const [deployer, addr1] = await ethers.getSigners();
      const amount = 1;
      await expect(
        CreamToken.connect(addr1).mint(
          amount,
          { value: creamTokenPrice.div(BigNumber.from(2)) }
        )
      ).to.be.revertedWith('INCORRECT_ETHER_SENT');
    });

    it('should revert if mint() would cause exceedance of max token supply', async () => {
      const [deployer, addr1] = await ethers.getSigners();

      const maxSupply: BigNumber = await CreamToken.maxTotalSupply();
      const remainder = ethers.utils.parseEther('1');
      const initialMintAmount = Number(ethers.utils.formatEther(maxSupply.sub(remainder)));
      const initialMintTx = await CreamToken.connect(deployer).mint(
        initialMintAmount,
        { value: creamTokenPrice.mul(BigNumber.from(initialMintAmount)) }
      );
      await initialMintTx.wait();

      const newMintAmount = Number(ethers.utils.formatEther(remainder.mul(BigNumber.from(2))));
      await expect(
        CreamToken.connect(addr1).mint(
          newMintAmount,
          { value: creamTokenPrice.mul(BigNumber.from(newMintAmount)) }
        )
      ).to.be.revertedWith('MAX_SUPPLY_EXCEEDED');
    });

  });


  describe('Claim', () => {
    const presaleEpoch = 15; // 15 seconds

    const whitelist = async (address: SignerWithAddress): Promise<void> => {
      await Whitelist.connect(address).addAddressToWhitelist();
    }

    const startPresale = async (timespan: number): Promise<void> => {
      const [deployer] = await ethers.getSigners();
      const presaleTx = await CheesecakeNFT.connect(deployer).startPresale(timespan);
      await presaleTx.wait();
    }
  
    const mintNFT = async (address: SignerWithAddress): Promise<void> => {
      const mintPrice: BigNumber = await CheesecakeNFT._price();
      const mintTx = await CheesecakeNFT.connect(address).mint({ value: mintPrice });
      await mintTx.wait();
    }

    const delay = async (timespan: number): Promise<void> => new Promise((resolve, reject) => setTimeout(resolve, timespan * 1000));


    it('should mint the required proportion of unclaimed tokens per NFT to caller address', async () => {
      const [deployer, addr1] = await ethers.getSigners();
      await whitelist(addr1);
      await startPresale(presaleEpoch);
      await delay(presaleEpoch);
      await mintNFT(addr1);

      const tokensPerNFT: BigNumber = await CreamToken.tokensPerNFT();
      const senderNFTBalance: BigNumber = await CheesecakeNFT.balanceOf(addr1['address']);

      const claimTx = await CreamToken.connect(addr1).claim();
      await claimTx.wait();

      expect(
        await CreamToken.balanceOf(addr1['address'])
      ).to.equal(tokensPerNFT.mul(senderNFTBalance));
    });

    it('should revert when caller has no cheesecake NFT balance', async () => {
      const [deployer, addr1] = await ethers.getSigners();

      expect(
        CreamToken.connect(addr1).claim()
      ).to.be.revertedWith('ZERO_CHEESECAKE_OWNED');
    });

    it('should revert when claim() is called and tokens have been claimed for all NFTs in callers balance', async () => {
      const [deployer, addr1] = await ethers.getSigners();
      await whitelist(addr1);
      await startPresale(presaleEpoch);
      await delay(presaleEpoch);
      await mintNFT(addr1);

      const claimTx = await CreamToken.connect(addr1).claim();
      await claimTx.wait();

      expect(
        CreamToken.connect(addr1).claim()
      ).to.be.revertedWith('ALL_TOKENS_CLAIMED');
    });

  });

});