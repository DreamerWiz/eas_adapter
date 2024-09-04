const {SchemaRegistry, SchemaEncoder, EAS} = require("@ethereum-attestation-service/eas-sdk");
const {ethers} = require("ethers");
const yaml = require('js-yaml');
const fs = require('fs')



let config = yaml.load(fs.readFileSync('config.yaml', 'utf-8'))
console.log(config)

const END_POINT = config.dev.END_POINT;
const PRV_KEY = process.env.PRIV_KEY;

// const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26
// const EASContractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // anvil
const schemaRegistryContractAddress = config.dev.SchemaRegistryAddress;
const resolverAddress = config.dev.SchemaResolverAddress;

const provider = new ethers.providers.JsonRpcProvider(END_POINT)
const signer = new ethers.Wallet(PRV_KEY, provider)

const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
schemaRegistry.connect(signer);

const schema = "uint64 employId, bool interviewPassed, uint8 skillCategory, uint8 skillLevel, bytes _ext";
const revocable = true;

(async function(){
  let transaction = await schemaRegistry.register({
    schema,
    resolverAddress,
    revocable,
  });
  
  // // Optional: Wait for transaction to be validated
  let res = await transaction.wait();
  console.log(res);

  if(!config) config = {dev: {}}

  config.dev.SchemaUID = res
  fs.writeFileSync('config.yaml', yaml.dump(config))
})()

