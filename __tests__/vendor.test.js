'use strict';

// Load in the modules
const events = require('../events/events');
const vendor = require('../modules/vendor');

describe('Vendor Console Logs', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach( () => {
    consoleSpy.mockRestore();
  });

  it('verifies the "delivered" emit triggers the correct console log', () => {
    let customerOrder = vendor.createOrder();
    events.emit('delivered', customerOrder);
    expect(consoleSpy)
      .toHaveBeenCalledWith(`VENDOR: Thank you for delivering ${customerOrder.orderId}`);
  });
});