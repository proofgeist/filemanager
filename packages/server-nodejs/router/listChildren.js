'use strict';

const path = require('path');
const fs = require('fs-extra');
const getClientIp = require('../utils/get-client-ip');

const {
  UNKNOWN_RESOURCE_TYPE_ERROR,
  getResource,
  getSorter
} = require('./lib');

module.exports = ({
  config,
  req,
  res,
  handleError,
  path: userPath
}) => {
  let sorter;

  try {
    sorter = getSorter({
      caseSensitive: false,
      orderBy: req.query.orderBy,
      orderDirection: req.query.orderDirection
    });
  } catch (err) {
    return handleError(err);
  }

  const absPath = path.join(config.fsRoot, userPath);
  config.logger.info(`Children for ${absPath} requested by ${getClientIp(req)}`);

  return fs.readdir(absPath).
    then(basenames => Promise.all(
      basenames.
        map(
          basename => getResource({
            config,
            parent: userPath,
            basename
          }).
            catch(err => {
              if (typeof err === 'object' && err.message === UNKNOWN_RESOURCE_TYPE_ERROR) {
                return null;
              }

              throw err;
            })
        ).
        filter(resource => resource)
    ))
    .then(items => {
      if (options.filter) return items.filter(options.filter);
      return items;
    })
    .then(items => {
      if (options.transformer) return transformer(items);
      return items;
    }).
    then(resources => res.json({
      items: resources.sort(sorter)
    })).catch(handleError);
};
