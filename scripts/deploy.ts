import { ethers } from "hardhat";

const main = async () => {
  const [deployer] = await ethers.getSigners();

  // Whitelist Contract
  const MAX_WHITELISTED_ADDRESSES = 5;
  const whitelist = await ethers.getContractFactory("Whitelist");
  const Whitelist = await whitelist.deploy(MAX_WHITELISTED_ADDRESSES);
  await Whitelist.deployed();
  console.log("Whitelist Contract address", Whitelist.address);
  await Whitelist.connect(deployer).addAddressToWhitelist();

  // NFT Contract
  const MAX_NFT_SUPPLY = 10;
  const PRESALE_MINT_DURATION = 60; // seconds
  const cheesecakeNft = await ethers.getContractFactory("CheesecakeNFT");
  const CheesecakseNFT = await cheesecakeNft.deploy(
    "https://cheesecakenft.io/base-img",
    Whitelist.address,
    MAX_NFT_SUPPLY
  );
  await CheesecakseNFT.deployed();
  console.log("Cheesecake NFT address", CheesecakseNFT.address);
  const startPresaleTx = await CheesecakseNFT.connect(deployer).startPresale(
    PRESALE_MINT_DURATION
  );
  await startPresaleTx.wait();
  await CheesecakseNFT.connect(deployer).presaleMint({
    value: ethers.utils.parseEther("0.01"),
  });

  // Marketplace (fake) Contract
  const fakeNftMarketplace = await ethers.getContractFactory("Marketplace");
  const FakeNftMarketplace = await fakeNftMarketplace.deploy();
  await FakeNftMarketplace.deployed();
  console.log("FakeNftMarketplace address: ", FakeNftMarketplace.address);

  // DAO Contract
  const dao = await ethers.getContractFactory("DAO");
  const DAO = await dao.deploy(
    CheesecakseNFT.address,
    FakeNftMarketplace.address,
    { value: ethers.utils.parseEther("0.05") }
  );
  await DAO.deployed();
  console.log("DAO address", DAO.address);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
