const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
} = require("@aws-sdk/lib-dynamodb");


var SingletonDb = (function () {
    var instance;

    function createInstance() {
        const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);
        return dynamoDbClient;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();


module.exports.SingletonDb=SingletonDb;