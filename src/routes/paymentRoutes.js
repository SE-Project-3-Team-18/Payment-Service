const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const bodyParser = require('body-parser');

router.get('/getpayment', paymentController.getPaymentById);
router.post('/checkout', paymentController.handleCheckout);
// eslint-disable-next-line max-len
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), paymentController.handleWebhook);

module.exports = router;
