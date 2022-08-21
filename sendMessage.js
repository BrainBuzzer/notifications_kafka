// IMPORTANT: Message can be sent only once. If you want to send the same message again, you need to run the script again.
// You can modify the message below to send different data.
const message = {
  key: `userId`,
  value: `task_update`,
  headers: {
    fromUserId: "FromID",
    taskId: "TaskID",
    taskStatus: "TaskStatus",
    connectionStatus: "ConnectionStatus",
  },
};

// Main logic for sending the message.
const ip = require("ip");

const { Kafka, CompressionTypes, logLevel } = require("kafkajs");

const host = process.env.HOST_IP || ip.address();

const kafka = new Kafka({
  logLevel: logLevel.DEBUG,
  brokers: [`${host}:9092`],
  clientId: "test-producer",
});

const topic = "notifications";
const producer = kafka.producer();

const sendMessage = () => {
  return producer
    .send({
      topic,
      compression: CompressionTypes.GZIP,
      messages: [message],
    })
    .then(console.log)
    .catch((e) => console.error(`[producer] ${e.message}`, e));
};

const run = async () => {
  await producer.connect();
  sendMessage();
};

run().catch((e) => console.error(`[producer] ${e.message}`, e));

const errorTypes = ["unhandledRejection", "uncaughtException"];
const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];

errorTypes.forEach((type) => {
  process.on(type, async () => {
    try {
      console.log(`process.on ${type}`);
      await producer.disconnect();
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTraps.forEach((type) => {
  process.once(type, async () => {
    try {
      await producer.disconnect();
    } finally {
      process.kill(process.pid, type);
    }
  });
});
