import { ethers } from "hardhat";
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";


describe('Cheesecake NFT', () => {
  let Whitelist: Contract;
  let CheesecakeNFT: Contract;
  let presaleDuration: number;
  let mintPrice = ethers.utils.parseEther('0.01');
  let baseURI = 'https://test.com/example.jpeg';
  let maxSupply = 20;
  
  beforeEach(async () => {
    const maxWhitelistedAddresses = 10;
    const whitelist = await ethers.getContractFactory('Whitelist');
    Whitelist = await whitelist.deploy(maxWhitelistedAddresses);
    await Whitelist.deployed();

    const Cheesecake = await ethers.getContractFactory('CheesecakeNFT');
    CheesecakeNFT = await Cheesecake.deploy(baseURI, Whitelist['address'], maxSupply);
    await CheesecakeNFT.deployed();
  });

  /**
   * function to create an artificial delay
   * @param countdown amount of delay in seconds
   * @returns {Promise<any>}
   */
  const delay = (countdown: number): Promise<any> => new Promise((resolve) => setTimeout(resolve, countdown * 1000));


  describe('constructor', () => {
    
    it('should set the maxTokenIds to the maxSupply argument passed at deployment', async () => {
      expect(
        await CheesecakeNFT.maxTokenIds()
      ).to.equal(maxSupply);
    });

  });


  describe('Presale Mint', () => {

    it('should mint a token to the sender when presale is running and address is whitelisted', async () => {
      const [deployer, addr1] = await ethers.getSigners();
      presaleDuration = 60; // 60 seconds
      const numberOfERC721TokensBeforeMint: BigNumber = await CheesecakeNFT.tokenIds();
      await Whitelist.connect(addr1).addAddressToWhitelist();
      await CheesecakeNFT.connect(deployer).startPresale(presaleDuration);

      const presaleMintTx = await CheesecakeNFT.connect(addr1).presaleMint({ value: mintPrice });
      await presaleMintTx.wait();

      expect(await CheesecakeNFT.tokenIds()).to.equal(BigNumber.from('1').add(numberOfERC721TokensBeforeMint));
      expect(await CheesecakeNFT.balanceOf(addr1['address'])).to.equal(1);
    });

    it('should revert when an address tries to mint and presale has not started', async () => {
      const [deployer, addr1] = await ethers.getSigners();
      await Whitelist.connect(addr1).addAddressToWhitelist();

      await expect(
        CheesecakeNFT.connect(addr1).presaleMint({ value: mintPrice })
      ).to.be.revertedWith('PRESALE_NOT_RUNNING');
    });

    it('should revert when an address tries to mint and presale has ended', async () => {
      const [deployer, addr1] = await ethers.getSigners();
      presaleDuration = 5; // 5 seconds
      await Whitelist.connect(addr1).addAddressToWhitelist();
      await CheesecakeNFT.connect(deployer).startPresale(presaleDuration);

      await delay(presaleDuration);

      await expect(
        CheesecakeNFT.connect(addr1).presaleMint({ value: mintPrice })
      ).to.be.revertedWith('PRESALE_NOT_RUNNING');
    });

    it('should revert if sender is not whitelisted', async () => {
      const [deployer, addr1] = await ethers.getSigners();
      presaleDuration = 60; // 60 seconds
      await CheesecakeNFT.connect(deployer).startPresale(presaleDuration);

      await expect(
        CheesecakeNFT.connect(addr1).presaleMint({ value: mintPrice })
      ).to.be.revertedWith('ADDRESS_NOT_WHITELISTED');
    });

    it('should revert if ether sent is less than the mint price', async () => {
      const [deployer, addr1] = await ethers.getSigners();
      presaleDuration = 60; // 60 seconds
      await Whitelist.connect(addr1).addAddressToWhitelist();
      await CheesecakeNFT.connect(deployer).startPresale(presaleDuration);

      await expect(
        CheesecakeNFT.connect(addr1).presaleMint({ value: mintPrice.sub(BigNumber.from('1')) })
      ).to.be.revertedWith('INSUFFCIENT_ETHER_SENT');
    });

    it('should revert when max supply is reached', async () => {
      maxSupply = 2;
      const Cheesecake = await ethers.getContractFactory('CheesecakeNFT');
      CheesecakeNFT = await Cheesecake.deploy(baseURI, Whitelist['address'], maxSupply);
      await CheesecakeNFT.deployed();

      const [deployer, addr1, addr2] = await ethers.getSigners();
      presaleDuration = 60; // 60 seconds
      await Whitelist.connect(addr1).addAddressToWhitelist();
      await Whitelist.connect(addr2).addAddressToWhitelist();
      await Whitelist.connect(deployer).addAddressToWhitelist();

      await CheesecakeNFT.connect(deployer).startPresale(presaleDuration);

      await CheesecakeNFT.connect(addr1).presaleMint({ value: mintPrice });
      await CheesecakeNFT.connect(addr2).presaleMint({ value: mintPrice });

      await expect(
        CheesecakeNFT.connect(deployer).presaleMint({ value: mintPrice })
      ).to.be.revertedWith('MAX_SUPPLY_REACHED');
    });

    it('should revert if contract is currently paused', async () => {
      const [deployer, addr1] = await ethers.getSigners();
      presaleDuration = 60; // 60 seconds
      await Whitelist.connect(addr1).addAddressToWhitelist();
      await CheesecakeNFT.connect(deployer).startPresale(presaleDuration);
      await CheesecakeNFT.connect(deployer).setPaused(true);

      await expect(
        CheesecakeNFT.connect(addr1).presaleMint({ value: mintPrice })
      ).to.be.revertedWith('CONTRACT_PAUSED');
    });

  });


  describe('Public Mint', () => {
    
  });


  describe('Receiving and Withdrawal', () => {

  });

});