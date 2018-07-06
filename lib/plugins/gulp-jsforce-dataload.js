'use strict';
const gutil = require('gulp-util');
const through = require('through2');
const jsforce = require('jsforce');
const path = require('path');

const PLUGIN_NAME = 'dataload';

module.exports = (options,mode) =>{
  return through.obj((file, enc, callback) => {
    const conn = new jsforce.Connection({
      loginUrl : options.loginUrl
    });

    let objecttype;
    try {
      objecttype = file.relative.match(/(.*)\.csv/)[1];
    } catch(er) {return callback(new gutil.PluginError(PLUGIN_NAME + ' ' + mode,'File name not parsable ' + er));}

    conn.login(options.username, options.password, (err, userInfo) => {
      if (err) { return callback(new gutil.PluginError(PLUGIN_NAME + ' ' + mode,err)); }
      conn.bulk.load(objecttype, mode, gutil.env, file, (error, rets) => {
        if (error) { return callback(new gutil.PluginError(PLUGIN_NAME + ' ' + mode,error)); }
        for (let res of rets) {
          if (res.success) {
            gutil.log(PLUGIN_NAME + ' ' + mode, res.id + ' loaded successfully')
          } else {
            gutil.log(PLUGIN_NAME + ' ' + mode, res.id + ' error occurred, message = ' + res.errors.join(', '))
          }
        }
      });
    });
  });
};