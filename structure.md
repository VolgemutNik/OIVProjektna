Basic structure:  
* Logika(JS):
    * Trigger: ali event dodan na obstojeci gumb ali injectamo html z svojim gumbom 'Encrypt/Sifriraj'
    * Encryption(OpenPGP): z pomocjo [openpgp.js knjiznice](https://github.com/openpgpjs/openpgpjs) implementiramo enkripcijo clear text in zamenjavo le tega z koncnim produktom + key check
* Nastavitve(HTML + CSS, JS):
    * Dodajanje/spreminjanje uporabnikovega privatnega+javnega kljuca
    * Seznam in dodajanje/spreminjanje javnih kljucev prejemnikov(ime, priimek, email, pgp key)
    * Enable/Disable button
