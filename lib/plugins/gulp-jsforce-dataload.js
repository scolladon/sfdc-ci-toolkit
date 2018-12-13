'use strict';
const PluginError = require('plugin-error')
      ,log = require('fancy-log')
      ,through = require('through2')
      ,authentDelegate = require('sfdc-authent-delegate')
      ,argv = require('minimist')(process.argv.slice(2));

const PLUGIN_NAME = 'dataload'

module.exports = (options,mode) =>{
  return through.obj((file, enc, callback) => {
    let objecttype;
    try {
      objecttype = file.relative.match(/(.*)\.csv/)[1];
    } catch(er) {return callback(new PluginError(PLUGIN_NAME + ' ' + mode,'File name not parsable ' + er));}

    authentDelegate.getSession(options)
    .then(sfConn => {return new Promise((resolve,reject)=>{
      sfConn.bulk.load(objecttype, mode, argv, file, (error, rets) => {
        if (error) { return callback(new PluginError(PLUGIN_NAME + ' ' + mode,error)); }
        for (let res of rets) {
          if (res.success) {
            log(PLUGIN_NAME + ' ' + mode, res.id + ' loaded successfully')
          } else {
            log(PLUGIN_NAME + ' ' + mode, res.id + ' error occurred, message = ' + res.errors.join(', '))
          }
        }
      });
    })})
    .catch((err)=>{
      return cb(new PluginError(PLUGIN_NAME,err))
    })
    .then(()=> {return cb(null,file)});
  });
};