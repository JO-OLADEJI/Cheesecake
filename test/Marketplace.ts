import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { Contract, BigNumber } from "ethers";
import { ethers } from "hardhat";

describe("NFT Marketplace(fake)", () => {
  let Marketplace: Contract;
  let deployer: SignerWithAddress;
  let addr1: SignerWithAddress;
  let price: BigNumber;

  beforeEach(async () => {
    [deployer, addr1] = await ethers.getSigners();
    const marketplace = await ethers.getContractFactory("Marketplace");
    Marketplace = await marketplace.deploy();
    await Marketplace.deployed();
    price = await Marketplace.getPrice();
  });

  describe("getPrice", () => {
    it("should return the nftPrice set by the Marketplace contract", async () => {
      const contractPrice: BigNumber = await Marketplace.nftPrice();
      expect(contractPrice).to.equal(price);
    });
  });

  describe("purchase", () => {
    it("should revert if tokenId is owned by a non-null address", async () => {
      const tx = await Marketplace.connect(deployer).purchase(1, {
        value: price,
      });
      await tx.wait();

      await expect(
        Marketplace.connect(addr1).purchase(1, { value: price })
      ).to.be.revertedWith("TOKEN_UNAVAILABLE");
    });

    it("should revert if ether sent is less than nft price", async () => {
      const insufficientPrice = price.sub(BigNumber.from(1));

      await expect(
        Marketplace.connect(deployer).purchase(1, { value: insufficientPrice })
      ).to.be.revertedWith("INSUFFICIENT_ETHER_SENT");
    });

    it("should transfer the nft with specified tokenId to the sender", async () => {
      const tokenId = 1;
      const tx = await Marketplace.connect(deployer).purchase(tokenId, {
        value: price,
      });
      await tx.wait();

      expect(await Marketplace.tokens(tokenId)).to.equal(deployer["address"]);
    });
  });

  describe("available", () => {
    it("should return true if tokenId is mapped to a null address -> address(0)", async () => {
      const tokenId = 1;
      const available: boolean = await Marketplace.available(tokenId);
      expect(available).to.equal(true);
    });

    it("should return false is tokenId is mapped to a non-null address", async () => {
      const tokenId = 1;
      const tx = await Marketplace.connect(deployer).purchase(tokenId, {
        value: price,
      });
      await tx.wait();

      const available: boolean = await Marketplace.available(tokenId);
      expect(available).to.equal(false);
    });
  });
});
