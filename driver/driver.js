'use strict';

///////////////////
// Driver Module //
///////////////////

// Load in the modules
require('dotenv').config();
// Get PORT from .env
const port = process.env.PORT || 3000;
const host = process.env.HOST;

const io = require('socket.io-client');
const socket = io.connect(`${host}:${port}/caps`);

// Listen for a pickup

socket.on('pickup', (payload) => {
  setTimeout( () => { doPickup(payload); },1500); // Simulate picking up the package
  setTimeout( () => { doDelivery(payload); }, 3000); // Simulate delivering the package
});

function doPickup(payload) {
  console.log(`Picking up ${payload.orderId}`);
  socket.emit('in-transit', payload);
}

function doDelivery(payload) {
  console.log(`Delivering up ${payload.orderId}`);
  socket.emit('delivered', payload);
}

module.exports = { doPickup, doDelivery};
