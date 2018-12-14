'use strict';

const router = require('./router');
const logger = require('./logger');

module.exports = config => router({
  fsRoot: config.fsRoot,
  rootName: config.rootName,
  readOnly: config.readOnly,
  filter: config.filter,
  transformer: config.transformer,
  logger: config.logger || logger
});
