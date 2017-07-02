const sgp = require('sfdc-git-package');
const gutilLogCurried = require('../lib/utils/gutil-log-currified');
const path = require('path');
const scriptName = path.basename(__filename);
const PLUGIN_NAME = 'gulp-sfdc-' + scriptName;

module.exports = (gulp, plugins,options) => {
  return cb => {
    sgp({
      'to':'HEAD',
      'from': options.branch+process.env.LAST_BUILD_TAG_SUFFIX,
      'output':options.src,
      'apiVersion': options.version,
      'repo':options.repo
      },
      gutilLogCurried(PLUGIN_NAME)
    ).then(() => {
      return cb();
    });
  };
};

