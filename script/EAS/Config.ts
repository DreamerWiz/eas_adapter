const yaml = require('js-yaml');
const fs = require('fs')
let config_from_file = yaml.load(fs.readFileSync('config.yaml', 'utf-8'));

const schema_types = [
    {type: "uint64", name: "employId"},
    {type: "bool", name: "interviewPassed"},
    {type: "uint8", name: "skillCategory"},
    {type: "uint8", name: "skillLevel"},
    {type: "bytes", name: "_ext"}
]
const schema = schema_types.map( x => x.type + " " + x.name).join(",")

export const config = {
    Default: "dev",
    dev: {
        END_POINT: "http://60.204.145.104:8545",
        PRIV_KEY: process.env.PRIV_KEY, 
        EASContractAddress: config_from_file.dev.EASContractAddress || "",
        RegistryContractAddress: config_from_file.dev.SchemaRegistryAddress || "",
        SchemaResolverAddress: config_from_file.dev.SchemaResolverAddress || "",
        SchemaUID: config_from_file.dev.SchemaUID || "",
        SCHEMA_TYPES: schema_types,
        SCHEMA: schema,
        RESOLVER_SIGN_CONFIG: {
            domain: {
                name: 'Resolver',
                version: '1.0.0',
                chainId: 1337,
                verifyingContract: config_from_file.dev.SchemaResolverAddress || ""
            },
            types : {
                Attest: [
                    {name:"employId", type: "uint64"},
                    {name:"deadline", type:"uint"},
                    {name:"interviewPassed", type: "bool"},
                    {name:"skillCategory", type: "uint8"},
                    {name:"skillLevel", type: "uint8"}
                ]
            },
            root_type: "Attest"
        },

        ATTEST_SIGN_CONFIG: {
            domain: {
                name: 'EAS',
                version: '0.26',
                chainId: 1337,
                verifyingContract: config_from_file.dev.EASContractAddress || ""
            },
            types: {
                Attest: [
                    {name: "schema", type: "bytes32"},
                    {name: "recipient", type: "address"},
                    {name: "expirationTime", type: "uint64"},
                    {name: "revocable", type: "bool"},
                    {name: "refUID", type:"bytes32"},
                    {name: "data", type:"bytes"},
                    {name: "nonce", type:"uint256"}
                ]
            },
            root_type: "Attest"
        },

        REVOKE_SIGN_CONFIG: {
            domain: {
                name: 'EAS',
                version: '0.26',
                chainId: 1337,
                verifyingContrat: config_from_file.dev.EASContractAddress || ""
            },
            types: {
                Revoke: [
                    {name: "schema", type: "bytes32"},
                    {name: "uid", type: "bytes32"},
                    {name: "nonce", type: "uint256"}
                ]
            },
            root_type: "Revoke"
        }
    }
}

export enum CONFIG_TYPE{
    dev
}

export enum SIGN_CONFIG_TYPE{
    RESOLVER_SIGN_CONFIG,
    ATTEST_SIGN_CONFIG,
    REVOKE_SIGN_CONFIG
}