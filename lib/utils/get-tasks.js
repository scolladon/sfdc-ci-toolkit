const TASK_PATH = '../../gulp-tasks/';
module.exports = (params) => {
  const [task,gulp,plugins,options] = params;
  return require(TASK_PATH + task)(gulp, plugins, options);
}