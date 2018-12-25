const log = require('fancy-log');

module.exports = (gulp, plugins,options) => {
  return cb => {
    log.info('Options: ' + JSON.stringify(options, undefined, 2));
    cb();
  };
};
