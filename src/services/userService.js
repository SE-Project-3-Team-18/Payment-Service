/* eslint-disable max-len */
const ServiceRegistryClient = require('../utils/serviceRegistry');
const { CustomError } = require('../utils/error');
const axios = require('axios');

async function getEmailByUserId(userId) {
  try {
    const UserServiceUrl = await ServiceRegistryClient.getInstance().getUrl('User-Management');
    const url = new URL(`/api/get-email/${userId}`, UserServiceUrl).toString()
    const emailDetails = await axios.get(url);
    return emailDetails.data.email;
  } catch (e) {
    let error = null
    if (axios.isAxiosError(e) === true) {
      if (e.response) {
        error = new CustomError(e.response?.data?.message, e.response?.status, false)
      } else {
        error = new CustomError(`Axios Error: ${e.message}`, 500, true)
      }
    } else {
      error = new CustomError(e.message, 500, true)
    }
    throw error
  }
}

module.exports = { getEmailByUserId };
