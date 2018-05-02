const DEPLOY_RESULT_FILE = './deployResult.json';
const forceDeploy = require('../lib/plugins/gulp-jsforce-deploy');

module.exports = (gulp, plugins,options) => {
  return cb => {
    let status = null;
    gulp.src(options.src+'/**')
    .pipe(plugins.zip('pkg.zip'))
    .pipe(forceDeploy(options).on('error', function(error) {
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
