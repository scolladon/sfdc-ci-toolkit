'use strict';
const log = require('fancy-log')
      ,c = require('ansi-colors')
      ,PluginError = require('plugin-error')
      ,through = require('through2')
      ,authentDelegate = require('sfdc-authent-delegate');

const PLUGIN_NAME = 'gulp-jsforce-deploy';

module.exports = options => {
  return through.obj((file, enc, callback) => {
    let err;
    if (file.isNull()) {
      return callback(null, file);
    }
    if (file.isStream()) {
      return callback(new PluginError(PLUGIN_NAME, 'Stream input is not supported'));
    }

    authentDelegate.getSession(options)
    .then(sfConn => {
      log(PLUGIN_NAME,'Deploying to server...');
      sfConn.metadata.pollTimeout = options.pollTimeout || 60*1000; // timeout in 60 sec by default
      sfConn.metadata.pollInterval = options.pollInterval || 5*1000; // polling interval to 5 sec by default
      const deployOpts = {};
      "allowMissingFiles,autoUpdatePackage,checkOnly,ignoreWarnings,performRetrieve,purgeOnDelete,rollbackOnError,runAllTests,runTests,singlePackage,testLevel".split(',').forEach(function(prop) {
        if (typeof options[prop] !== 'undefined') { deployOpts[prop] = options[prop]; }
      });
      return sfConn.metadata.deploy(file.contents, deployOpts).complete({ details: true });
    })
    .then(res => {
      log(PLUGIN_NAME,res.success ? c.green('Deploy Succeeded') + (res.status === 'SucceededPartial' ? c.yellow(' Partially') : '') + '.' : res.done ? c.red('Deploy Failed.') : 'Deploy Not Completed Yet.');
      if (res.errorMessage) {
        log(PLUGIN_NAME,res.errorStatusCode + ': ' + res.errorMessage);
      }
      log('');
      log(PLUGIN_NAME,'Id: ' + c.red.blue(res.id));
      log(PLUGIN_NAME,'Status: ' + res.status);
      log(PLUGIN_NAME,'Success: ' + res.success);
      log(PLUGIN_NAME,'Done: ' + res.done);
      log(PLUGIN_NAME,'Number Component Errors; ' + c.red(res.numberComponentErrors));
      log(PLUGIN_NAME,'Number Components Deployed: ' + c.green(res.numberComponentsDeployed));
      log(PLUGIN_NAME,'Number Components Total: ' + res.numberComponentsTotal);
      log(PLUGIN_NAME,'Number Test Errors; ' + c.red(res.numberTestErrors));
      log(PLUGIN_NAME,'Number Tests Completed: ' + c.green(res.numberTestsCompleted));
      log(PLUGIN_NAME,'Number Tests Total: ' + res.numberTestsTotal);
      reportDeployResultDetails(res.details, options.verbose);

      file.contents = new Buffer.from(JSON.stringify(res));
      if (!res.success) {
        return callback(new PluginError(PLUGIN_NAME, 'Deploy failed'),file);
      }
      callback(null, file);
    })
    .catch(err => {
      log(PLUGIN_NAME,err.message)
      callback(err);
    });
  });
};

const reportDeployResultDetails = (details, verbose) => {
  if (details) {
    log('');
    if (verbose) {
      const successes = asArray(details.componentSuccesses);
      if (successes.length > 0) {
        log(PLUGIN_NAME,'Successes:');
      }
      successes.forEach(function(s) {
        const flag =
          String(s.changed) === 'true' ? '(M)' :
          String(s.created) === 'true' ? '(A)' :
          String(s.deleted) === 'true' ? '(D)' :
          '(~)';
        log(PLUGIN_NAME,' - ' + c.green(flag) + ' ' + s.fileName + (s.componentType ? ' ['+s.componentType+']' : ''));
      });
    }
    const failures = asArray(details.componentFailures);
    if (failures) {
      if (failures.length > 0) {
        log(PLUGIN_NAME,'Failures:');
      }
      failures.forEach(function(f) {
        log(PLUGIN_NAME,
          ' - ' + c.red(f.problemType + ' on ' + f.fileName) +
            (typeof f.lineNumber !== 'undefined' ?
             ' (' + f.lineNumber + ':' + f.columnNumber + ')' :
             '') +
          ' : ' + f.problem
        );
      });
    }
    const testResult = details.runTestResult;
    if (testResult && Number(testResult.numTestsRun) > 0) {
      log('');
      log(PLUGIN_NAME,'Test Total Time: ' + Number(testResult.totalTime));
      log('');
      if (verbose) {
        const testSuccesses = asArray(testResult.successes) || [];
        if (testSuccesses.length > 0) {
          log(PLUGIN_NAME,'Test Successes:');
        }
        testSuccesses.forEach(function(s) {
          log(PLUGIN_NAME,' - ' + c.green((typeof s.namespace === 'string' ? s.namespace + '__' : '') + s.name + '.' + s.methodName));
        });
      }
      const testFailures = asArray(testResult.failures) || [];
      if (testFailures.length > 0) {
        log(PLUGIN_NAME,'Test Failures:');
      }
      testFailures.forEach(function(f) {
        log(PLUGIN_NAME,' - ' + c.red((typeof f.namespace === 'string' ? f.namespace + '__' : '') + f.name + '.' + f.methodName));
        log(PLUGIN_NAME,'     ' + c.red(f.message));
        if (f.stackTrace) {
          f.stackTrace.split(/\n/).forEach(function(line) {
            log(PLUGIN_NAME,c.red('        at ' + line));
          });
        }
      });
      if (verbose) {
        let codeCoverages = asArray(testResult.codeCoverage) || [];
        if (codeCoverages.length > 0) {
          log(PLUGIN_NAME,'Code Coverage:');
        }
        codeCoverages.forEach(function(s) {
          let coverage = Math.floor(100 - 100 * (s.numLocationsNotCovered / s.numLocations));
          if (isNaN(coverage)) { coverage = 100; }
          let color = coverage < 75 ? c.red : coverage < 90 ? c.yellow : c.green;
          log(PLUGIN_NAME,
            ' - ' +
              '[' +
                color((coverage < 10 ? '  ' : coverage < 100 ? ' ' : '') + coverage +
              ' %')+'] ' +
              (typeof s.namespace === 'string' ? s.namespace + '__' : '') + s.name
          );
        });
      }
    }
  }
}

const asArray = arr => {
  return !arr ? [] : Object.prototype.toString.apply(arr) !== '[object Array]' ? [arr] : arr ;
}