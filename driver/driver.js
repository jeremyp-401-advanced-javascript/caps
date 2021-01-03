'use strict';

///////////////////
// Driver Module //
///////////////////

// Load in the modules
require('dotenv').config();
const companyId = process.env.STORE_NAME; // 'driver' in this case

const Queue = require('./queue');
const queue = new Queue(companyId);

// Emit a 'join' event with the room name(the store) when the room is joined
queue.socket.emit('join', process.env.STORE_NAME);
// Emit a 'getAll' to get all messages from the queue server
queue.socket.emit('getAllMessages', { clientId: companyId, event: 'needPickup' });
// Listen for 'recieveQueuedMessage'
queue.socket.on('recieveQueuedMessages', (message) => { messageActions(message); });

const messageActions = function (message) {
  //console.log('Heard recieveQueuedMessages');
  //console.log(message);
  // We may get back quite a few messages...
  Object.keys(message.payload).forEach(key => {
    console.log(key);
    //console.log(message.payload.driver[key]);
    driverActions({ messageid: key, payload: message.payload[key] });
  });
  console.log('This should remove the messages from the needPickup queue');
  queue.socket.emit('recievedMessages', { clientId: companyId, event: 'needPickup' });
};

// Listen for a pickup
queue.socket.on('needPickup', (message) => { driverActions(message); });

const driverActions = (message) => {
  console.log('doing driver actions');
  setTimeout( () => { doPickup(message); }, 1500); // Simulate picking up the package 1500
  setTimeout( () => { doDelivery(message); }, 3000); // Simulate delivering the package 3000
};

function doPickup(message) {
  console.log('doPick', message);
  console.log(`Picking up ${message.payload.orderId}`);
  queue.socket.emit('in-transit', message.payload);
}

function doDelivery(message) {
  console.log('doDeli', message);
  console.log(`Delivering up ${message.payload.orderId}`);

  queue.trigger('delivered', {messageId: message.messageId, payload: message.payload});
}

module.exports = { doPickup, doDelivery};
