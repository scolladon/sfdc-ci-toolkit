// TODO :
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

const lastParameters = [gulp,plugins,options],

[
  'deploy',
  'coverage',
  'pre-deploy-script',
  'post-deploy-script',
  'generate-package',
  'prepare-package',
  'profile-reconciliation',
  'profile-completion',
  'prepare-runtests'
].forEach(task => gulp.task(task, getTask([task,...lastParameters])))