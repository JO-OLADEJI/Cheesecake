import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";

describe("Whitelist", () => {
  let Whitelist: Contract;
  const maxWhitelistAccounts = 20;

  beforeEach(async () => {
    const whitelist = await ethers.getContractFactory("Whitelist");
    Whitelist = await whitelist.deploy(maxWhitelistAccounts);
    await Whitelist.deployed();
  });


  it("Should set the max number of whitelist address to the value passed at deployment", async () => {
    expect(await Whitelist.maxWhitelistedAddresses()).to.equal(
      maxWhitelistAccounts
    );
  });

  it('should add an address to whitelist when addAddressToWhitelist() is called', async () => {
    const [deployer, addr1] = await ethers.getSigners();
    const whitelistCount: BigNumber = await Whitelist.numAddressesWhitelisted();
    const whitelistTx = await Whitelist.connect(addr1).addAddressToWhitelist();
    await whitelistTx.wait();

    expect(await Whitelist.whitelistedAddresses(addr1['address'])).to.equal(true);
    expect(await Whitelist.numAddressesWhitelisted()).to.equal(BigNumber.from('1').add(whitelistCount));
  });

  it('should revert when an address tries to be whitelisted more than once', async () => {
    const [deployer, addr1] = await ethers.getSigners();
    const whitelistTx = await Whitelist.connect(addr1).addAddressToWhitelist();
    await whitelistTx.wait();

    await expect(
      Whitelist.connect(addr1).addAddressToWhitelist()
    ).to.be.revertedWith('ALREADY_WHITELISTED');
  });

  it('should revert when an address tries to get whitelisted but maximum whitelist count is reached', async () => {
    const maxWhitelistAccounts = 1; // overriding the global varible
    const whitelist = await ethers.getContractFactory("Whitelist");
    Whitelist = await whitelist.deploy(maxWhitelistAccounts);
    await Whitelist.deployed();

    const [deployer, addr1] = await ethers.getSigners();
    const whitelistTx1 = await Whitelist.connect(deployer).addAddressToWhitelist();
    await whitelistTx1.wait();

    await expect(
      Whitelist.connect(addr1).addAddressToWhitelist()
    ).to.be.revertedWith('WHITELIST_LIMIT_REACHED');
  });

});
