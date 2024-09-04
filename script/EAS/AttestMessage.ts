import { config } from "./Config";

const ZERO_BYTES32 = "0x0000000000000000000000000000000000000000000000000000000000000000"

export interface IAttestMessageDataParam{
    recipient: string;
    data: string;
    expirationTime?: number;
    revocable?: boolean;
    refUID?: string;
    value?: number;
}

export interface IAttestMessage{
    schema: string;
    data: IAttestMessageDataParam;
}

export class AttestMessage implements IAttestMessage{
    schema: string;
    data: IAttestMessageDataParam;

    constructor({recipient, data, expirationTime=0, revocable=true, refUID=ZERO_BYTES32, value=0}: IAttestMessageDataParam){
        this.schema = Reflect.get(config, config.Default).SchemaUID;
        this.data = {recipient, data, expirationTime, revocable, refUID, value};
    }
}

