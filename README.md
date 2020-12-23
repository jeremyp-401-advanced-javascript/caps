# LAB - Class 11

## Project: CAPS - Code Academy Parcel Service

### Author: Jeremy Penning

### Links and Resources

- [CI/CD](https://github.com/jeremyp-401-advanced-javascript/caps/actions) (GitHub Actions)

### Setup

#### `.env` requirements

- `STORE_NAME` - Name of the store using CAPS

#### How to initialize/run the application

To run application:

`npm start`

#### Tests

To run tests:

`npm test`

### Sample Output

```javascript
EVENT {
  event: 'pickup',
  timestamp: 'Wed Dec 23 2020 08:30:51 GMT-0800 (Pacific Standard Time)',
  payload: {
    orderStore: 'Completely Adequate Products Inc.',
    orderId: '2dc0e19c-6fc6-470b-9e4b-e2cd5f852035',
    orderCustomer: 'Ms. Elias Keeling',
    orderAddress: '6044 Laury Plain Suite 094, South Filiberto, IL 94754'
  }
}
DRIVER: picked up 2dc0e19c-6fc6-470b-9e4b-e2cd5f852035
EVENT {
  event: 'in-transit',
  timestamp: 'Wed Dec 23 2020 08:30:52 GMT-0800 (Pacific Standard Time)',
  payload: {
    orderStore: 'Completely Adequate Products Inc.',
    orderId: '2dc0e19c-6fc6-470b-9e4b-e2cd5f852035',
    orderCustomer: 'Ms. Elias Keeling',
    orderAddress: '6044 Laury Plain Suite 094, South Filiberto, IL 94754'
  }
}
DRIVER: delivered up 2dc0e19c-6fc6-470b-9e4b-e2cd5f852035
VENDOR: Thank you for delivering 2dc0e19c-6fc6-470b-9e4b-e2cd5f852035
EVENT {
  event: 'delivered',
  timestamp: 'Wed Dec 23 2020 08:30:54 GMT-0800 (Pacific Standard Time)',
  payload: {
    orderStore: 'Completely Adequate Products Inc.',
    orderId: '2dc0e19c-6fc6-470b-9e4b-e2cd5f852035',
    orderCustomer: 'Ms. Elias Keeling',
    orderAddress: '6044 Laury Plain Suite 094, South Filiberto, IL 94754'
  }
}

```

### Whiteboard / UML

![whiteboard-caps](./assets/CAPSWhiteboardUML_SS.png)