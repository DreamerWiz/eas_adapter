"use strict";

import { EAS } from "@ethereum-attestation-service/eas-sdk";
import {CONFIG_TYPE, config as Config} from "./Config"; 
import { ethers } from "ethers";
import { AttestMessage } from "./AttestMessage";

export interface AttestParam{
    attestation: AttestMessage;
    txOpt: {
        gasLimit: number;
    }
}

export class Attester{
    config : any;
    eas : EAS;
    private _provider:any;
    private _signer:any;
    private _schemaUID:string;
    

    constructor(config: CONFIG_TYPE=CONFIG_TYPE.dev){
        this.config = Reflect.get(Config, CONFIG_TYPE[config]);
        this._provider = new ethers.providers.JsonRpcProvider(this.config.END_POINT)
        this._signer = new ethers.Wallet(this.config.PRIV_KEY, this._provider)
        // Initialize the sdk with the address of the EAS Schema contract address
        this.eas = new EAS(this.config.EASContractAddress);
        this.eas.connect(this._signer);
        this._schemaUID = this.config.SchemaUID;
    }

    async attest({attestation, txOpt: { gasLimit}}: AttestParam){
        let tx = await this.eas.attest(attestation, {gasLimit: gasLimit});
        console.log(tx);
        let newAttestationUID = await tx.wait();
        return newAttestationUID;
    }

    async multiAttest(attestations: AttestMessage[], txOpt: any= {}){
        let params : any = [];
        for(let attestation of attestations){
            let data: any[] = [
                {
                    recipient: attestation.data.recipient,
                    expirationTime: attestation.data.expirationTime || 0,
                    revocable: attestation.data.revocable || 0,
                    data: attestation.data.data,
                  }
            ]
            params.push({
                schema: this._schemaUID,
                data: data
            })
        }

        let tx = await this.eas.multiAttest(params, txOpt);

        let newAttestationUID = tx.wait();
        return newAttestationUID;
    }
}

exports.Attester = Attester;