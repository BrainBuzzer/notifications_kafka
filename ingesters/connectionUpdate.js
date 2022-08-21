const AWS = require("aws-sdk");
const parseMessageHeaders = require("../utils/messageParser");

const dynamoDbClient = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
  accessKeyId: "DEFAULT_ACCESS_KEY",
  secretAccessKey: "DEFAULT_SECRET",
});

const tableName = "notifications";

const connectionUpdateIngester = async (message) => {
  let headers = parseMessageHeaders(message);
  if (headers.notificationId && header.connectionStatus) {
    // update the connection request notification
    const params = {
      TableName: tableName,
      Key: {
        notificationId: headers.notificationId,
      },
      UpdateExpression:
        "set connectionStatus = :connectionStatus, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":connectionStatus": headers.connectionStatus,
        ":updatedAt": new Date().toISOString(),
      },
      ReturnValues: "UPDATED_NEW",
    };
    try {
      await dynamoDbClient.update(params).promise();
      console.log(
        `Updated connection_request notification for user ${message.key.toString()}`
      );
    } catch (e) {
      console.error(`[connectionUpdateIngester] ${e.message}`, e);
    }
  } else {
    console.log("Invalid message");
  }
};

module.exports = connectionUpdateIngester;
