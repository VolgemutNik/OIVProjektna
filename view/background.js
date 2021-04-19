import * as openpgp from "../lib/openpgp.min.mjs";

const extensionId = "oiv@addon.com";
// const settings = {
//     enabled: true,
//     publicKeys: [
//         new PublicKey("", "", "", ""),
//         new PublicKey("", "", "", "")
//     ],
//     userKeys: {
//         "public": new PublicKey("", "", "", ""),
//         "private": new PrivateKey("", "", "", "", "")
//     }
// };
let settings = JSON.parse(localStorage.getItem('settings'));

const obj = {
    privateKey:
        `Version: Keybase OpenPGP v1.0.0\nComment: https://keybase.io/crypto
    
    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
    =Qyoa`,
    publicKey:
        `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
    fLCIJDeThg==
    =eEV2`,
    secret: "cool123",
}

/**
 * onChange event handler
 *
 */
const storageChangeHandler = () => {
    settings = JSON.parse(localStorage.getItem('settings'));
};

window.addEventListener('storage', storageChangeHandler);

/**
 * Sends a message object to all available content scripts.
 *
 * @param cmd {String} Message type.
 * @param msg {any} The Message object.
 * @param responseHandler {function} A function that will handle the response.
 */
const sendMessage = async (cmd, msg, responseHandler = defaultResponseHandler) => {
    let obj = {
        cmd: cmd || "unknown",
        msg: msg || ""
    }

    const tabs = browser.tabs
        .query({
            url: [
                "*://*.outlook.office365.com/mail/*",
                "*://*.outlook.office.com/mail/*"
            ]
        });
    tabs.then(tabArr => {
        tabArr.forEach(tab => {
            browser.tabs
                .sendMessage(tab.id, obj)
                .then(response => {
                    if (response)
                        responseHandler(response);
                }).catch(e => {
                console.error(e);
            });
            console.debug(`Sent message to tab ${tab.id}`);
        });
    }).catch(e => {
        console.error(`An error occured while querying for browser tabs! Message: ${e}`);
    });
};

/**
 * Handles the incoming message when a custom responseHandler is not defined.
 *
 * @param message The message.
 */
const defaultResponseHandler = (message) => {
    console.debug(`Response received: ${message}`);
};

/**
 * onMessage event handler
 *
 * @param data {any?} Message content
 * @param sender {object} Sender info
 * @param sendResponse {function} A callback which enables you to send data back to sender.
 */
const handleMessage = (data, sender, sendResponse) => {
    data = data || {};
    console.debug(`Incoming from ${JSON.stringify(sender)} with content: ${JSON.stringify(data)}`);

    switch (data.cmd) {
        case "ping":
            sendResponse("pong");
            break;
        case "encrypt":
            encrypt(data.msg)
                .then(function(encrypted){
                    console.log(`Final background.js response: ${encrypted}`);
                    //return encrypted;
                    sendMessage("encrypted", encrypted).then(result => console.log("Sent data to content script."));
                }).catch(e => {
                console.error(`An error has occurred while trying to encrypt data. See message for more info: ${e}`);
            });
            break;
        default:
            console.debug("Invalid command code");
    }
};

browser.runtime.onMessage.addListener(handleMessage);

/**
 * Encrypts the data using the OpenPGP.js library.
 *
 * @param data {Object} The data.
 * @returns {Promise<void>}
 */
const encrypt = async (data) => {
    const email = data.email;
    const text = data.text;

    return new Promise((resolved, rejected) => {
        if(!email || !text){
            rejected("error: Missing data needed to encrypt.");
        }

        const publicKeys = settings.publicKeys || [];
        const publicKeyObj = obj.publicKey;
        /*let publicKeyObj = {};

        for(let obj of publicKeys){
            if(obj.email === email){
                publicKeyObj = obj;
                break;
            }
        }*/

        if(publicKeyObj){
            //const userKeys = settings.userKeys;
            //if(userKeys.private){
                openpgpEncrypt("", {}, text)
                    .then(obj => {
                        console.log(obj);
                        resolved(obj);
                    }).catch(e => {
                        console.error(e);
                        rejected(e);
                });
            //}else{
            //    rejected("error: Missing your private key.");
            //}
        }else{
            rejected("error: Missing public key of recipient.");
        }
    });
};

/**
 *
 * @param publicKeyObj {Object} An object that holds public key data.
 * @param userKeys {}
 * @param text {String} The text we are trying to encrypt.
 * @returns {Promise<String>} The Promise.
 */
const openpgpEncrypt = async(publicKeyObj, userKeys, text) => {
    const publicKeyStr = `-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n${obj.publicKey}\n-----END PGP PUBLIC KEY BLOCK-----`;
    const privateKeyStr = `-----BEGIN PGP PRIVATE KEY BLOCK-----\n${obj.privateKey}\n-----END PGP PRIVATE KEY BLOCK-----`;
    const secret = obj.secret;
    try{
        const publicKey = await openpgp.readKey({ armoredKey: publicKeyStr });
        const privateKey = await openpgp.readKey({ armoredKey: privateKeyStr });
        await privateKey.decrypt(secret);

        const encryptedMessage = await openpgp.encrypt({
            message: await openpgp.Message.fromText(text),
            publicKeys: publicKey,
            privateKeys: privateKey
        });

        console.debug(`Encrypted string: \n${encryptedMessage}`);

        return encryptedMessage;
    }catch (e){
        console.debug(e);
        throw new Error("error: " + e.message);
    }
};
