'use strict';

///////////////////
// Vendor Module //
///////////////////

// Use dotenv to modularize the store name
require('dotenv').config();
// Use the event pool to gather events
const events = require('../events/events');
// Use faker to create order data
var faker = require('faker');

function createOrder () {
  let orderStore = process.env.STORE_NAME;
  let orderId = faker.random.uuid();
  let orderCustomer = faker.name.findName();
  let orderAddress = `${faker.address.streetAddress(true)}, ${faker.address.city()}, ${faker.address.stateAbbr()} ${faker.address.zipCodeByState()}`;
  let customerOrder = { orderStore, orderId, orderCustomer, orderAddress };
  return customerOrder;
}

function pickupOrder(customerOrder = createOrder()) {
  events.emit('pickup', customerOrder);
}

setInterval(pickupOrder, 5000);

events.on('delivered', didDelivery);

function didDelivery (payload) {
  console.log(`VENDOR: Thank you for delivering ${payload.orderId}`);
}

module.exports = { createOrder, pickupOrder, didDelivery };
