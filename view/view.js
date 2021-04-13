import {PublicKey, PrivateKey} from "../src/containers/key.js";

const settings = {
    enabled: true,
    publicKeys: [
        new PublicKey("", "", "", ""),
        new PublicKey("", "", "", "")
    ],
    userKeys: {
        "public": new PublicKey("", "", "", ""),
        "private": new PrivateKey("", "", "", "", "", "")
    }
};

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
    elm.addEventListener("click", evt => {
        saveuser();
    });
});

waitForElm("#checkbox1").then(elm => {
    elm.addEventListener("change", evt => {
        cbfunction();
    });
});

waitForElm("#btn").then(elm => {
    elm.addEventListener("click", evt => {
        savepublic();
    });
});




function cbfunction() {
    let cb = document.getElementById("checkbox1");

    if (cb.checked == true) {
        console.log("true");
        settings.enabled = true;
    } else {
        console.log("false");
        settings.enabled = false;
    }
}






function saveuser() {

    console.log("test");

    var inputime = document.getElementById("inputime1");
    var inputpriimek = document.getElementById("inputpriimek");
    var inputemail = document.getElementById("inputemail");
    var inputpublic = document.getElementById("inputpublic");
    var inputpriv = document.getElementById("inputpriv");
    var inputgeslo = document.getElementById("inputgeslo");


    let ime = inputime.value;
    let priimek = inputpriimek.value;
    let email = inputemail.value;
    let pubkey = inputpublic.value;
    let privkey = inputpriv.value;
    let geslo = inputgeslo.value;

    let privat = new PrivateKey(ime,priimek,email,privkey, geslo);
    let publickey = new PublicKey(ime,priimek,email,pubkey);

    console.log(privat);
    console.log(publickey);
    
    settings.userKeys.public = publickey;
    settings.userKeys.private = privat;

}

function savepublic() {

    console.log("123223")

    var inputime1 = document.getElementById("ime2");
    var inputpriimek1 = document.getElementById("priimek2");
    var inputemail1 = document.getElementById("email2");
    var inputpublic1 = document.getElementById("tuji2");
   
    
    let ime = inputime1.value;
    let priimek = inputpriimek1.value;
    let email = inputemail1.value;
    let pubkey = inputpublic1.value;

    
    
    //console.log(publickey);

    settings.publicKeys.push(new PublicKey(ime,priimek,email,pubkey));
        console.log(settings);
};