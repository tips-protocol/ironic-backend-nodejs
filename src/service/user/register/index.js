const { makeToken } = require("../../../lib/jwt");
const parseJson = require("parse-json");
const { config } = require("../../../config");
const stringify = require('fast-json-stable-stringify');
const { addUser } = require("../../../dataBase/user/put");
const CryptoJS = require('crypto-js');

module.exports.register = async ({ event }) => {

    let body, response, address, encryptedWif, login, salt, verifier, encoded;

    try {
        const encodedWord = CryptoJS.enc.Base64.parse(event.body);
        encoded = CryptoJS.enc.Utf8.stringify(encodedWord);
    }
    catch (e) {
        console.warn('[register][Base64.parse]', e);
    }


    try {

        body = parseJson(encoded);

        ({ address, encryptedWif, login, salt, verifier } = body);
    } catch (e) {
        console.warn('[register][parseJson]', e);
    }

    const accessToken = makeToken({ type: "access" });
    try {
        const data = await addUser({
            tableName: config.userTableName,
            address: address,
            encryptedWif: encryptedWif,
            salt: salt,
            verifier: verifier,
            login: login,
            accessToken,
        });

        const resData = {
            accessToken,
            address: address,
            login: login,
            encryptedWif: encryptedWif,
        };

        response = {
            'statusCode': 200,
            'body': stringify(resData)
        };
    } catch (e) {
        console.warn("[register]", e);
        response = {
            'statusCode': 403,
            'body': `Error was occurred [addUser] ${e}`
        };
    }

    return response;
};