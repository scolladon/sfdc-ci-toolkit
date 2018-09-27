const fs = require('fs');
const DEPLOY_RESULT_FILE = '/deployResult.json';
var gutil = require('gulp-util');
const PLUGIN_NAME = 'gulp-sfdc-read-coverage';

module.exports = (gulp, plugins,options) => {
  return cb => {
    if(options.testLevel === 'NoTestRun') {
      return cb();
    }
    let deployResult;
    try {
      deployResult = JSON.parse(fs.readFileSync(options.repo + DEPLOY_RESULT_FILE));
    } catch(e) {
      console.log(e);
      return cb(options.repo + DEPLOY_RESULT_FILE+ ' do not exist');
    }
    // Handle object instead of array for 1 element
    let totalLine = 0, lineNotCovered = 0, coverage = 0;
    if(deployResult.numberTestsTotal > 0) {
      if(Array.isArray(deployResult.details.runTestResult.codeCoverage)) {
        for(let j of deployResult.details.runTestResult.codeCoverage) {
          totalLine += +j.numLocations;
          lineNotCovered += +j.numLocationsNotCovered;
        }
      } else {
        totalLine += +deployResult.details.runTestResult.codeCoverage.numLocations;
        lineNotCovered += +deployResult.details.runTestResult.codeCoverage.numLocationsNotCovered;
      }
      let coverage = ((totalLine > 0 ? (totalLine - lineNotCovered) / totalLine : 0) * 100).toFixed(2);
      let att = [];
      let c = coverage < 75 ? gutil.colors.red : coverage < 90 ? gutil.colors.yellow : gutil.colors.green;
      gutil.log(PLUGIN_NAME,'Code coverage: ' + c(coverage + '%'));
      if(deployResult.details.runTestResult.codeCoverageWarnings){
        gutil.log(PLUGIN_NAME,gutil.colors.yellow('Warnings: ' + deployResult.details.runTestResult.codeCoverageWarnings.name + ': ' + deployResult.details.runTestResult.codeCoverageWarnings.message));
      }
      if(deployResult.details.runTestResult.failures){
        gutil.log(PLUGIN_NAME,gutil.colors.red('Failures: ' + deployResult.details.runTestResult.failures.name + '.' + deployResult.details.runTestResult.failures.methodName + ': ' + deployResult.details.runTestResult.failures.message));
      }
    }
    cb()
  }
};

