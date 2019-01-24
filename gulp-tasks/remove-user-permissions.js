const through = require('through2')
      ,PluginError = require('plugin-error')
      ,log = require('fancy-log')
      ,c = require('ansi-colors')
      ,path = require('path')
      ,scriptName = path.basename(__filename)
      ,PLUGIN_NAME = scriptName.replace(/\.js$/,'');

module.exports = (gulp, plugins,options) => {
  return cb => {
    return gulp.src([
      options.src + '/profiles/*.profile',
      options.src + '/permissionsets/*.permissionset'
    ],{base: './'})
    .pipe(removeUserPermissions())
    .pipe(gulp.dest('./'));
  };
};

const removeUserPermissions = () => {
  return through.obj(function(file, enc, callback){
    if (file.isNull()) {
      return callback(null, file);
    }
    if (file.isStream()) {
      return callback(new PluginError(PLUGIN_NAME, 'Stream input is not supported'));
    }
    file.contents = Buffer.from(
      file.contents
      .toString('utf8')
      .replace(/\s*<userPermissions>.*<\/userPermissions>/gs,'')
      ,'utf8'
    )
    log(PLUGIN_NAME, path.basename(file.path) + ' user permissions successfuly removed ', c.green(':)'))
    return callback(null,file);
  });
}