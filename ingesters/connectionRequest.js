const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const parseMessageHeaders = require("../utils/messageParser");

const dynamoDbClient = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
  accessKeyId: "DEFAULT_ACCESS_KEY",
  secretAccessKey: "DEFAULT_SECRET",
});

const tableName = "notifications";

const connectionRequestIngester = async (message) => {
  let headers = parseMessageHeaders(message);
  if (headers.fromUserId && headers.connectionStatus) {
    const params = {
      TableName: tableName,
      Item: {
        userId: message.key.toString(),
        notificationType: "task_update",
        fromUserId: headers.fromUserId,
        connectionStatus: headers.connectionStatus,
        notificationId: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    try {
      await dynamoDbClient.put(params).promise();
      console.log(
        `Added connection_request notification for user ${message.key.toString()}`
      );
    } catch (e) {
      console.error(`[connectionRequestIngester] ${e.message}`, e);
    }
  } else {
    console.log("Invalid message");
  }
};

module.exports = connectionRequestIngester;
