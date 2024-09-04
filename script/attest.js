import { SchemaRegistry, SchemaEncoder, EAS } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';

const END_POINT = "http://localhost:8545";
const PRV_KEY = "0xa6887db5ecf37d7c9faac7592fc865df2eb1004ace79588cda8de171d27ad417";

// const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26
const EASContractAddress = "0xeb530697f88288b4d401C698cEc414629c356353"; // anvil

const provider = new ethers.providers.JsonRpcProvider(END_POINT)
const signer = new ethers.Wallet(PRV_KEY, provider)
// Initialize the sdk with the address of the EAS Schema contract address
const eas = new EAS(EASContractAddress);
eas.connect(signer);


// // Initialize SchemaEncoder with the schema string
const schemaEncoder = new SchemaEncoder("uint64 employId, uint256 deadline, bool interviewPassed, uint8 skillCategory, uint8 skillLevel, bytes signature");
const encodedData = schemaEncoder.encodeData([
  { name: "employId", value: 1, type: "uint64" },
  { name: "deadline", value: 1690564079, type: "uint256" },
  { name: "interviewPassed", value: true, type: "bool" },
  { name: "skillCategory", value: 1, type: "uint8" },
  { name: "skillLevel", value: 1, type: "uint8" },
  { name: "signature", value: "0x87607c1d74afef5e948ad3ad84ce46f9d0ed89739b9673ee7d8ed6b98c0c3c283e8e30e6be81688e6e2c54cbe8d7733f805bdae774d96dc4a823d652456d1f6c1b", type: "bytes" }
]);

const schemaUID = "0x8b1eda27cecd4cd0a3820b5e7b02f12cda05e525a0c848a5e2d8ae4f42b7db7f";

let tx = await eas.multiAttest([{
  schema: schemaUID,
  data: [{
    recipient: "0x7c96430711a800870bA7f7cc2B6caeC2e253A4Ed",
    expirationTime: 0,
    revocable: true,
    data: encodedData,
  }],
}], {gasLimit:600000});

// let tx = await eas.attest({
//   schema: schemaUID,
//   data: {
//     recipient: "0x7c96430711a800870bA7f7cc2B6caeC2e253A4Ed",
//     expirationTime: 0,
//     revocable: true,
//     data: encodedData,
//   },
// }, {gasLimit:600000});

const newAttestationUID = await tx.wait();

console.log("New attestation UID:", newAttestationUID);