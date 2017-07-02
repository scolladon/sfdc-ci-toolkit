const TASK_PATH = '../../gulp-tasks/'

module.exports = (params) => {
  const [tasks,gulp,plugins,options] = params;
  return require(TASK_PATH + task)(gulp, plugins, options);
}