'use strict';

//////////////
// CAPS Hub //
//////////////

// Load in the event pool
const events = require('../events/events');

// Load in the modules
require('./modules/driver');
require('./modules/vendor');

// VENDOR Events
events.on('delivered', (payload) => {
  console.log(`VENDOR: Thank you for delivering ${payload.orderId}`);
})