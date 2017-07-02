const gutil = require('gulp-util');

module.exports = pluginName => {
  return message => {
    gutil.log(pluginName,message);
  };
};