const gp = require('sfdc-generate-package');
const gutilLogCurried = require('../lib/utils/gutil-log-currified');
const path = require('path');
const scriptName = path.basename(__filename);
const PLUGIN_NAME = 'gulp-sfdc-' + scriptName;

module.exports = (gulp, plugins,options) => {
  return cb => {
    gp({
      'src':options.src,
      'apiVersion': options.version,
      'output':options.src
      },
      gutilLogCurried(PLUGIN_NAME)
    ).then(() => {
      return cb();
    });
  };
};

