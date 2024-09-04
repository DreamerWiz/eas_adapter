
require("@nomiclabs/hardhat-ethers");
const yaml = require("js-yaml");
const fs = require('fs');

// scripts/deploy.js
async function main() {
    // 1. Get the contract to deploy
    const SchemaRegistry = await ethers.getContractFactory('SchemaRegistry');
    console.log('Deploying SchemaRegistry...');

    // 2. Instantiating a new Box smart contract
    const schemaRegistry = await SchemaRegistry.deploy();

    // 3. Waiting for the deployment to resolve
    await schemaRegistry.deployed();

    // 4. Use the contract instance to get the contract address
    console.log('SchemaRegistry deployed to:', schemaRegistry.address);

    const EAS = await ethers.getContractFactory('EAS');
    console.log("Deploying EAS....");

    const eas = await EAS.deploy(schemaRegistry.address);
    await eas.deployed();

    console.log('EAS deployed to:', eas.address);


    // 1. Get the contract to deploy
    const SchemaResolver = await ethers.getContractFactory('SchemaResolver');
    console.log('Deploying SchemaResolver...');

    // 2. Instantiating a new Box smart contract
    const schemaResolver = await SchemaResolver.deploy();

    // 3. Waiting for the deployment to resolve
    await schemaResolver.deployed();

    // 4. Use the contract instance to get the contract address
    console.log('SchemaResolver deployed to:', schemaResolver.address);

    let config = yaml.load(fs.readFileSync('config.yaml', 'utf-8'))
    console.log(config)
    if(!config) config = {dev: {}}

    config.dev.EASContractAddress = eas.address
    config.dev.SchemaRegistryAddress = schemaRegistry.address
    config.dev.SchemaResolverAddress = schemaResolver.address
    fs.writeFileSync('config.yaml', yaml.dump(config))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });