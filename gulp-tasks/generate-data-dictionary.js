const dd = require('sfdc-generate-data-dictionary');
const gutilLogCurried = require('../lib/utils/gutil-log-currified');
const path = require('path');
const scriptName = path.basename(__filename);
const PLUGIN_NAME = 'gulp-sfdc-' + scriptName;

module.exports = (gulp, plugins, options) => {
  return cb => {
    dd({
        'username': options.username,
        'password': options.password,
        'loginUrl': options.loginUrl,
        'projectName': options.projectName,
        'allCustomObjects': options.getAllCustomObjects,
        'cleanFolders': true,
        'output':options.src
      },
      gutilLogCurried(PLUGIN_NAME)
    ).then(() => {
      return cb();
    });
  };
};
