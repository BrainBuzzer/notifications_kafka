const ip = require("ip");

const { Kafka, logLevel } = require("kafkajs");
const taskUpdateIngester = require("./ingesters/taskUpdate");

const host = process.env.HOST_IP || ip.address();

const kafka = new Kafka({
  logLevel: logLevel.INFO,
  brokers: [`${host}:9092`],
  clientId: "notification-consumer",
});

const topic = "notifications";
const consumer = kafka.consumer({ groupId: "test-group" });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (message.value.toString() === "task_update") {
        taskUpdateIngester(message);
      } else if (message.value.toString() === "connection_request") {
        connectionRequestIngester(message);
      } else if (message.value.toString() === "connection_update") {
        connectionUpdateIngester(message);
      } else {
        // notify sentry or other error handling system that unknown message was found for observability
        console.log(
          "Unknown message found: ",
          message.key.toString(),
          message.value.toString()
        );
      }
    },
  });
};

run().catch((e) => console.error(`[consumer] ${e.message}`, e));

const errorTypes = ["unhandledRejection", "uncaughtException"];
const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];

errorTypes.forEach((type) => {
  process.on(type, async (e) => {
    try {
      console.log(`process.on ${type}`);
      console.error(e);
      await consumer.disconnect();
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTraps.forEach((type) => {
  process.once(type, async () => {
    try {
      await consumer.disconnect();
    } finally {
      process.kill(process.pid, type);
    }
  });
});
