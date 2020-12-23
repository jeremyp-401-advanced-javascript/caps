'use strict';

// Load in the modules
const events = require('../events/events');
const driver = require('../modules/driver');

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

  it('verifies that didPickup() logs a pickup properly', () => {
    driver.didPickup(customerOrder);
    expect(consoleSpy)
      .toHaveBeenCalledWith('DRIVER: picked up 9b8a70b8-49a8-4657-ab44-be1f8201291c');
  });
  it('verifies that didDelivery() logs a delivery properly', () => {
    driver.didDelivery(customerOrder);
    expect(consoleSpy)
      .toHaveBeenCalledWith('DRIVER: delivered up 9b8a70b8-49a8-4657-ab44-be1f8201291c');
  });
});