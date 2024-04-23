const { connect } = require('nats');

async function orderCancelledListener(subject, refundPayment) {
  const client = await connect({
    servers: 'nats://localhost:4222',
  });
  console.log('Listener connected to NATS');
  client.subscribe(subject, {
    queue: 'order-cancelled',
    callback: (err, msg) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log(`Received message: ${msg.data}`);
        refundPayment(msg.data.paymentId);
        msg.ack();
      }
    },
  });
}

module.exports = { orderCancelledListener };
