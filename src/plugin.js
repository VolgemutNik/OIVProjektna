const extensionId = "oiv@addon.com";

let settings = storage.local.get("settings");
console.log("Loaded content script");

/**
 * onChange event handler
 *
 * @param changes {object} What was changed.
 * @param areaName {String} Where this change occurred.
 */
const storageChangeHandler = (changes, areaName) => {
    if (areaName === "local")
        settings = storage.local.get("settings");
}

browser.storage.onChanged.addListener(storageChangeHandler);

/*
    Outlook <div> class names.
 */
const newMsg = "ms-Button _33rLSYbzxvhXjgYTwfjWQI _1yXkaiMFfrJerhRD_mw8tk _1ojerECVeZlAkHtklkKOj5 ms-Button--commandBar root-54";
const buttonRow = "ivs3kF0TSy1MNYEjC_hAw";
const contentDiv = "_4utP_vaqQ3UQZH0GEBVQe B1QSRkzQCtvCtutReyNZ CAUXSSmBTHvYTez0U6p3M _17ghdPL1NLKYjRvmoJgpoK _2s9KmFMlfdGElivl0o-GZb";
const recipientSpan = "ReadWriteCommonWell-wellItemText wellItemText-228";

/*
    Injection logic.
 */
const button = "<button class=\"CHANGEME\" onclick='clickHandler(e)'>Encrypt</button>";

/**
 * Creates a promise that waits for an element to load into the DOM.
 *
 * @param selector The selector of the element we are waiting for.
 * @returns {Promise<unknown>} The promise.
 */
const waitForElm = (selector) => {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


//TODO: implement checking the settings.enabled boolean
if (true) {
    waitForElm("." + newMsg).then(elm => {
        console.log(elm.textContent);
        elm.addEventListener("click", evt => {
            console.log("Triggered onClick event");
            waitForElm("." + buttonRow).then(elm1 => {
                console.log(elm1.textContent);
                if (!buttonRow.innerHtml.contains(button))
                    buttonRow.innerHtml += button;
            })
        });
    });

}

/*
    Main extension logic.
 */
/**
 * Extracts senders email address from the appropriate div element.
 *
 * @returns {string} The extracted email.
 */
const getRecipientEmail = () => {
    //Ime Priimek <ime.priimek@student.um.si>
    const recipientSpanElement = document.getElementsByClassName(recipientSpan).item(0);
    if (recipientSpanElement) {
        const text = recipientSpanElement.innerHTML;
        const split = text.split(" ");
        const foo = split[split.length - 1];

        return foo.substring(1, foo.length - 1);
    }

    return "";
}

/**
 * onMessage event handler
 *
 * @param data {any?} Message content
 * @param sender {object} Sender info
 * @param sendResponse {function} A callback which enables you to send data back.
 */
const handleMessage = (data, sender, sendResponse) => {
    data = data || {};
    console.debug(`Incoming from ${sender} with content: ${data}`);

    switch (data.cmd) {
        case "ping":
            sendResponse("pong");
            break;
        default:
            console.debug("Invalid command code");
    }
}

browser.runtime.onMessage.addListener(handleMessage);

/**
 * Send a message object to all onMessage listeners with a specified message type.
 *
 * @param cmd {String} Determines how the message will be handled by the receiver.
 * @param msg {any} The message.
 * @param responseHandler {function} A function that will handle the response.
 */
const sendMessage = (cmd, msg, responseHandler = defaultResponseHandler) => {
    let obj = {
        cmd: cmd || "unknown",
        msg: msg || ""
    }

    browser.runtime
        .sendMessage(extensionId, obj)
        .then((response) => {
            if (response)
                responseHandler(response);
        }).catch((e) => {
        console.error(e);
    });
}

/**
 * Handles the incoming message when a custom responseHandler is not defined.
 *
 * @param message The message.
 */
const defaultResponseHandler = (message) => {
    console.debug(`Response received: ${message}`);
}

/**
 * Handles the onClick event on the injected button
 *  TODO: sending data to background script for encryption
 * @param e {Event}
 */
const clickHandler = (e) => {

}