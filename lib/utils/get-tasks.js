module.exports = (params) => {
  const [task,gulp,plugins,options,TASK_PATH] = params;
  return require(TASK_PATH + task)(gulp, plugins, options);
}