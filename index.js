const app = require('./src/app')
const config = require('./src/config/config');
// eslint-disable-next-line max-len
const { orderCancelledListener } = require('./src/eventhandlers/orderCancelledListener');
const paymentService = require('./src/services/paymentService');
// eslint-disable-next-line max-len
const ServiceRegistryClient = require('./src/utils/serviceRegistry')

const serviceRegistryClientInstance = new ServiceRegistryClient()
serviceRegistryClientInstance.initialise()

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})

// orderCancelledListener(
//   config.NATS_SUBJECT,
//   paymentService.refundPayment
// );
