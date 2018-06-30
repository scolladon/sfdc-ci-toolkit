'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var meta = require('jsforce-metadata-tools');
var decompress = require('decompress');

/**
 * Rework of extractZipContents from jsforce-metadata-tools to have the possibility to extract to the src folder.
 **/
function extractZipContents(zipFileContent, dirMapping, logger) {
  var zipBuffer = Buffer.from(zipFileContent, 'base64');
  // returns a promise of file objects, see https://github.com/kevva/decompress#decompressinput-output-options
  return decompress(zipBuffer, dirMapping, {
    map: function (file) {
      var filePaths = file.path.split('/');
      var packageName = filePaths[0];
      var directory = dirMapping[packageName] || dirMapping['*'];
      if (directory) {
        filePaths[0] = directory;
      }
      file.path = filePaths.join('/');
      logger.log('Extracting: ', file.path);
      return file;
    }
  });
}

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
      meta.reportRetrieveResult(res, gutil, options.verbose);
      extractZipContents(res.zipFile, options.src, gutil, options.verbose);
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