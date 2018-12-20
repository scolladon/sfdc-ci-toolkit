const sgc = require('sfdc-generate-codeclimate-coverage');
const through = require('through2');
const gutilLogCurried = require('../lib/utils/gutil-log-currified');
const path = require('path');
const scriptName = path.basename(__filename);
const PLUGIN_NAME = 'gulp-sfdc-' + scriptName;
const OUTPUT_COVERAGE = 'coverage.json';
const DEPLOY_RESULT_FILE = '/deployResult.json';

module.exports = (gulp, plugins,options) => {
  return cb => {
    if(options.testLevel === 'NoTestRun') {
      return cb();
    }
    return gulp.src(options.repo + DEPLOY_RESULT_FILE)
    .pipe(
      through.obj((file, enc, callback) => {
        sgc({
          'commit': options.commit,
          'repotoken': options.repoToken,
          'branch': options.branch,
          'repo': options.repo
          },
          JSON.parse(file.contents),
          gutilLogCurried(PLUGIN_NAME)
        ).then(coverage => {
          file.contents = new Buffer(JSON.stringify(coverage));
          callback(null,file);
        })
      })
    ).pipe(plugins.rename(OUTPUT_COVERAGE))
    .pipe(gulp.dest('.'))
  };
};

