import * as openpgp from "../lib/openpgp.min.js";

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
                console.error(e.message);
            });
            console.debug(`Sent message to tab ${tab.id}`);
        });
    }).catch(e => {
        console.error(`An error occured while querying for browser tabs! Message: ${e.message}`);
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
    console.debug(`Incoming from ${sender} with content: ${data}`);

    switch (data.cmd) {
        case "ping":
            sendResponse("pong");
            break;
        case "encrypt":
            encrypt(data.msg)
                .then(encrypted => {
                    sendResponse(encrypted);
                }).catch(e => {
                console.error(`An error has occurred while trying to encrypt data. See message for more info: ${e.message}`);
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
        let publicKeyObj = {};

        for(let obj of publicKeys){
            if(obj.email === email){
                publicKeyObj = obj;
                break;
            }
        }

        if(publicKeyObj){
            const userKeys = settings.userKeys;
            if(userKeys.private){
                openpgpEncrypt(publicKeyObj, userKeys, text)
                    .then(obj => {
                        resolved(obj);
                    }).catch(e => {
                        rejected(e);
                });
            }else{
                rejected("error: Missing your private key.");
            }
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
    const publicKeyStr = `-----BEGIN PGP PUBLIC KEY BLOCK-----\n${publicKeyObj.key}\n-----END PGP PUBLIC KEY BLOCK-----`;
    const privateKeyStr = `-----BEGIN PGP PRIVATE KEY BLOCK-----\n${userKeys.private.key}\n-----END PGP PRIVATE KEY BLOCK-----`;
    const secret = userKeys.private.secret;

    const publicKey = await openpgp.readKey({ armoredKey: publicKeyStr });

    const privateKey = await openpgp.readKey({ armoredKey: privateKeyStr });
    await privateKey.decrypt(secret);

    const encryptedMessage = await openpgp.encrypt({
        message: await openpgp.createMessage({text: text}),
        publicKeys: publicKey,
        privateKeys: privateKey
    });

    console.debug(`Encrypted string: \n${encryptedMessage}`);

    return encryptedMessage;
};
