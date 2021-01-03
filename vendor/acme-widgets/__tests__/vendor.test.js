'use strict';

// Load in the modules
require('dotenv').config();
// Get PORT from .env
const storeName = process.env.STORE_NAME;
const vendor = require('../vendor');

describe('Vendor Console Logs', () => {
  let consoleSpy;
  let mockOrder = {
    orderStore: 'Completely Adequate Products Inc.',
    orderId: '9b8a70b8-49a8-4657-ab44-be1f8201291c',
    orderCustomer: 'Julia Balistreri',
    orderAddress: '420 Emory Shoal Apt. 681, Port Alberto, OR 03119'
  };

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach( () => {
    consoleSpy.mockRestore();
  });

  it('creates a new order object', () => {
    let customerOrder = vendor.createOrder();
    console.log('CO:', customerOrder);
    expect(customerOrder.orderStore).toBe(storeName);
  });

  it('verifies that the vendor says thanks after an order is delivered', () => {
    vendor.sayThanks(mockOrder);
    expect(consoleSpy)
      .toHaveBeenCalledWith(`VENDOR: Thank you for delivering ${mockOrder.payload.orderId}`);
  });

  // `VENDOR: Thank you for delivering ${payload.orderId}`
});