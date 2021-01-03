'use strict';

///////////////////
// Vendor Module // Needs work!
///////////////////


// Load in the modules
require('dotenv').config();
const companyId = process.env.STORE_NAME; // '1-206-flowers' in this case
var faker = require('faker'); // Use faker to create order data

const Queue = require('./queue');
const queue = new Queue(companyId);

// Emit a 'join' event with the room name(the store) when the room is joined
queue.socket.emit('join', process.env.STORE_NAME);
// Emit a 'getAll' to get all messages from the queue server
queue.socket.emit('getAllMessages', { clientId: companyId, event: 'delivered' });
// Listen for 'recieveQueuedMessage'
queue.socket.on('recieveQueuedMessages', (payload) => { doSomething(payload); });

const doSomething = function (message) {
  // We may get back quite a few messages...
  Object.keys(message.payload).forEach(key => {
    console.log('____MPK_____', message.payload[key])
    sayThanks(message.payload[key]);
  });
  queue.socket.emit('recievedMessages', { clientId: companyId, event: 'delivered' });
};

///////////// Testing ///////////
// Use the command line to create a few orders up front
if (process.argv[2]) {
  let numOrders = Number(process.argv[2]);
  for (let i = 0; i < numOrders; i++) {
    createOrder();
  }
}

setInterval(createOrder, 15000); // Simulate creating an order every 30 seconds
function createOrder() {
  let customerOrder = {
    orderStore: process.env.STORE_NAME,
    orderId: faker.random.uuid(),
    orderCustomer: faker.name.findName(),
    orderAddress: `${faker.address.streetAddress(true)}, ${faker.address.city()}, ${faker.address.stateAbbr()} ${faker.address.zipCodeByState()}`,
  }
  // will emit this.socket.emit('needPickup', {clientId: '1-206-Flowers', customerOrder});
  queue.trigger('needPickup', customerOrder);
  console.log(`${customerOrder.orderStore} sent a 'needPickup' for order ${customerOrder.orderId}`)
  return customerOrder; // Used by testing, but won't hurt anything else.
}

// Listen for 'in-transit'
queue.socket.on('in-transit', (payload) => { 
  console.log('in-transit', payload.orderId); 
  // will emit this.socket.emit('needPickup', {clientId: '1-206-Flowers', payload});
  //queue.trigger('in-transit', payload);
});

queue.socket.on('delivered', (payload) => { 
  // console.log('________________delipay___________', payload);
  sayThanks(payload);
});

let sayThanks = (message) => {
  console.log(`VENDOR: Thank you for delivering ${message.payload.orderId}`);
  // I need to remove the messages from the drivers queue 
  queue.socket.emit('recievedMessages', { clientId: companyId, event: 'delivered' });
}

module.exports = { createOrder, sayThanks };
