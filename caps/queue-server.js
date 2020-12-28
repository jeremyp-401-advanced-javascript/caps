'use strict';

//////////////
// CAPS Hub //
//////////////

// Load in the modules
require('dotenv').config();
const uuid = require('uuid').v4;
const { logEvent } = require('./modules/logEvent');

// Get PORT from .env
const port = process.env.PORT || 3000;
const io = require('socket.io')(port);
io.on('connection', (socket) => {
  console.log('Welcome to the HUB', socket.id);
});

const queue = {
  orders: {},
};

// CAPS namespace
const caps = io.of('/caps');
caps.on('connection', (socket) => {
  console.log(`Welcome to the CAPS namespace, ${socket.id}`);

  socket.on('join', (room) => {
    // Log that the room was joined
    console.log(`${socket.id} is joining ${room}`);
    socket.join(room);
  });
  // Let everyone in the room know that a 'pickup' happened
  socket.on('pickup', (payload) => {
    logEvent('pickup', payload);
    caps.emit('pickup', payload);
  });
  // Let everyone in the room know that a 'in-transit' happened
  socket.on('in-transit', (payload) => {
    logEvent('in-transit', payload);
    // Sends the 'in-transit' to the store specified in the payload
    caps.to(payload.orderStore).emit('in-transit', payload);
  });
  // Let everyone in the room know that 'delivered' happened
  socket.on('delivered', (payload) => {
    logEvent('delivered', payload);
    // Sends the 'in-transit' to the store specified in the payload
    caps.to(payload.orderStore).emit('delivered', payload);
  });

  // NEW QUEUE STUFF

  // When 'new order' is heard
  socket.on('new order', (payload) => {
    console.log(`CAPS hub heard 'new order', ${socket.id}`);
    const id = new uuid();
    queue.orders[id] = payload;
    socket.emit('added');
    // Sends the 'orders' out with the id and payload as an object
    caps.emit('orders', {id, payload});
  });
  socket.on('getall', () => {
    console.log(`CAPS hub heard 'getall'`);
    // Loop through all of the keys in the queue orders
    Object.keys(queue.orders).forEach(id => {
      socket.emit('orders', {id, payload: queue.orders[id]});
    });
  });
  // Let everyone in the room know that 'recieved' happened
  socket.on('recieved', (message) => {
    console.log(`CAPS hub heard 'recieved', ${message}`);
    delete queue.orders[message.id]; // Remove orders where the message id matches
  });
  // When an order has been delivered
  socket.on('delivered', (payload) => {
    const id = new uuid();
    console.log('Order has been delivered!', payload);
    socket.emit('delivered', {id, payload: queue.orders[id]});
  });
});
