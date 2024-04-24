/* eslint-disable no-undef */
/* eslint-disable max-len */
const config = require('../config/config.js');
const Payment = require('../models/payment');
const { paymentCreatedPublisher } = require('../eventhandlers/paymentCreatedPublisher');
const stripe = require('stripe')(config.SECRET_KEY);
const cartService = require('../services/cartService');

async function savePaymentSession(session) {
  const payment = new Payment({
    userId: session.metadata.userId,
    paymentIntentId: session.payment_intent,
    paymentAmount: session.amount_total / 100,
    paymentMethod: session.payment_method_types[0],
    paymentStatus: session.payment_status,
    paymentDate: new Date(),
    checkoutSessionId: session.id,
  });
  try {
    await payment.save();
    return payment;
  } catch (err) {
    console.error('Error saving payment details:', err);
  }
};

async function getPaymentById (req, res, next) {
  const { paymentId } = req.query;
  try {
    const payment = await Payment.findOne({ _id: paymentId });
    if (!payment) {
      throw new CustomError('Payment Session not found', 404, false);
    }
    res.send(payment);
  } catch (error) {
    next(error);
  }
};

async function handleCheckout (req, res) {
  try {
    const userId = req.get('X-User-Id')
    console.log("UserId",userId);
    const userCart = await cartService.getCartDetails(userId)
    if (!userCart || userCart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const lineItems = userCart.items.map((item) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.imageUrl],
            metadata: {
              id: item.productId,
            },
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      };
    });

    if (lineItems.length === 0) {
      return res.status(400).json({ error: 'These products are not available right now' });
    }
    console.log("Before Stripe Payment");
    const session = await stripe.checkout.sessions.create({
      metadata: {
        userId,
        // address: JSON.stringify(address),
      },
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: 'joseph.vijay@gmail.com',
      billing_address_collection: 'required',
      success_url: config.SUCCESS_URL,
      cancel_url: config.CANCEL_URL,
    });
    res
      .status(200)
      .json({
        redirectUrl: session.url
      })
    console.log("Succesful Stripe Payment");
    return {
      message: 'Payment checkout session successfully created',
      success: true,
      result: session.url,
    };
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

async function handleWebhook(req, res) {
  const payload = req.body;
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, config.WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed:  ${err}`);
    return res.sendStatus(400);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const payment = savePaymentSession(session);
    const eventData = {
      userId: payment.userId,
      paymentId: payment._id,
      address: session.metadata.address,
      email: session.customer_email,
    }
    console.log('Payment created event data:', eventData);
    try {
      await paymentCreatedPublisher('payment:created', eventData);
    } catch (err) {
      console.error('Error publishing payment-created event:', err);
      return res.status(500).send('Error publishing event');
    }
  }
  res.status(200).end();
};

module.exports = {
  getPaymentById,
  handleCheckout,
  handleWebhook,
};
