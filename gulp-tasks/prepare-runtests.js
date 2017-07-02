const sst = require('sfdc-specified-test');
const fs = require('fs');
const gutilLogCurried = require('../lib/utils/gutil-log-currified');
const path = require('path');
const scriptName = path.basename(__filename);
const PLUGIN_NAME = 'gulp-sfdc-' + scriptName;

module.exports = (gulp, plugins,options) => {
  return cb => {
    if(options.testLevel !== 'RunSpecifiedTests') {
      return cb();
    }
    sst({
      'dir': options.src,
      'suffix': options.testSuffix
    },gutilLogCurried(PLUGIN_NAME))
    .then(runTests => {
      options.runTests = runTests.split(',');
      fs.writeFileSync(
        '.env',
        fs.readFileSync('.env','utf8').replace(/SF_RUNTESTS.*/g,'SF_RUNTESTS='+runTests)
      );
      return cb();
    });
  };
};

