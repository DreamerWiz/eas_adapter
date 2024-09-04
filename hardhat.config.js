// 1. Import the Ethers plugin required to interact with the contract
require('@nomiclabs/hardhat-ethers');

// 2. Import your private key from your pre-funded Moonbase Alpha testing account
const privateKey = "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d";

module.exports = {
  // 3. Specify the Solidity version
  solidity: "0.8.18",

  networks: {
    // 4. Add the Moonbase Alpha network specification
    dev: {
      url: 'http://60.204.145.104:8545',
      chainId: 1337, // 0x507 in hex,
      accounts: [privateKey]
    }
  }
};