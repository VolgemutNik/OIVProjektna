// import {PrivateKey, PublicKey} from "./containers/key";
// import * as openpgp from "../lib/openpgp.min.mjs";

/*
    outlook divs
 */
const newMsg = "ms-Button _33rLSYbzxvhXjgYTwfjWQI _1yXkaiMFfrJerhRD_mw8tk _1ojerECVeZlAkHtklkKOj5 ms-Button--commandBar root-54";
const buttonRow = "ivs3kF0TSy1MNYEjC_hAw";
const contentDiv = "_4utP_vaqQ3UQZH0GEBVQe B1QSRkzQCtvCtutReyNZ CAUXSSmBTHvYTez0U6p3M _17ghdPL1NLKYjRvmoJgpoK _2s9KmFMlfdGElivl0o-GZb";
const recipientSpan = "ReadWriteCommonWell-wellItemText wellItemText-228";

/*
    config
    TODO: replaced by actual implementation(Menu)
 */
const enabled = true;
// let key = [
//     new PrivateKey("","","","",""),
//     new PublicKey("","","","")
// ];
//
// let publicKeys = [
//     new PublicKey("","","","")
// ];

// const newMsgButtonPromise = new Promise(resolve => {
//    let newMsgButton = document.getElementsByClassName(newMsg).item(0);
//    let count = 0;
//    while(!newMsgButton){
//        count++;
//        try{
//            setTimeout(() =>
//        }catch (e) {
//             console.log(e.message);
//        }
//
//        if(count > 1000) break;
//    }
//    resolve(newMsgButton);
// });
//
// newMsgButtonPromise.then((msgButton) => {
//     if(msgButton){
//         msgButton.addEventListener("click", evt => {
//             console.log("To je dejansko ratalo, woohoo");
//             //TODO naprej promises
//         });
//     }
// });

window.addEventListener("load", evt => {
    console.log("Added onLoad");
    if (enabled) {
        console.log("entered enabled block");
        const newMsgButton = document.getElementsByClassName(newMsg).item(0);
        console.log(newMsgButton);
        if (newMsgButton) {
            newMsgButton.addEventListener("click", evt => {
                console.log("Triggered onClick event");
                try{
                    const buttonRowElement = document.getElementsByClassName(buttonRow).item(0);
                    buttonRowElement.addEventListener("load", evt1 => {
                        console.log("foo");
                        buttonRowElement.innerHTML += "TEST";
                    });
                }catch (e){
                    console.error(e.message);
                }
            });
            console.log("Added listener.")
        }
    }
});

const getRecipientEmail = () => {
    //Simon Sambolec <simon.sambolec@student.um.si>
    const recipientSpanElement = document.getElementsByClassName(recipientSpan).item(0);
    if (recipientSpanElement) {
        const text = recipientSpanElement.innerHTML;
        const split = text.split(" ");
        const foo = split[split.length - 1];

        return foo.substring(1, foo.length - 1);
    }
}

const encrypt = async () => {
    //TODO: encryption logic
}