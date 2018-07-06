const forceDataload = require('../lib/plugins/gulp-jsforce-dataload');

module.exports = (gulp, plugins,options) => {
  return cb => {
    gulp.src(options.src+options.insert+'/**')
    .pipe(forceDataload(options,'insert'))
  };
};
