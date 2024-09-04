
import { ethers } from 'ethers'

// Our domain will include details about our app
const domain = {
    name: 'Resolver',
    version: '1.0.0',
    chainId: 1337,
    verifyingContract: "0x1da765cA08302E371EF2BD8E3cb27e12A47069F2"
};

// Here we define the different types our message uses
const types = {
    Attest: [
        {name:"employId", type: "uint64"},
        {name:"deadline", type: "uint"},
        {name:"interviewPassed", type: "bool"},
        {name:"skillCategory", type: "uint8"},
        {name:"skillLevel", type: "uint8"},
        {name:"test", type: "A"}
    ],
    A: [{name:"test", type:string}]
};


const message = {
    employId: 1,
    deadline: 1690390112,
    interviewPassed: true,
    skillCategory: 1,
    skillLevel: 1
};


const END_POINT = "http://localhost:8545";
const PRV_KEY = "0xa6887db5ecf37d7c9faac7592fc865df2eb1004ace79588cda8de171d27ad417";

const provider = new ethers.providers.JsonRpcProvider(END_POINT)
const signer = new ethers.Wallet(PRV_KEY, provider)

const signature = await signer._signTypedData(
    domain, types, message,
)

console.log(signature)