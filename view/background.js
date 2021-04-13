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
let settings = browser.storage.local.get("settings") || {};

/**
 * onChange event handler
 *
 * @param changes {object} What was changed.
 * @param areaName {String} Where this change occured.
 */
const storageChangeHandler = (changes, areaName) => {
    if (areaName === "local")
        settings = browser.storage.local.get("settings");
};

browser.storage.onChanged.addListener(storageChangeHandler);

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
 *  FIXME: actual implementation
 * @param data {Object} The data.
 * @returns {Promise<void>}
 */
const encrypt = async (data) => {
    const email = data.email;
    const text = data.text;

    if(!email || !text){
        throw new Error("Error, there was no data to encrypt.");
    }


};
