// eslint-disable-next-line object-curly-newline
const { connect } = require('nats');

async function paymentCreatedPublisher(subject, eventData) {
  const client = await connect({
    servers: ['nats://127.0.0.1:4222'], // Your NATS server URL
  });
  console.log('Publisher connected to NATS');
  client.publish(subject, JSON.stringify(eventData));
}

module.exports = { paymentCreatedPublisher };
