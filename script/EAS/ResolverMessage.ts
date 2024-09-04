"use strict";
import { SchemaItem, SchemaEncoder} from "@ethereum-attestation-service/eas-sdk";
import { SIGN_CONFIG_TYPE, config } from "./Config";
import { Signer } from "./Signer";
import { time } from "console";
import { AbiCoder } from "ethers/lib/utils";
import { AttestMessage } from "./AttestMessage";
const schema_types : Array<{[key :string ] : any}> = Reflect.get(config, config.Default).SCHEMA_TYPES;
const schemaUID = Reflect.get(config, config.Default).SchemaUID;
const schema = schema_types.map( x => x.type + " " + x.name).join(",")
const schemaEncoder = new SchemaEncoder(schema);

export interface IResolverMessage{
    employId: number;
    interviewPassed: boolean;
    skillCategory: number;
    skillLevel: number;
    _ext: string;

    _deadline: number;
    _signature: string;

    toRawMessage: () => IResolverMessageParam[]; 
    toEncodedMessage: () => string;
    
}

export interface IResolverMessageConstructorParam{
    employId: number;
    interviewPassed: boolean;
    skillCategory: number;
    skillLevel: number;
}

export interface IResolverMessageParam{
    name: string;
    value: string|number|boolean;
    type: string;
}

export class ResolverMessage implements IResolverMessage{

    employId: number;
    interviewPassed: boolean;
    skillCategory: number;
    skillLevel: number;
    _ext: string;

    _deadline: number;
    _signature: string;


    constructor({employId, interviewPassed, skillCategory, skillLevel} : IResolverMessageConstructorParam){
        
        this.employId = employId;
        this.interviewPassed = interviewPassed;
        this.skillCategory = skillCategory;
        this.skillLevel = skillLevel;

        this._deadline = -1;
        this._signature = "";
        this._ext = "";
    }

    static fromObject(option: any) : ResolverMessage{
        return new ResolverMessage(option);
    }

    async complete(_signer:any){
        this._deadline = Date.parse(new Date().toString()) / 1000 + 86400;  //默认一天后
        let signer = new Signer({SIGN_TYPE: SIGN_CONFIG_TYPE.RESOLVER_SIGN_CONFIG, signer: _signer})
        this._signature = await signer.signMessage({
            employId: this.employId,
            interviewPassed: this.interviewPassed,
            skillCategory: this.skillCategory,
            skillLevel: this.skillLevel,
            deadline: this._deadline
        });

        let abiCoder = new AbiCoder();
        this._ext = abiCoder.encode(["uint", "bytes"], [this._deadline, this._signature]);
    }

    toRawMessage(){
        let res: IResolverMessageParam[] = []
        for(let param of schema_types){
            if(!Reflect.has(this, param.name)){
                throw new Error(param.name + " not exist");
            }
            param.value = Reflect.get(this, param.name);
            
            res.push(param as IResolverMessageParam)
        }
        return res;
    }

    toEncodedMessage(){
        let encodedData = schemaEncoder.encodeData(this.toRawMessage() as SchemaItem[]);
        return encodedData;
    }

    getAttestMessageFor(recipient: string){
        let res = {
            recipient: recipient,
            data: this.toEncodedMessage()
        }
        return new AttestMessage(res);
    }
}

exports.ResolverMessage = ResolverMessage;