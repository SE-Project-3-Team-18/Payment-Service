/* eslint-disable max-len */
const ServiceRegistryClient = require('../utils/serviceRegistry');
const axios = require('axios');

async function sendPaymentDetails(data) {
  try {
    const UserServiceUrl = await ServiceRegistryClient.getInstance().getUrl('User-Management');
    const url = new URL('/api/order/create', UserServiceUrl).toString()
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart details:', error.message);
    throw error;
  }
}

module.exports = { sendPaymentDetails };
