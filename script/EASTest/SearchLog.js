
const {ethers} = require("ethers");
const { recoverAddress } = require("ethers/lib/utils");
const fs = require('fs');
const yaml = require('js-yaml');

const provider = new ethers.providers.JsonRpcBatchProvider("http://60.204.145.104:8545");

const abi = JSON.parse(fs.readFileSync('artifacts/contracts/resolver/SchemaResolver.sol/SchemaResolver.json')).abi

const config = yaml.load(fs.readFileSync('config.yaml', 'utf-8'))

const resolverAddress = config.dev.SchemaResolverAddress;

(async function(){

    const contract = new ethers.Contract(resolverAddress, abi, provider)

    let res = await contract.eip712Domain();
    const events = await contract.queryFilter('Attest')
    let event = events[events.length - 1]
    console.log(event.args[5])
    console.log(event.args[6])

    console.log(recoverAddress(event.args[5], event.args[6]))

    // console.log(event)
    //0xb81f0096a49a81d47199bda64661018d6bd6f94e9eff8cdaf654f8e9118fe5fa38c77d68cecbd9e43b6fda399e4f6abe7aaa396da1b5884d3fbe6a59739785811c

    //0xb81f0096a49a81d47199bda64661018d6bd6f94e9eff8cdaf654f8e9118fe5fa38c77d68cecbd9e43b6fda399e4f6abe7aaa396da1b5884d3fbe6a59739785811c
})()