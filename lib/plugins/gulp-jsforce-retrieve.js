'use strict';
const gutil = require('gulp-util');
const through = require('through2');
const meta = require('jsforce-metadata-tools');
const decompress = require('decompress');

const PLUGIN_NAME = 'gulp-jsforce-retrieve';

let extractZipContents = (zipFileContent, dirMapping, logger, verbose) => {
  logger.log('');
  const zipBuffer = Buffer.from(zipFileContent, 'base64');
  return decompress(zipBuffer, dirMapping);
}

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
    meta.retrieveByPackageXML(options.src + '/package.xml', options)
    .then(res => {
      meta.reportRetrieveResult(res, gutil, options.verbose);
      if (!res.success) {
        return callback(new gutil.PluginError(PLUGIN_NAME, 'Retrieve failed'),file);
      }
      extractZipContents(res.zipFile, options.src, gutil, options.verbose)
      delete res.zipFile;
      file.contents = new Buffer.from(JSON.stringify(res));
      callback(null, file);
    })
    .catch(err => {
      gutil.log(PLUGIN_NAME,err.message)
      callback(err);
    });
  });
};