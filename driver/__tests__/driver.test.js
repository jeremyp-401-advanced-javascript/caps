'use strict';

// Load in the modules
const driver = require('../driver');

describe('Driver Console Logs', () => {
  let consoleSpy;
  let customerOrder;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    customerOrder = {
      orderStore: 'Completely Adequate Products Inc.',
      orderId: '9b8a70b8-49a8-4657-ab44-be1f8201291c',
      orderCustomer: 'Julia Balistreri',
      orderAddress: '420 Emory Shoal Apt. 681, Port Alberto, OR 03119'
    };
  });

  afterEach( () => {
    consoleSpy.mockRestore();
  });

  it('verifies that doPickup() logs a pickup properly', () => {
    driver.doPickup(customerOrder);
    expect(consoleSpy)
      .toHaveBeenCalledWith(`Picking up ${customerOrder.orderId}`);
  });
  it('verifies that doDelivery() logs a delivery properly', () => {
    driver.doDelivery(customerOrder);
    expect(consoleSpy)
      .toHaveBeenCalledWith(`Delivering up ${customerOrder.orderId}`);
  });
});