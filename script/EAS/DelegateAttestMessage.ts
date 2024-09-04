import { Signer } from "./Signer";
import { IAttestMessage, IAttestMessageDataParam } from "./AttestMessage";
import { SIGN_CONFIG_TYPE } from "./Config";
import { config } from "./Config";
import { ethers } from "ethers";
import { EAS } from "@ethereum-attestation-service/eas-sdk";
import { sign } from "crypto";

const ZERO_BYTES32 = "0x0000000000000000000000000000000000000000000000000000000000000000"
const current_config = Reflect.get(config, config.Default)

export interface IDelegateAttestMessage extends IAttestMessage{
    signature?: string;
    attester: string;
}

export interface IDelegateAttestMessageParam {
    attester: string;
    data: IAttestMessageDataParam;
}

export class DelegateAttestMessage implements IDelegateAttestMessage{
    signature: string;
    attester: string;

    data: IAttestMessageDataParam;
    schema: string;
    
    private _eas: any;

    constructor({attester, data: {recipient, data, expirationTime=0, revocable=true, refUID=ZERO_BYTES32, value=0}}: IDelegateAttestMessage){
        this.data = {recipient, data, expirationTime, revocable, refUID, value};
        this.schema = current_config.SchemaUID
        this.attester = attester
        this.signature = ""
        
    
        let EASContractAddress = current_config.EASContractAddress; // anvil
        // Initialize the sdk with the address of the EAS Schema contract address
        this._eas = new EAS(EASContractAddress);
        this._eas.connect(new ethers.providers.JsonRpcProvider(current_config.END_POINT))
    }



    async complete(signer: any){
        let nonce = await this._eas.getNonce(signer.address);

        let signObject = {
            schema: this.schema,
            recipient: this.data.recipient,
            expirationTime: this.data.expirationTime,
            revocable: this.data.revocable,
            refUID: this.data.refUID,
            data: this.data.data,
            nonce: nonce.toNumber()
        };
        console.log(signObject)
        
        this.signature = await new Signer({SIGN_TYPE: SIGN_CONFIG_TYPE.ATTEST_SIGN_CONFIG, signer: signer}).signMessage(signObject)
    }
}