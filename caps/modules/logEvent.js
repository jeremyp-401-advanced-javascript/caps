'use strict';

function logEvent(event, payload) {
  const timestamp = new Date().toString();
  console.log('EVENT', { event, timestamp, payload });
}

module.exports = { logEvent };
