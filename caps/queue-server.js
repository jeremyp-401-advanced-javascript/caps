'use strict';

//////////////
// CAPS Hub //
//////////////

// Load in the modules
require('dotenv').config();
const uuid = require('uuid').v4;
// Get PORT from .env
const port = process.env.PORT || 3000;
const io = require('socket.io')(port);
const { logEvent } = require('./modules/logEvent');

const queue = {
  messages: {},
};
console.log('queue', queue);

io.on('connection', (socket) => {
  console.log('Welcome to the HUB', socket.id);
});

// CAPS namespace
const caps = io.of('/caps');
caps.on('connection', (socket) => {
  console.log(`Welcome to the CAPS namespace, ${socket.id}`);
  console.log('queue', queue);
  
  // When 'join' is heard, log and join the user to the room
  socket.on('join', (room) => {
    // Log that the room was joined
    console.log(`${socket.id} is joining ${room}`);
    socket.join(room);
    console.log('queue', queue);
  });
  
  // When 'getAllMessages' is heard send back all orders in the queue
  socket.on('getAllMessages', (message) => {
    console.log(`CAPS hub heard 'getAllMessages'`, message);
    // Loop through all of the keys in the queue if it isn't empty
    if (!queue.messages[message.event]) { queue.messages[message.event] = {}; }
    if (!queue.messages[message.event][message.clientId]) { queue.messages[message.event][message.clientId] = {}; }

    if (queue.messages[message.event][message.clientId]) {
      socket.emit('recieveQueuedMessages', {payload: queue.messages[message.event][message.clientId]});
    }
  });
  
  // Let everyone in the room know that 'recieved' happened
  socket.on('recievedMessages', (message) => {
    //console.log('_53____recmessage_______', message);
    //console.log(`CAPS hub heard 'recievedMessages' from: ${message.clientId}`);
    //console.log('about to delete from queue:', queue.messages);
    queue.messages[message.event][message.clientId] = {}; // Remove orders where the message id matches
    //console.log(`queue.messages.${message.event}.${message.clientId}`, queue.messages[message.event][message.clientId]);
    //console.log(`${message.event}.${message.clientId} should be empty:`, queue.messages);
  });

  // Let everyone in the room know that a 'needPickup' happened
  // vendor message is like {clientId: '1-206-Flowers', customerOrder}
  socket.on('needPickup', message => {
    //console.log('_60_____pickupmessage_______', message);
    let messageId = uuid();
    // Put message in queue
    if (!queue.messages.needPickup) { queue.messages.needPickup = {}; }
    if (!queue.messages.needPickup['driver']) { queue.messages.needPickup['driver'] = {}; }
    //console.log(`pre added to the "needPickup" "driver" message queue`, queue.messages['needPickup']['driver']);
    queue.messages.needPickup['driver'][messageId] = message.payload;
    //console.log(`post added to the "needPickup" "driver" message queue`, queue.messages.needPickup.driver);
    // Use logEvent to console log the payload and time
    logEvent('needPickup', message);
    // Send a confirmation to the 'driver' room
    caps.in('driver').emit('needPickup', { messageId, payload: message.payload });
  });
  
  // Let everyone in the room know that a 'in-transit' happened
  socket.on('in-transit', message => {
    // Use logEvent to console log the payload and time
  //logEvent('in-transit', message);
    // Sends the 'in-transit' to the store specified in the payload
    caps.to(message.orderStore).emit('in-transit', message);
  });
  
  // When an order has been delivered
  // Let everyone in the room know that 'delivered' happened
  socket.on('delivered', message => {
    // console.log('in the delivered message', message);
    // console.log('on delivered message queue.messages', queue.messages);

    // console.log('driver needpickup queue', queue.messages['needPickup']['driver']);

    const messageId = uuid();
    if (!queue.messages.delivered) { queue.messages.delivered = {}; }
    if (!queue.messages.delivered[message.payload.payload.orderStore]) { queue.messages.delivered[message.payload.payload.orderStore] = {}; }

    queue.messages.delivered[message.payload.payload.orderStore][messageId] = message.payload;
    // Use logEvent to console log the payload and time
    logEvent('delivered', message.payload);
    // Sends the 'in-transit' to the store specified in the payload
    caps.to(message.orderStore).emit('delivered', message);
  });

});

