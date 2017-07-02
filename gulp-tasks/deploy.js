const DEPLOY_RESULT_FILE = './deployResult.json';
const forceDeploy = require('../lib/plugins/gulp-jsforce-deploy');

module.exports = (gulp, plugins,options) => {
    return () => {
      gulp.src(options.src+'/**')
      .pipe(plugins.zip('pkg.zip'))
      .pipe(forceDeploy(options))
      .pipe(plugins.rename(DEPLOY_RESULT_FILE))
      .pipe(gulp.dest('.'));
    };
};