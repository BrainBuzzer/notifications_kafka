// parse the message headers
const parseMessageHeaders = (message) => {
  const headers = message.headers;
  const messageHeaders = {};
  // message headers are in this format:
  // {"fromUserId":{"type":"Buffer","data":[70,114,111,109,73,68]},"taskId":{"type":"Buffer","data":[84,97,115,107,73,68]},"taskStatus":{"type":"Buffer","data":[84,97,115,107,83,116,97,116,117,115]},"connectionStatus":{"type":"Buffer","data":[67,111,110,110,101,99,116,105,111,110,83,116,97,116,117,115]}}
  console.log(message.headers);
  Object.keys(headers).forEach((key) => {
    console.log(key);
    console.log(headers[key]);
    messageHeaders[key] = headers[key].toString();
  });
  return messageHeaders;
};

module.exports = parseMessageHeaders;
