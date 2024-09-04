import { ethers, providers } from "ethers";
import { CONFIG_TYPE, config as Config, SIGN_CONFIG_TYPE } from "./Config";
import { verifyTypedData } from "ethers/lib/utils";

interface cfgOption{
    // ENV_CONFIG? : CONFIG_TYPE;
    SIGN_TYPE? : SIGN_CONFIG_TYPE;
    signer?: any;
}

export class Signer{
    domain : any;
    types: any;
    root_type: string;

    private signer: any;
    private priv_key: string;

    constructor({SIGN_TYPE=SIGN_CONFIG_TYPE.RESOLVER_SIGN_CONFIG, signer=undefined}: cfgOption){
        let config = Config.Default;
        let signConfig = SIGN_CONFIG_TYPE[SIGN_TYPE];

        let tmp_config = Reflect.get(Config, config);
        let sign_config = Reflect.get(tmp_config, signConfig);
        this.domain = sign_config.domain;
        this.types = sign_config.types;
        this.root_type = sign_config.root_type;
        console.log(signer)
        if(!signer){
            this.priv_key = tmp_config.PRIV_KEY;
            console.log(this)
            this.signer = new ethers.Wallet(this.priv_key);
        }else{
            this.signer = signer;
            this.priv_key = "";
        }
    }

    checkObjValid(obj:any, type: string){
        console.log(obj)
        let keys = new Set(Reflect.ownKeys(obj));
        if(!Reflect.has(this.types, type)){
            throw new Error("Target type " + type + " not in declared types.");
        }
        let typeList:any[] = this.types[type];
        let typeSet = new Set(typeList.map(x => x.name));
        for(let _type of typeSet){
            if(!keys.has(_type)){
                throw new Error("Missing attribute " + _type.toString() + "\n" + JSON.stringify(obj))
            }
        }
        for(let _key of keys){
            if(!typeSet.has(_key)){
                throw new Error("Extra attribute " + _key.toString() + "\n" + JSON.stringify(obj))
            }
        }
        
        for(let _type of typeList){
            let objAttributeType = typeof Reflect.get(obj, _type.name);
            if(_type.type.startsWith("uint") || _type.type.startsWith("int")){
                if(objAttributeType != "number"){
                    throw new Error("Attribute " + _type.name + " should be number type.\n" + JSON.stringify(obj));
                }
            }else if(_type.type == "bool"){
                if(objAttributeType != "boolean"){
                    throw new Error("Attribute " + _type.name + " should be boolean type.\n" + JSON.stringify(obj))
                }
            }else if(_type.type.startsWith("bytes") || _type.type == "string" || _type.type == "address"){
                if( objAttributeType  != "string"){
                    throw new Error("Attribute " + _type.name + " should be string type.\n" + JSON.stringify(obj))
                }
            }else{
                this.checkObjValid(Reflect.get(obj, _type.name), _type.type);
            }
        }
    }   

    checkMessageValid(message:any){
        this.checkObjValid(message, this.root_type);
    }

    async signMessage(message:any){
        this.checkMessageValid(message);
        
        let signature = await this.signer._signTypedData(
            this.domain, this.types, message,
        )
        
        return signature;
    }

    async recover(message:any, signature:string){
        return verifyTypedData(this.domain, this.types, message, signature);
    }
}

exports.Signer = Signer;