module.exports = (gulp, plugins,options) => {
  return cb => {
    if(options.checkOnly === true) {
      return cb();
    }
    return gulp.src(options.repo + options.postScript + '/*')
      .pipe(plugins.execAnon(options));
  };
};

