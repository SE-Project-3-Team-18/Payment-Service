const Payment = require('../models/payment');
const config = '../config/config.js';
// eslint-disable-next-line max-len
const stripe = require('stripe')(config.SECRET_KEY);

async function refundPayment(paymentId) {
  const payment = await Payment.findOne({ _id: paymentId });
  if (payment) {
    if (payment.paymentStatus === 'paid') {
      stripe.refunds.create({
        payment_intent: payment.paymentIntentId,
        charge: payment.paymentAmount * 100,
      });
      payment.paymentStatus = 'refunded';
    }
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { $set: { paymentStatus: 'refunded' } },
      { new: true }
    );
  }
}

module.exports = { refundPayment };
