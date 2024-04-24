/* eslint-disable max-len */
const ServiceRegistryClient = require('../utils/serviceRegistry');
const { CustomError } = require('../utils/error');
const axios = require('axios');

async function getCartDetails(userId) {
  try {
    const CartServiceUrl = await ServiceRegistryClient.getInstance().getUrl('Cart');
    const url = new URL(`/api/view/${userId}`, CartServiceUrl).toString()

    const response = await axios.get(url);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching cart details:', error.message);
    throw error;
  }
}

module.exports = { getCartDetails };
