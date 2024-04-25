const Payment = require('../models/payment');
const config = '../config/config.js';
// eslint-disable-next-line max-len
const { CustomError } = require('../utils/error');
const stripe = require('stripe')(config.SECRET_KEY);

async function refundPayment(paymentId) {
  try {
    const payment = await Payment.findOne({ _id: paymentId });
    if (!payment) {
      throw new CustomError('Payment not found', 404, false);
    }
    if (payment.paymentStatus === 'paid') {
      stripe.refunds.create({
        payment_intent: payment.paymentIntentId,
      });
    }
    await Payment.findByIdAndUpdate(
      paymentId,
      { $set: { paymentStatus: 'refunded' } },
      { new: true }
    );
  } catch (error) {
    console.error('Error refunding payment:', error);
    throw error;
  }
}

module.exports = { refundPayment };
