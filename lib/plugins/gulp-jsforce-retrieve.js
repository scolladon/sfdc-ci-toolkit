'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var meta = require('jsforce-metadata-tools');

module.exports = function(options) {
  return through.obj(function(file, enc, callback) {
    var err;
    if (file.isNull()) {
      return callback(null, file);
    }
    if (file.isStream()) {
      err = new gutil.PluginError('gulp-jsforce-retrieve', 'Stream input is not supported');
      return callback(err);
    }
    options.logger = gutil;
    meta.retrieveByPackageXML(options.src + '/package.xml', options)
    .then(function(res) {
      meta.extractZipContents(res.zipFile, options.src, gutil, options.verbose);
      meta.reportRetrieveResult(res, gutil, options.verbose);
      file.contents = new Buffer(JSON.stringify(res));
      if (!res.success) {
        return callback(new Error('Deploy Failed.'),file);
      }
      callback(null, file);
    })
    .catch(function(err) {
      gutil.log('gulp-jsforce-retrieve',err.message)
      callback(err);
    });
  });
};