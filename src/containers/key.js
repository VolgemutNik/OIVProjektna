export class PublicKey {
    constructor(ime, priimek, email, publicKey) {
        this.ime = ime;
        this.priimek = priimek;
        this.email = email;
        this.key = publicKey;
    }

    toString() {
        return JSON.stringify(this);
    }
}

export class PrivateKey extends PublicKey {
    constructor(ime, priimek, email, privateKey, secret) {
        super(ime, priimek, email, privateKey);
        this.secret = secret;
    }

    toString() {
        return super.toString();
    }
}