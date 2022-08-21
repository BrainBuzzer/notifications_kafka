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

const taskUpdateIngester = async (message) => {
  let headers = parseMessageHeaders(message);
  if (headers.fromUserId && headers.taskId && headers.taskStatus) {
    const params = {
      TableName: tableName,
      Item: {
        userId: message.key.toString(),
        notificationType: "task_update",
        fromUserId: headers.fromUserId,
        taskId: headers.taskId,
        taskStatus: headers.taskStatus,
        notificationId: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    try {
      await dynamoDbClient.put(params).promise();
      console.log(`Added notification for user ${message.key.toString()}`);
    } catch (e) {
      console.error(`[taskUpdateIngester] ${e.message}`, e);
    }
  } else {
    console.log("Invalid message");
  }
};

module.exports = taskUpdateIngester;
