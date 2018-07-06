'use strict';
const gutil = require('gulp-util');
const through = require('through2');
const meta = require('jsforce-metadata-tools');

const PLUGIN_NAME = 'gulp-jsforce-deploy';

module.exports = options => {
  return through.obj((file, enc, callback) => {
    let err;
    if (file.isNull()) {
      return callback(null, file);
    }
    if (file.isStream()) {
      return callback(new gutil.PluginError(PLUGIN_NAME, 'Stream input is not supported'));
    }
    options.logger = gutil;
    meta.deployFromZipStream(file.contents, options)
    .then(res => {
      meta.reportDeployResult(res, gutil, options.verbose);
      if (!res.success) {
        return callback(new gutil.PluginError(PLUGIN_NAME, 'Deploy failed'),file);
      }
      file.contents = new Buffer.from(JSON.stringify(res));
      callback(null, file);
    })
    .catch(err => {
      gutil.log(PLUGIN_NAME,err.message)
      callback(err);
    });
  });
};