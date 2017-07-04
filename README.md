# sfdc-ci-toolkit
Scripts repository to CI Salesforce projects

## Getting Started

Works in Unix like system.
Windows is not tested.

### Installing

```
cd /your/sfdc/repo
npm install sfdc-ci-toolkit
```

It comes with handy npm scripts for CI :
```javascript
"scripts": {
  "full-build": "npm run deploy",
  "postfull-build": "nom run move-tag",
  "predeploy": "gulp pre-deploy-script",
  "deploy": "gulp deploy",
  "postdeploy": "gulp post-deploy-script",
  "partial-package": "gulp prepare-package",
  "move-tag": "./movetag.sh",
  "partial-build": "npm run partial-package",
  "postpartial-build": "npm run deploy",
  "coverage": "gulp coverage",
  "profile-completion": "gulp profile-completion",
  "profile-reconciliation": "gulp profile-reconciliation",
  "generate-package": "gulp generate-package"
}
```

Combined them smartly according to your need as a developer or as a release manager ;)

## Usage

### Tasks prepackaged
* **coverage** : Run it just after having deployed with the RunLocalTests. It will gather the coverage and translate it to lcov format into coverage.json file
* **deploy** : Run it to deploy your repo to Salesforce
* **generate-package** : Run it to generate your package.xml from your repository
* **pre-deploy-script** : Run it to run execute anonymous each script files contained into PRE_SCRIPT_PATH variable
* **post-deply-script** : Run it to run execute anonymous each script files contained into POST_SCRIPT_PATH variable
* **prepare-package** : Run it to generate package.xml and destructiveChanges.xml by diffing the HEAD commit and the commit sha into COMMIT variable
* **prepare-runtests** : Run it to generate SF_RUNTESTS based on the src/classes folder and the SF_TESTSUFFIX variable
* **profile-completion** : Run it to complete your non admin profiles & permission sets with the removed user permissions
* **profile-reconciliation** : Run it to check the consistency of your repo and the profiles & permission sets definition into it

### Configuration
copy the .env_sample file to a .env file in the root directory.
It contains the definition of each required parameters with aen example value.
Here is what each line is used for and where:

**SF_VERSION**
Used for: defining the Salesforce API version used
Type of value: float one decimal precision (ex: 39.0)
Used in:
* deploy
* generate-package
* post-deply-script
* pre-deploy-script
* post-deploy-script

**SF_USERNAME**
Used for: connecting to Salesforce
Type of value: string email format
Used in:
* deploy
* post-deply-script
* pre-deploy-script

**SF_PASSWORD**
Used for: connecting to Salesforce
Type of value: string
Used in:
* deploy
* post-deply-script
* pre-deploy-script

**SF_SERVERURL**
Used for: connecting to Salesforce
Type of value: string url format
Used in:
* deploy
* post-deply-script
* pre-deploy-script


**SF_TESTLEVEL**
Used for: defining the test strategy when deployinh
Type of value: string (NoTestRun | RunLocalTests | RunSpecifiedTests | RunAllTests)
Used in:
* deploy

**SF_RUNTESTS**
Used for: defining the test to run when SF_TESTLEVEL equals "RunSpecifiedTests"
Type of value: string apex test classes name
Used in:
* deploy
* prepare-runtests

**SF_CHECKONLY**
Used for: defining the deployment mode
Type of value: boolean
Used in:
* deploy
* prepare-runtests
* post-deply-script
* pre-deploy-script

**SF_TESTSUFFIX**
Used for: selecting the test classes to run with the specified test
Type of value: string
Used in:
* prepare-runtests

**SF_SRC_PATH**
Used for: defining the path to the src folder
Type of value: string absolute or relative path from this folder
Used in:
* deploy
* generate-package
* prepare-package
* prepare-runtests
* profile-completion
* profile-reconciliation

**SF_REPO_PATH**
Used for: defining the path to the repository folder (the folder which contains the .git and the src folders)
Type of value: string absolute or relative path from this folder
Used in:
* prepare-package
* post-deply-script
* pre-deploy-script

**POST_SCRIPT_PATH**
Used for: defining the path to the post script folder (the folder which contains the post scripts to execute anonymous)
Type of value: string relative path from SF_REPO_PATH folder
Used in:
* post-deply-script

**PRE_SCRIPT_PATH**
Used for: defining the path to the pre script folder (the folder which contains the pre scripts to execute anonymous)
Type of value: string relative path from SF_REPO_PATH folder
Used in:
* pre-deploy-script

Here is the list of optional parameters with their default value :
* BRANCH : git branch name (string) used in coverage prepare-package
* CODECLIMATE_REPO_TOKEN : code climate repo token (string) used in coverage
* COMMIT : git commit id (string) used in coverage prepare-package
* SF_ALLOWMISSINGFILES : (boolean) used in deploy. Default: true
* SF_IGNOREWARNINGS : (boolean) used in deploy. Default: true
* SF_POLLINTERVAL : (integer) milliseconds used in deploy. Default: 5000*1000
* SF_POLLTIMEOUT : (integer) seconds used in deploy. Default: 10*1000
* SF_ROLLBACKONERROR : (boolean) used in deploy. Default: true
* SF_SINGLEPACKAGE : (boolean) used in deploy. Default: true
* SF_VERBOSE : (boolean) used in deploy. Default: true

### How to add/modify Task

Just create a js file in the gulp-tasks folder following this canvas

```javascript
// Include whatever you need

module.exports = (gulp pluginsoptions) => {
  return cb => {
    gulp.src('a glob pattern')
    .pipe(plugins.yourPluginName()) 
    .pipe(gulp.dest('/a/dest/path'));
  };
};
```

## Built With

* [envalid](https://github.com/af/envalid) - Environment variable validation for Node.js.
* [gulp](https://github.com/gulpjs/gulp) - The streaming build system.
* [gulp-jsforce-exec-anon](https://github.com/scolladon/gulp-jsforce-exec-anon) - Execute anonymous using JSforce.
* [gulp-load-plugins](https://github.com/jackfranklin/gulp-load-plugins) - Automatically load in gulp plugins.
* [gulp-rename](https://github.com/hparra/gulp-rename) - Rename files easily.
* [gulp-util](https://github.com/gulpjs/gulp-util) - Utilities for gulp plugins.
* [gulp-zip](https://github.com/sindresorhus/gulp-zip) - ZIP compress files.
* [jsforce-metadata-tools](https://github.com/jsforce/jsforce-metadata-tools) - Tools for deploying/retrieving package files using Metadata API via JSforce.
* [sfdc-generate-codeclimate-coverage](https://github.com/scolladon/sfdc-generate-codeclimate-coverage) - Code coverage converter to lcov from deployment result.
* [sfdc-generate-package](https://github.com/scolladon/sfdc-generate-package) - generate package.xml from source.
* [sfdc-git-package](https://github.com/scolladon/sfdc-git-package) - Create Package.xml and destructiveChangesPre.xml from git diff between two commits.
* [sfdc-pps-completion](https://github.com/scolladon/sfdc-pps-completion) - Profile & Permission Set user permission completion.
* [sfdc-pps-reconciliation](https://github.com/scolladon/sfdc-pps-reconciliation) - Display inconsistency between sources and profile & permission set.
* [sfdc-specified-test](https://github.com/scolladon/sfdc-specified-test) - Salesforce specified test generation.

## Versioning

[SemVer](http://semver.org/) is used for versioning.

## Authors

* **Sebastien Colladon** - *Initial work* - [scolladon](https://github.com/scolladon)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
