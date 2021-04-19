import {PublicKey, PrivateKey} from "../src/containers/key.js";

/*
    Settings
 */
let settings = {
    enabled: true,
    publicKeys: [],
    userKeys: {
        "public": {},
        "private": {}
    }
};

/**
 * Saves a key value pair to browser.storage.local
 *
 * @param key {String}
 * @param value {Object}
 */
const saveToStorage = (key, value) => {
    let data = {
        [key]: value
    }

    browser
        .storage
        .local
        .set(data)
        .then(() => {
            console.debug(`Saved obj(${JSON.stringify(value)}) to key(${key}).`)
        }, e => {
            console.error(e);
        });
}

/**
 * Saves the settings object to browser.storage.local
 */
const saveSettings = () => {
    saveToStorage("settings", settings);
}

/**
 * Return settings from browser.storage.local.
 *
 * @returns {any}
 */
const getFromStorage = async () => {
    return browser
        .storage
        .local
        .get("settings")
        .then(obj => {
            return obj["settings"];
        }, e => {
            console.error(e);
        });
}

(async () => {
    browser
        .storage
        .onChanged
        .addListener((changes, areaName) => {
            if (areaName === "local") {
                console.debug("Settings updated.")
                getFromStorage().then(obj => settings = (obj) ? obj : settings);
            }
        });

    getFromStorage().then(r => {
        if (r) {
            settings = r;
            const cb = document.getElementById("checkbox1");
            if (cb) cb.checked = settings.enabled;

            console.debug("Loaded settings.")
        } else {
            saveToStorage("settings", settings);
            console.log("Populated storage with default settings.");
        }
    });
})();

/*
*   Event injection
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

waitForElm("#gumbek").then(elm => {
    elm.addEventListener("click", event => saveUser(event));
});

waitForElm("#checkbox1").then(elm => {
    elm.addEventListener("change", event => cbFunction());
});

waitForElm("#btn").then(elm => {
    elm.addEventListener("click", event => savePublic(event));
});

/*
    Main logic
 */
function cbFunction() {
    const cb = document.getElementById("checkbox1");
    console.log("Change event.");

    if (cb) {
        settings.enabled = cb.checked;
        console.debug(settings.enabled);

        saveSettings();
    }
}

function saveUser(e) {
    e.preventDefault();

    let ime = document.getElementById("inputime1").value;
    let priimek = document.getElementById("inputpriimek").value;
    let email = document.getElementById("inputemail").value;
    let pubkey = document.getElementById("inputpublic").value;
    let privkey = document.getElementById("inputpriv").value;
    let geslo = document.getElementById("inputgeslo").value;

    settings.userKeys.public = new PublicKey(ime, priimek, email, pubkey);
    settings.userKeys.private = new PrivateKey(ime, priimek, email, privkey, geslo);

    saveSettings();
}

function savePublic(e) {
    e.preventDefault();

    settings
        .publicKeys
        .push(
            new PublicKey(
                document.getElementById("ime2").value,
                document.getElementById("priimek2").value,
                document.getElementById("email2").value,
                document.getElementById("tuji2").value
            ));

    saveSettings();
}
