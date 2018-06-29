const DEPLOY_RESULT_FILE = './retrieveResult.json';
const retrieve = require('../lib/plugins/gulp-jsforce-retrieve');

module.exports = (gulp, plugins, options) => {
  return cb => {
    let status = null;
    // gulp.src(options.src+'/**')
    // .pipe(plugins.zip('pkg.zip'))
    .pipe(retrieve(options).on('error', function(error) {
      // we have an error
      status = error;
    }))
    .pipe(plugins.rename(DEPLOY_RESULT_FILE))
    .pipe(gulp.dest('.'));
    if(status) {
      cb(status);
    }
  };
};
