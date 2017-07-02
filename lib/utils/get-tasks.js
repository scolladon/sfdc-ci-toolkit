module.exports = (params) => {
  const [tasks,gulp,plugins,options,TASK_PATH] = params;
  return require(TASK_PATH + task)(gulp, plugins, options);
}