'use strict';

//////////////
// CAPS Hub //
//////////////

// Load in the modules
require('dotenv').config();
const { logEvent } = require('./modules/logEvent');

// Get PORT from .env
const port = process.env.PORT || 3000;
const io = require('socket.io')(port);
io.on('connection', (socket) => {
  console.log('Welcome to the HUB', socket.id);
});

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
});
