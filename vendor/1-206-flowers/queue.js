'use strict';

// Load in the modules
require('dotenv').config();
// Get PORT from .env
const port = process.env.PORT || 3000;
const host = process.env.HOST;
const io = require('socket.io-client');

class Queue {
  constructor(id) {
    this.id = id;
    this.socket = io.connect(`${host}:${port}/caps`);
  }
  trigger(event, payload) {
    this.socket.emit(event, {clientId: this.id, payload});
  }
}

module.exports = Queue;
