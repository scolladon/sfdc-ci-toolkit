const through = require('through2')
      ,gutil = require('gulp-util')
      ,path = require('path')
      ,scriptName = path.basename(__filename)
      ,PLUGIN_NAME = scriptName.replace(/\.js$/,'');

module.exports = (gulp, plugins,options) => {
  return cb => {
    return gulp.src([
      options.src + '/profiles/*.profile',
      options.src + '/permissionsets/*.permissionset'
    ],{base: './'})
    .pipe(online())
    .pipe(gulp.dest('./'));
  };
};

const online = () => {
  return through.obj(function(file, enc, callback){
    if (file.isNull()) {
      return callback(null, file);
    }
    if (file.isStream()) {
      return callback(new gutil.PluginError(PLUGIN_NAME, 'Stream input is not supported'));
    }
    file.contents = Buffer.from(
      file.contents
      .toString('utf8')
      .replace(/\t/g,'    ')
      .replace(/\r/,'')
      .replace(/\n(    ){2,}/g,'')
      .replace(/\n    <\//g,'<\/')
      ,'utf8'
    )
    gutil.log(PLUGIN_NAME, path.basename(file.path) + ' successfuly onelined ', gutil.colors.green(':)'))
    return callback(null,file);
  });
}