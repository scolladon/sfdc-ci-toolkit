'use strict';
const gutil = require('gulp-util')
      ,through = require('through2')
      ,authentDelegate = require('sfdc-authent-delegate')

const PLUGIN_NAME = 'dataload'

module.exports = (options,mode) =>{
  return through.obj((file, enc, callback) => {
    let objecttype;
    try {
      objecttype = file.relative.match(/(.*)\.csv/)[1];
    } catch(er) {return callback(new gutil.PluginError(PLUGIN_NAME + ' ' + mode,'File name not parsable ' + er));}

    authentDelegate.getSession(options)
    .then(sfConn => {return new Promise((resolve,reject)=>{
      sfConn.bulk.load(objecttype, mode, gutil.env, file, (error, rets) => {
        if (error) { return callback(new gutil.PluginError(PLUGIN_NAME + ' ' + mode,error)); }
        for (let res of rets) {
          if (res.success) {
            gutil.log(PLUGIN_NAME + ' ' + mode, res.id + ' loaded successfully')
          } else {
            gutil.log(PLUGIN_NAME + ' ' + mode, res.id + ' error occurred, message = ' + res.errors.join(', '))
          }
        }
      });
    })})
    .catch((err)=>{
      return cb(new gutil.PluginError(PLUGIN_NAME,err))
    })
    .then(()=> {return cb(null,file)});
  });
};