const AWS = require("aws-sdk");
const { config } = require('../../config');


AWS.config.update({
    region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.addUser = async ({
    tableName = "users",
    address,
    encryptedWif,
    salt,
    verifier,
    login,
    accessToken,
}) => {
    const params = {
        TableName: tableName,
        Item: {
            address,
            encryptedWif,
            salt,
            verifier,
            login,
            accessToken,
        },
    };
    return await dynamoDb.put(params).promise();
};