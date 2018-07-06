const forceDataload = require('../lib/plugins/gulp-jsforce-dataload');

module.exports = (gulp,plugins,options) => {
  return cb => {
    gulp.src(options.src+options.update+'/*.csv')
    .pipe(forceDataload(options,'update'))
  };
};
