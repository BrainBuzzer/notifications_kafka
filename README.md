# Notifications Kafka

This is kafka based notification ingester microservice.

## Details

This notification ingester takes message from Kafka in the format that key is the User ID, and value is the connection type. Depending on the connection type, rest of the headers are parsed from the incoming message, and are put in DynamoDB accordingly.

## Local Development

Run the following commands to start the proper development environment:

```
export HOST_IP=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1)
docker-compose up -d
npm install
npm run setup
npm run dev
```

> HOST_IP is required for kafka-docker. You can check why [here](https://github.com/wurstmeister/kafka-docker/wiki/Connectivity).

Once this is done, you can try sending the test messages by running `node sendMessage.js`. You can also modify the message in the `sendMessage.js` file.
