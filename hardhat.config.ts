import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.0",
      },
      {
        version: "0.8.1",
      },
    ],
  },
  defaultNetwork: "ganache",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts:
        process.env.DEPLOYER !== undefined &&
        process.env.ADDR1 !== undefined &&
        process.env.ADDR2 !== undefined
          ? [
              `0x${process.env.DEPLOYER}`,
              `0x${process.env.ADDR1}`,
              `0x${process.env.ADDR2}`,
            ]
          : [],
    },
    rinkeby: {
      url:
        process.env.RINKEBY_NODE !== undefined ? process.env.RINKEBY_NODE : "",
      accounts:
        process.env.DEPLOYER !== undefined ? [process.env.DEPLOYER] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 90000,
  },
};

export default config;
