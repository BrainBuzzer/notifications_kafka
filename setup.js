// connect to dynamodb on port 8000
const { DynamoDB } = require("@aws-sdk/client-dynamodb");

const dynamoDb = new DynamoDB({
  region: "localhost",
  endpoint: "http://localhost:8000",
  accessKeyId: "fake",
  secretAccessKey: "fake",
});

// create a table named notifications with userId as Hash key and notificationId as Range key
const createTable = async () => {
  const params = {
    TableName: "notifications",
    KeySchema: [
      { AttributeName: "userId", KeyType: "HASH" },
      { AttributeName: "notificationId", KeyType: "RANGE" },
    ],
    AttributeDefinitions: [
      { AttributeName: "userId", AttributeType: "S" },
      { AttributeName: "notificationId", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  };

  const result = await dynamoDb.createTable(params);
  console.log(result);
};

createTable()
  .then(() => console.log("Table created"))
  .catch((e) => console.error(e));
