'use strict';

///////////////////
// Driver Module //
///////////////////

// Use the event pool to gather events
const events = require('../events/events');

events.on('pickup', (payload) => {
  setInterval( (payload) => {
    console.log(`DRIVER: picked up ${payload.orderId}`);
  }, 1000);
  setInterval( () => {
    events.emit('delivered', (payload) => {
      console.log(`DRIVER: delivered up ${payload.orderId}`);
    })
  }, 3000);
});
