'use strict';

//////////////
// CAPS Hub //
//////////////

// Load in the event pool
const events = require('./events/events');

// Load in the modules
require('./modules/driver');
require('./modules/vendor');

// VENDOR Events - 'pickup', 'in-transit' 'delivered'
// Log each with: timestamp, payload and event
events.on('pickup', (payload) => logEvent('pickup', payload));
events.on('in-transit', (payload) => logEvent('in-transit', payload));
events.on('delivered', (payload) => logEvent('delivered', payload));

function logEvent(event, payload) {
  const timestamp = new Date().toString();
  console.log('EVENT', { event, timestamp, payload });
}