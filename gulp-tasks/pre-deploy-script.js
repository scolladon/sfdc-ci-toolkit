module.exports = (gulp, plugins,options) => {
  return cb => {
    if(options.checkOnly === true) {
      return cb();
    }
    return gulp.src(options.repo + options.preScript + '/*')
      .pipe(plugins.execAnon(options));
  };
};

