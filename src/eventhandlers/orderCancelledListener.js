const { connect, StringCodec } = require('nats');

async function orderCancelledListener(subject, refundPayment) {
  const client = await connect({
    servers: 'nats://127.0.0.1:4222',
  });
  console.log('Listener connected to NATS');
  const sc = StringCodec();
  client.subscribe(subject, {
    queue: 'cancellation-listener',
    callback: (err, msg) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log(`Received message: ${msg.data}`);
        const paymentId = sc.decode(msg.data)
        refundPayment(paymentId);
      }
    },
  });
}

module.exports = { orderCancelledListener };
