'use strict';

///////////////////
// Driver Module //
///////////////////

// Use the event pool to gather events
const events = require('../events/events');

events.on('pickup', (payload) => deliverySteps(payload));

function deliverySteps(payload) {
  setTimeout( () => { didPickup(payload); }, 3000);
  setTimeout( () => { didDelivery(payload); }, 1000);
}

function didPickup(payload) {
  console.log(`DRIVER: picked up ${payload.orderId}`);
  events.emit('in-transit', payload);
}

function didDelivery(payload) {
  console.log(`DRIVER: delivered up ${payload.orderId}`);
  events.emit('delivered', payload);
}

module.exports = { deliverySteps, didPickup, didDelivery };
