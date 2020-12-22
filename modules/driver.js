'use strict';

///////////////////
// Driver Module //
///////////////////

// Use the event pool to gather events
const events = require('../events/events');

events.on('pickup', doPickup);

function doPickup(payload) {
  console.log('Payload OID: ', payload.orderId);
  setInterval( () => {
    console.log(`DRIVER: picked up ${payload.orderId}`);
    events.emit('in-transit', payload);
  }, 1000);
  
  setInterval( () => {
    console.log(`DRIVER: delivered up ${payload.orderId}`);
    events.emit('delivered', payload);
  }, 3000);
}