const extensionId = "oiv@addon.com";


let settings = JSON.parse(localStorage.getItem('settings'));
//let settings = browser.storage.local.get("settings");
console.log("Loaded content script");
console.log(`Loaded global settings with value: ${settings}`);

/**
 * onChange event handler
 */
const storageChangeHandler = () => {
    settings = JSON.parse(localStorage.getItem('settings'));
    console.log("Updated settings")
};

window.addEventListener('storage', storageChangeHandler);

/*
    Outlook <div> class names.
 */
const newMsg = "_33rLSYbzxvhXjgYTwfjWQI";
const buttonRow = "ivs3kF0TSy1MNYEjC_hAw";
const contentDiv = "_2s9KmFMlfdGElivl0o-GZb";
const recipientSpan = "ReadWriteCommonWell-wellItemText wellItemText-";
const recipientRootDiv = "_3Yr_hO7j5doGUkhrRiP6uY";

/*
    Injection logic.
 */
const button = "<button id=\"krekpakurbe\">Encrypt</button>";

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
};

waitForElm("." + newMsg).then(elm => {
    console.log(elm.textContent);
    elm.addEventListener("click", evt => {
        console.log("Triggered onClick event");
        waitForElm("." + buttonRow).then(elm1 => {
            console.log(elm1.textContent);
            //if(settings.enabled){
            const buttonRowElement = document.getElementsByClassName(buttonRow).item(0);
            if (buttonRowElement) {
                buttonRowElement.innerHTML += button;
                waitForElm("#krekpakurbe").then(elm2 => {
                    elm2.addEventListener("click", clickHandler);
                    console.debug("Added krekpakurbe onClick listener");
                });
            }
            //}
        })
    });
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
    let spans = [];
    const recipientRootDivElement = document.getElementsByClassName(recipientRootDiv).item(0);
    if (recipientRootDivElement) {
        const spanList = recipientRootDivElement.getElementsByTagName("span");
        if (spanList.length > 0) {
            for (let spanElement of spanList) {
                if (spanElement.className.includes(recipientSpan)) {
                    let text = spanElement.innerHTML;
                    if (text.includes("&lt;")) {
                        text = text.split("&lt;")[1].split("&gt;")[0];
                    }
                    spans.push(text);
                }
            }
            console.debug("Populated spans array.")
        } else {
            console.error("Could not find child elements of type span.")
        }
    }

    if (spans) {
        return spans[0]; //TODO: If we ever implement multiple recipients change this.
    }
    console.debug("error: no email was found.")
    return "";
};

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
        case "encrypted":
            encryptionResponseHandler(data.msg);
            break;
        default:
            console.debug("Invalid command code");
    }
};

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
            console.log(response);
            if(response)
                responseHandler(response);
        }, (e) => {
            console.error(e);
        });
};

/**
 * Handles the incoming message when a custom responseHandler is not defined.
 *
 * @param message {any} The message.
 */
const defaultResponseHandler = (message) => {
    console.debug(`Response received: ${message}`);
};

/**
 * Handles the encryption I/O response.
 *
 * @param message {object} The message.
 */
const encryptionResponseHandler = (message) => {
    defaultResponseHandler(message);

    if (message.includes("error")) {
        throw new Error(message);
    } else {
        const contentDivElement = document.getElementsByClassName(contentDiv).item(0);
        if (contentDivElement) {
            contentDivElement.innerHTML = "<div>" + message.replaceAll("\n", "<br>") + "</div>";
            console.debug("Successfully encrypted main email content.");
        }
    }
};

/**
 * Handles the onClick event on the injected button

 * @param e {Event} Holds click event info.
 */
const clickHandler = (e) => {
    console.debug("Initiated encryption.");
    console.debug(getRecipientEmail());

    const contentDivElement = document.getElementsByClassName(contentDiv).item(0);
    if (contentDivElement) {
        if (contentDivElement.innerHTML) {
            console.log("Sent encryption over to background");
            sendMessage(
                "encrypt",
                {
                    email: getRecipientEmail(),
                    text: contentDivElement.innerHTML
                },
                encryptionResponseHandler
            );
        } else {
            console.debug("There was nothing to encrypt...");
        }
    }
};