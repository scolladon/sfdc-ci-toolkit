// TODO :
// 0 Retrieve plugin
// 1 CodeCoverage (coverall)
// 2 Rollback deployment plugin
// 3 spread plugin on there own file
// 4 version this project in a submodule in a subdir (handle relative path)
// 5 deployment split


const gulp = require('gulp');
const options = require('./lib/utils/options-builder');
const getTask = require('./lib/utils/get-tasks');
const plugins = require('gulp-load-plugins')({
  rename: {
    'gulp-jsforce-exec-anon': 'execAnon'
  }
});
const fs = require('fs');
const path = require('path');

const TASK_PATH = './gulp-tasks/'

fs.readdirSync(TASK_PATH).forEach(file => {
  const task = path.basename(file, path.extname(file));
  gulp.task(task, getTask([task,gulp,plugins,options]))
});

module.exports = gulp;