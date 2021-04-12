import {PublicKey, PrivateKey} from "../src/containers/key";
import * as openpgp from "../lib/openpgp.min.mjs";

//TODO: settings persistence
const settings = {
    enabled: true,
    publicKeys: [
        new PublicKey("", "", "", ""),
        new PublicKey("", "", "", "")
    ],
    userKeys: {
        "public": new PublicKey("", "", "", ""),
        "private": new PrivateKey("", "", "", "", "")
    }
};

const sendMessage = (obj) => {

};

const encrypt = async () => {

};
