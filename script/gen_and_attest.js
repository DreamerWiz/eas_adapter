
import { ethers } from 'ethers'
import { SchemaEncoder, EAS } from "@ethereum-attestation-service/eas-sdk";



const resolverAddress = "0x1da765cA08302E371EF2BD8E3cb27e12A47069F2"
const chainId = 1337
const END_POINT = "http://localhost:8545";
const PRV_KEY = "0xa6887db5ecf37d7c9faac7592fc865df2eb1004ace79588cda8de171d27ad417";
const provider = new ethers.providers.JsonRpcProvider(END_POINT)
const signer = new ethers.Wallet(PRV_KEY, provider)

const EASContractAddress = "0xeb530697f88288b4d401C698cEc414629c356353";
// Initialize the sdk with the address of the EAS Schema contract address
const eas = new EAS(EASContractAddress);
eas.connect(signer);

const schemaUID = "0x8b1eda27cecd4cd0a3820b5e7b02f12cda05e525a0c848a5e2d8ae4f42b7db7f";

const schemaEncoder = new SchemaEncoder("uint64 employId, uint256 deadline, bool interviewPassed, uint8 skillCategory, uint8 skillLevel, bytes signature");


// Our domain will include details about our app
const domain = {
    name: 'Resolver',
    version: '1.0.0',
    chainId: chainId,
    verifyingContract: resolverAddress
};

// Here we define the different types our message uses
const types = {
    Attest: [
        {name:"employId", type: "uint64"},
        {name:"deadline", type: "uint"},
        {name:"interviewPassed", type: "bool"},
        {name:"skillCategory", type: "uint8"},
        {name:"skillLevel", type: "uint8"}
    ]
};

async function _getParams(message){
    let signature = await signer._signTypedData(domain, types, message)
    let encodedData = schemaEncoder.encodeData([
        { name: "employId", value: message.employId, type: "uint64" },
        { name: "deadline", value: message.deadline, type: "uint256" },
        { name: "interviewPassed", value: message.interviewPassed, type: "bool" },
        { name: "skillCategory", value: message.skillCategory, type: "uint8" },
        { name: "skillLevel", value: message.skillLevel, type: "uint8" },
        { name: "signature", value: signature, type: "bytes" }
      ]);
    return encodedData;
}

async function makeAttestations(){
    let res = []
    for(let i = 0; i < 50;i++){
        let message = {
            employId: i+1,
            deadline: 1690564079,
            interviewPassed: true,
            skillCategory: 1,
            skillLevel: 1
        }
        let tmp = await _getParams(message)

        res.push({
            recipient: "0x7c96430711a800870bA7f7cc2B6caeC2e253A4Ed",
            expirationTime: 0,
            revocable: true,
            data: tmp,
          })
    }
    return res

}

let data = await makeAttestations()

console.log(data)

let tx = await eas.multiAttest([{
  schema: schemaUID,
  data: data,
}], {gasLimit:60000000});

let newAttestationUID = await tx.wait()

console.log("New attestation UID:", newAttestationUID);