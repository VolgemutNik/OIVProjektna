const extensionId = "oiv@addon.com";

/*
    Outlook <div> class names.
 */
const newMsg = "ms-Button _33rLSYbzxvhXjgYTwfjWQI _1yXkaiMFfrJerhRD_mw8tk _1ojerECVeZlAkHtklkKOj5 ms-Button--commandBar root-54";
const buttonRow = "ivs3kF0TSy1MNYEjC_hAw";
const contentDiv = "_4utP_vaqQ3UQZH0GEBVQe B1QSRkzQCtvCtutReyNZ CAUXSSmBTHvYTez0U6p3M _17ghdPL1NLKYjRvmoJgpoK _2s9KmFMlfdGElivl0o-GZb";
const recipientSpan = "ReadWriteCommonWell-wellItemText wellItemText-228";

console.log("Loaded content script");

/*
    Injection logic.
 */

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


window.addEventListener("load", evt => {
    console.log("Added onLoad");
    //TODO: implement checking the settings.enabled boolean
    if (true) {
        console.log("entered enabled block");

        waitForElm("." + newMsg).then(elm => {
            console.log(elm.textContent);
            elm.addEventListener("click", evt => {
                console.log("Triggered onClick event");
                waitForElm("." + buttonRow).then(elm1 => {
                    console.log(elm1.textContent);
                    //FIXME: accurate button html
                    elm1.innerHTML += "TEST";
                })
            });
        });

    }
});

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

browser.runtime.onMessage.addListener(handleMessage);

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
};

/**
 * Send a message object to all onMessage listeners with a specified message type.
 *
 * @param cmd {String} Determines how the message will be handled by the receiver.
 * @param msg {any} The message.
 * @param responseHandler {function} A function that will handle the response.
 */
const sendMessage = (cmd, msg, responseHandler) => {
    let obj = {
        cmd: cmd || "unknown",
        msg: msg || ""
    }

    browser.runtime
        .sendMessage(extensionId, obj)
        .then((response) => {
            if(responseHandler){
                responseHandler(response);
            }else{
                defaultResponseHandler(response);
            }
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
};