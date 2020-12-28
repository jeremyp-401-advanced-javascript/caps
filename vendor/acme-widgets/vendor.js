'use strict';

///////////////////
// Vendor Module // Need work!
///////////////////

// Load in the modules
require('dotenv').config();
// Get PORT from .env
const port = process.env.PORT || 3000;
const host = process.env.HOST;

const io = require('socket.io-client');
const socket = io.connect(`${host}:${port}/caps`);
var faker = require('faker'); // Use faker to create order data

// Emit a 'join' event with the room name(the store) when the room is joined
socket.emit('join', process.env.STORE_NAME);

setInterval( createOrder, 500); // Simulate creating an order

function createOrder() {
  let orderStore = process.env.STORE_NAME;
  let orderId = faker.random.uuid();
  let orderCustomer = faker.name.findName();
  let orderAddress = `${faker.address.streetAddress(true)}, ${faker.address.city()}, ${faker.address.stateAbbr()} ${faker.address.zipCodeByState()}`;
  let customerOrder = { orderStore, orderId, orderCustomer, orderAddress };
  socket.emit('pickup', customerOrder); // Driver will listen for this
  return customerOrder; // Used by testing, but won't hurt anything else.
}

socket.on('delivered', (payload) => {
  sayThanks(payload); // Say thanks for delivering the package
});

function sayThanks(payload) {
  console.log(`VENDOR: Thank you for delivering ${payload.orderId}`);
}

module.exports = { createOrder, sayThanks };
