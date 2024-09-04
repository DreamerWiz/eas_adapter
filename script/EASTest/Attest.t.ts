import { resolve } from "path";
import {Attester} from "../EAS/Attest";
import { ResolverMessage } from "../EAS/ResolverMessage";
import { Signer, Wallet, ethers } from "ethers";
import { Signer as _signer} from "../EAS/Signer";

(async function(){
    let resolverMessage = new ResolverMessage(
        {
            employId: 1,
            interviewPassed: true,
            skillCategory: 1,
            skillLevel: 1
        }
    )
    
    await resolverMessage.complete(new ethers.Wallet(process.env.PRIV_KEY as string))  //encode

    console.log(resolverMessage)


    let attesttestMessage = resolverMessage.getAttestMessageFor("0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0")
    
    console.log(attesttestMessage)
    let attester = new Attester()
    let tx = await attester.multiAttest([attesttestMessage], {gasLimit: 600000})
    console.log(tx) //UID
})()

//abiencode
