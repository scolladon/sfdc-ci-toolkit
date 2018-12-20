'use strict';
const log = require('fancy-log')
      ,c = require('ansi-colors')
      ,PluginError = require('plugin-error')
      ,through = require('through2')
      ,authentDelegate = require('sfdc-authent-delegate')
      ,decompress = require('decompress')
      ,xml2js = require('xml2js');

const PLUGIN_NAME = 'gulp-jsforce-retrieve';

module.exports = options => {
  return through.obj((file, enc, callback) => {
    if (file.isNull()) {
      return callback(null, file);
    }
    if (file.isStream()) {
      return callback(new PluginError(PLUGIN_NAME, 'Stream input is not supported'));
    }
    authentDelegate.getSession(options)
    .then(sfConn => {
      return new Promise((resolve, reject) => {
        xml2js.parseString(file.contents, { explicitArray: false }, (err, dom) => {
          if (err) { reject(err); } else { resolve(dom); }
        });
      })
      .then(dom => {
        delete dom.Package.$;
        options.unpackaged = dom.Package;
        log(PLUGIN_NAME,'Retrieving from server...');
        sfConn.metadata.pollTimeout = options.pollTimeout || 60*1000; // timeout in 60 sec by default
        sfConn.metadata.pollInterval = options.pollInterval || 5*1000; // polling interval to 5 sec by default
        const req = {};
        "apiVersion,packageNames,singlePackage,specificFiles,unpackaged".split(',').forEach(prop => {
          if (typeof options[prop] !== 'undefined') { req[prop] = options[prop]; }
        });
        if (!req.apiVersion) {
          req.apiVersion = sfConn.version;
        }
        return sfConn.metadata.retrieve(req).complete({ details: true });
      })
    })
    .then(res => {
      log(PLUGIN_NAME,String(res.success) === 'true' ? 'Retrieve Succeeded.' : String(res.done) === 'true' ? 'Retrieve Failed.' : 'Retrieve Not Completed Yet.');
      if (res.errorMessage) {
        log(PLUGIN_NAME,res.errorStatusCode + ': ' + res.errorMessage);
      }
      log(PLUGIN_NAME,'');
      log(PLUGIN_NAME,'Id: ' + c.blue(res.id));
      log(PLUGIN_NAME,'Status: ' + res.status);
      log(PLUGIN_NAME,'Success: ' + res.success);
      log(PLUGIN_NAME,'Done: ' + res.done);
      if (options.verbose) {
        const fileProperties = !res.fileProperties? [] : Object.prototype.toString.apply(res.fileProperties) !== '[object Array]' ? [ res.fileProperties ] : res.fileProperties;
        if (fileProperties.length > 0) {
          log(PLUGIN_NAME,'Files:');
          fileProperties.forEach(f => log(PLUGIN_NAME,' - ' + f.fileName + (f.type ? ' ['+f.type+']' : '')));
        }
      }
      if (!res.success) {
        return callback(new PluginError(PLUGIN_NAME, 'Retrieve failed'));
      }
      decompress(Buffer.from(res.zipFile, 'base64'), options.src);
      delete res.zipFile;
      file.contents = new Buffer.from(JSON.stringify(res));
      return callback(null, file);
    })
    .catch(err => {
      log(PLUGIN_NAME,err.message)
      return callback(err);
    });
  });
};