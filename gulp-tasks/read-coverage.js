const fs = require('fs');
const DEPLOY_RESULT_FILE = '/deployResult.json';
const log = require('fancy-log');
const c = require('ansi-colors');
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
      } else if(typeof deployResult.details.runTestResult.codeCoverage !== 'undefined' && typeof deployResult.details.runTestResult.codeCoverage !== null && typeof deployResult.details.runTestResult.codeCoverage.numLocations !== 'undefined' && deployResult.details.runTestResult.codeCoverage.numLocations !== null) {
        totalLine += +deployResult.details.runTestResult.codeCoverage.numLocations;
        lineNotCovered += +deployResult.details.runTestResult.codeCoverage.numLocationsNotCovered;
      } else {
        log(PLUGIN_NAME,'No Code Coverage data');
        return cb(null,'No Code Coverage data');
      }
      let coverage = ((totalLine > 0 ? (totalLine - lineNotCovered) / totalLine : 0) * 100).toFixed(2);
      let att = [];
      let color = coverage < 75 ? c.red : coverage < 90 ? c.yellow : c.green;
      log(PLUGIN_NAME,'Code coverage: ' + color(coverage + '%'));
      if(deployResult.details.runTestResult.codeCoverageWarnings){
        log(PLUGIN_NAME,c.yellow('Warnings: ' + deployResult.details.runTestResult.codeCoverageWarnings.name + ': ' + deployResult.details.runTestResult.codeCoverageWarnings.message));
      }
      if(deployResult.details.runTestResult.failures){
        log(PLUGIN_NAME,c.red('Failures: ' + deployResult.details.runTestResult.failures.name + '.' + deployResult.details.runTestResult.failures.methodName + ': ' + deployResult.details.runTestResult.failures.message));
      }
    }
    cb()
  }
};

