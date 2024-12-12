const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'Cursor test',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

