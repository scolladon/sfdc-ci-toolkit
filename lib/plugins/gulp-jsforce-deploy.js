'use strict';
const gutil = require('gulp-util');
const through = require('through2');
const meta = require('jsforce-metadata-tools');

module.exports = function(options) {
  return through.obj(function(file, enc, callback) {
    let err;
    if (file.isNull()) {
      return callback(null, file);
    }
    if (file.isStream()) {
      err = new gutil.PluginError('gulp-jsforce-deploy', 'Stream input is not supported');
      return callback(err);
    }
    options.logger = gutil;
    meta.deployFromZipStream(file.contents, options)
    .then(function(res) {
      meta.reportDeployResult(res, gutil, options.verbose);
      if (!res.success) {
        return callback(new Error('Deploy Failed.'),file);
      }
      file.contents = new Buffer.from(JSON.stringify(res));
      callback(null, file);
    })
    .catch(function(err) {
      gutil.log('gulp-jsforce-deploy',err.message)
      callback(err);
    });
  });
};