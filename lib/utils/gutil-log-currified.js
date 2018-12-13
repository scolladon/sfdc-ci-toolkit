const log = require('fancy-log')

module.exports = pluginName => {
  return message => {
    log(pluginName,message);
  };
};