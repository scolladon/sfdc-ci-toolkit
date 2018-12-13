module.exports = (gulp, plugins,options) => {
  return cb => {
    console.log('Options: ' + JSON.stringify(options));
    cb();
  };
};
