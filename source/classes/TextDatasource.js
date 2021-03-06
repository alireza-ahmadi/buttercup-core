"use strict";

const iocane = require("iocane").crypto;

var Archive = require("./Archive.js"),
    Credentials = require("./Credentials.js"),
    signing = require("../tools/signing.js"),
    encoding = require("../tools/encoding.js");

/**
 * Pre-process credentials data
 * @param {string|Credentials} credentials Password or Credentials instance
 * @returns {{ password: string|undefined, keyfile: string|undefined }} Credential data
 * @throws {Error} Throws if both password and keyfile are undefined
 * @private
 * @memberof TextDatasource
 */
function processCredentials(credentials) {
    if (typeof credentials === "string") {
        // credentials is a password, so convert to an instance
        let pass = credentials;
        credentials = new Credentials();
        credentials.setPassword(pass);
    }
    // either might be undefined, but at least one needs to be defined
    let password = credentials.getPassword(),
        keyfile = credentials.getKeyFile();
    if (!password && !keyfile) {
        throw new Error("Neither a password or key-file was provided");
    }
    return {
        password,
        keyfile
    };
}

/**
 * Datasource for text input and output
 * @class TextDatasource
 */
class TextDatasource {

    /**
     * Constructor for the text datasource
     * @param {string} content The content to load from
     */
    constructor(content) {
        this._content = content;
    }

    /**
     * Load from the stored content using a password to decrypt
     * @param {string|Credentials} credentials The password or Credentials instance to decrypt with
     * @param {Boolean=} emptyCreatesNew Create a new Archive instance if text contents are empty (defaults to false)
     * @returns {Promise.<Archive>} A promise that resolves with an open archive
     */
    load(credentials, emptyCreatesNew) {
        emptyCreatesNew = (emptyCreatesNew === undefined) ? false : emptyCreatesNew;
        let credentialsData = processCredentials(credentials),
            password = credentialsData.password,
            keyfile = credentialsData.keyfile;
        if (this._content.trim().length <= 0) {
            return emptyCreatesNew ?
                new Archive() :
                Promise.reject(new Error("Unable to load archive: contents empty"));
        }
        return Promise.resolve(this._content)
            .then(function(data) {
                if (!signing.hasValidSignature(data)) {
                    return Promise.reject(new Error("No valid signature in archive"));
                }
                return signing.stripSignature(data);
            })
            .then(function(encryptedData) {
                // optionally decrypt using a key file
                return keyfile ?
                    iocane.decryptWithKeyFile(encryptedData, keyfile) :
                    encryptedData;
            })
            .then(function(encryptedData) {
                // optionally decrypt using a password
                return password ?
                    iocane.decryptWithPassword(encryptedData, password) :
                    encryptedData;
            })
            .then(function(decrypted) {
                if (decrypted && decrypted.length > 0) {
                    var decompressed = encoding.decompress(decrypted);
                    if (decompressed) {
                        return decompressed.split("\n");
                    }
                }
                return Promise.reject("Decryption failed");
            })
            .then(function(history) {
                var archive = new Archive(),
                    westley = archive._getWestley();
                westley.clear();
                history.forEach(westley.execute.bind(westley));
                return archive;
            });
    }

    /**
     * Save an archive with a password
     * @param {Archive} archive The archive to save
     * @param {string} credentials The password or Credentials instance to encrypt with
     * @returns {Promise.<string>} A promise resolving with the encrypted content
     */
    save(archive, credentials) {
        let credentialsData = processCredentials(credentials),
            password = credentialsData.password,
            keyfile = credentialsData.keyfile;
        let history = archive._getWestley().getHistory().join("\n"),
            compressed = encoding.compress(history);
        return Promise
            .resolve(compressed)
            .then(function(encryptedData) {
                return password ?
                    iocane.encryptWithPassword(encryptedData, password) :
                    encryptedData;
            })
            .then(function(encryptedData) {
                return keyfile ?
                    iocane.encryptWithKeyFile(encryptedData, keyfile) :
                    encryptedData;
            })
            .then(signing.sign);
    }

    /**
     * Set the text content
     * @param {string} content The new text content
     * @returns {TextDatasource} Self
     */
    setContent(content) {
        this._content = content;
        return this;
    }

    /**
     * Output the datasource configuration as a string
     * @returns {string}
     */
    toString() {
        return "ds=text";
    }

}

module.exports = TextDatasource;
