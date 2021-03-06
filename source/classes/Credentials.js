"use strict";

const iocane = require("iocane").crypto;

var Model = require("./Model.js"),
    Signing = require("../tools/signing.js");

/**
 * The signature of encrypted credentials
 * @private
 * @type {string}
 * @memberof Credentials
 */
var SIGNING_KEY = Signing.getSignature() + "cred.";

/**
 * Sign encrypted content
 * @see SIGNING_KEY
 * @private
 * @static
 * @memberof Credentials
 * @param {String} content The encrypted text
 * @returns {String} The signed key
 */
function signEncryptedContent(content) {
    return SIGNING_KEY + content;
}

/**
 * Remove the signature from encrypted content
 * @private
 * @static
 * @memberof Credentials
 * @param {String} content The encrypted text
 * @returns {String} The unsigned encrypted key
 * @throws {Error} Throws if no SIGNING_KEY is detected
 * @see SIGNING_KEY
 */
function unsignEncryptedContent(content) {
    if (content.indexOf(SIGNING_KEY) !== 0) {
        throw new Error("Invalid credentials content (unknown signature)");
    }
    return content.substr(SIGNING_KEY.length);
}

/**
 * @class Credentials
 * @param {Object|Model=} data The initialisation data
 */
var Credentials = function(data) {
    /**
     * Internal data Model
     * @public
     * @instance
     * @memberof Credentials
     * @type {Model}
     */
    this.model = (data instanceof Model) ? data : new Model(data);
};

/**
 * Get identity information
 * @returns {{ username: string|undefined, password: string|undefined }}
 * @memberof Credentials
 */
Credentials.prototype.getIdentity = function() {
    return {
        username: this.model.get("username"),
        password: this.model.get("password")
    };
};

/**
 * Get the key file path or buffer
 * @returns {string|Buffer|undefined} Key file path, data buffer, or undefined
 */
Credentials.prototype.getKeyFile = function() {
    return this._keyFile ? this._keyFile : this.model.get("keyfile");
};

/**
 * Get the password
 * @returns {string|undefined} Password or undefined
 */
Credentials.prototype.getPassword = function() {
    return this.model.get("password");
};

/**
 * Set identity information
 * @param {string} username
 * @param {string} password
 * @returns {Credentials} Self
 * @memberof Credentials
 */
Credentials.prototype.setIdentity = function(username, password) {
    this.model
        .set("username", username)
        .set("password", password);
    return this;
};

/**
 * Set a key file
 * Credentials that use a keyfile with or instead of a password will allow for
 * alternate means of authentication.
 * @param {string|Buffer} pathOrBuffer The path to the key file or a buffer with its contents
 * @returns {Credentials} Self
 */
Credentials.prototype.setKeyFile = function(pathOrBuffer) {
    if (typeof pathOrBuffer === "string") {
        this.model.set("keyfile", pathOrBuffer);
    } else {
        this._keyFile = pathOrBuffer;
    }
    return this;
};

/**
 * Set the password
 * @param {string} password The password to set
 * @returns {Credentials} Self
 */
Credentials.prototype.setPassword = function(password) {
    this.model.set("password", password);
    return this;
};

/**
 * Set the credentials type (eg. webdav/owncloud etc.)
 * @param {string} type The type of credentials
 * @returns {Credentials} Self
 * @memberof Credentials
 */
Credentials.prototype.setType = function(type) {
    this.model.set("type", type);
    return this;
};

/**
 * Set the username
 * @param {string} username The username to set
 * @returns {Credentials} Self
 */
Credentials.prototype.setUsername= function(username) {
    this.model.set("username", username);
    return this;
};

/**
 * Convert the credentials to an encrypted string, for storage
 * @param {string} masterPassword The password for encrypting
 * @returns {Promise} A promise that resolves with the encrypted credentials
 * @memberof Credentials
 * @see signEncryptedContent
 */
Credentials.prototype.convertToSecureContent = function(masterPassword) {
    if (typeof masterPassword !== "string") {
        throw new Error("Master password must be a string");
    }
    return iocane.encryptWithPassword(JSON.stringify(this.model.getData()), masterPassword)
        .then(signEncryptedContent);
};

/**
 * Create a new Credentials instance from encrypted information
 * @param {string} content The encrypted content
 * @param {string} password The master password to decrypt with
 * @memberof Credentials
 * @static
 * @public
 * @returns {Promise} A promise resolving with the new Credentials instance
 */
Credentials.createFromSecureContent = function(content, password) {
    return iocane.decryptWithPassword(unsignEncryptedContent(content), password)
        .then((decryptedContent) => new Credentials(JSON.parse(decryptedContent)));
};

module.exports = Credentials;
