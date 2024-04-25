/* eslint-disable max-len */
const ServiceRegistryClient = require('../utils/serviceRegistry');
const axios = require('axios');

async function sendPaymentDetails(data) {
  try {
    const OrderServiceUrl = await ServiceRegistryClient.getInstance().getUrl('Order-Management');
    const url = new URL('/api/order/create', OrderServiceUrl).toString()
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart details:', error.message);
    throw error;
  }
}

module.exports = { sendPaymentDetails };
