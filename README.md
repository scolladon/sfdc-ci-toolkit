# sfdc-ci-toolkit
CI Scripts for Salesforce projects

This repository purpose is to centralized Continuous Integration scripts dedicated to the Salesforce platform.
It allows you to build your app, sanitized your repository (profile and permission sets) and automate things for you.
It has been designed and built to be fast, modular and to run with just npm as dependencies.

You can make it run into a basic alpine-node docker image.
You can easily add a tasks to this script for your own needs.

Compatible and complementary to SalesforceDX


## Getting Started

Works in Unix like system.
Windows is not tested.

### Installing

```
$ cd /your/sfdc/repo
$ git clone https://github.com/scolladon/sfdc-ci-toolkit.git
# Or :
$ wget http://github.com/scolladon/sfdc-ci-toolkit/archive/master.zip
$ unzip master.zip

# Then :
$ npm install
```
then you can either remove .git folder or add it as a submodule of your sfdc repo

### Tasks prepackaged

SFDC-ci-toolkit comes with handy npm scripts for CI :
```javascript
"scripts": {
  "full-build": "npm run deploy",
  "postfull-build": "npm run move-tag",
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
  "generate-package": "gulp generate-package",
  "generate-data-dictionary": "gulp generate-data-dictionary",
  "display-coverage": "gulp read-coverage",
  "prepare-runtests": "gulp prepare-runtests",
  "retrieve": "gulp retrieve",
  "dataload-insert": "gulp dataload-insert (--concurrencyMode <Serial | Parallel>)",
  "dataload-update": "gulp dataload-update (--concurrencyMode <Serial | Parallel>)",
  "dataload-upsert": "gulp dataload-upsert --extIdField <myExtIdFieldName> (--concurrencyMode <Serial | Parallel>)",
  "dataload-delete": "gulp dataload-delete (--concurrencyMode <Serial | Parallel>)",
  "oneline-profile-and-ps": "gulp oneline-profile-and-ps",
  "env-info": "gulp env-info"
}
```
Combined them smartly according to your need as a developer or as a release manager ;)

Here is the list of scripts with their description available in the toolkit
* **checkout-package** : Run it to check the file in the target branch from your package.xml. ex : gulp checkout-package --branch master
* **coverage** : Run it just after having deployed with the RunLocalTests. It will gather the coverage and translate it to lcov format into coverage.json file
* **deploy** : Run it to deploy your repo to Salesforce
* **generate-package** : Run it to generate your package.xml from your repository
* **generate-data-dictionary** : Run it to generate your data dictionary from your Salesforce org
* **pre-deploy-script** : Run it to run execute anonymous each script files contained into PRE_SCRIPT_PATH variable
* **post-deploy-script** : Run it to run execute anonymous each script files contained into POST_SCRIPT_PATH variable
* **prepare-package** : Run it to generate package.xml and destructiveChanges.xml by diffing the HEAD commit and the commit sha into COMMIT variable
* **prepare-runtests** : Run it to generate SF_RUNTESTS based on the src/classes folder and the SF_TESTSUFFIX variable
* **profile-completion** : Run it to complete your non admin profiles & permission sets with the removed user permissions
* **profile-reconciliation** : Run it to check the consistency of your repo and the profiles & permission sets definition into it
* **display-coverage** : Run it after having deploy with test runned. It will display the code coverage
* **prepare-runtests** : Run it to prepare the test classes to run for your specified test deployment
* **retrieve** : Run it to retrieve package.xml from Salesforce to your repo
* **dataload-insert** : Run it to insert data from csv file
* **dataload-update** : Run it to update data from csv file
* **dataload-upsert** : Run it to upsert data from csv file
* **dataload-delete** : Run it to delete data from csv file
* **oneline-profile-and-ps** : Run it to one line profiles and permission sets
* **remove-user-permissions** : Run it to remove userPermissions in profiles and permission sets
* **env-info** : Run it to check the current environment config used (if you have multiple .env files)

## Usage Example
Let's imagine you finalized the three first steps of [building a Conference Management app](https://trailhead.salesforce.com/en/projects/salesforce_developer_workshop/steps/creating_apex_class) in your sandbox and you want to deploy it to your dev org!
First add the toolbox into your repo

```
$ cd /your/repo/path
$ wget http://github.com/scolladon/sfdc-ci-toolkit/archive/master.zip
$ unzip master.zip -d sfdc-ci-toolkit
```

add sfdc-ci-toolkit to your gitignore and configure the toolbox (cf Configuration)
Then you go to your repository and fetch the objects, the applications, the tabs, the classes and the profiles (field, tab and class access) metadata definition using your favorite ide
Then you stage and commit your changes to the repo
```
$ git add src/objects/*
$ git add src/applications/*
$ git add src/tabss/*
$ git add src/classes/EmailManager*
$ git add src/profiles/*
$ git commit -m 'Conference Management app thirs step cleared :rocket:'
```

then you will probably complete your profile so your run the profile-completion task :
```
$ npm run profile-completion # Or if you have gulp globally installed: $ gulp profile-completion
```

then you will probably check for inconsistency between your profile and the repository so your run the profile-reconciliation task :
```
$ npm run profile-reconciliation # Or if you have gulp globally installed: $ gulp profile-reconciliation
```

Then make your changes and staged everything into your repo
```
$ git add .
$ git commit -m 'profile alignment'
```

Then you want to generate your package.xml.
Two way !
* **Full** :
```
$ npm run generate-package # Or if you have gulp globally installed: $ gulp generate-package
$ git add src/package.xml
$ git commit -m 'package creation'
```

* **Incremental** : select the commit sha from which you want to compare and put it into a COMMIT variable into the .env file (you can use the CURRENT_BRANCH and COMPARE_BRANCH)
```
$ npm run partial-package # Or if you have gulp globally installed: $ gulp prepare-package
$ git add src/package.xml src/destructive*
$ git commit -m 'package creation'
```

Then you want to prepare the test to execute to allow you to have a lightning fast deployment using Specified Test.
edit the SF_TESTSUFFIX variable int the .env file with your test suffix
```
$ npm run prepare-runtests # Or if you have gulp globally installed: $ gulp prepare-runtests
```
Then edit the SF_TESTLEVEL variable int the .env file with the value 'RunSpecifiedTests'

Now you are ready to deploy !
Package your pre and post script into the folders configured into POST_SCRIPT_PATH and PRE_SCRIPT_PATH variables.
Execute your pre deploy scripts
```
$ npm run predeploy # Or if you have gulp globally installed: $ gulp pre-deploy-script
```

You are going to try the build before merging your dev. So, put the value 'true' into the SF_CHECKONLY variable into the .env file and :
```
$ gulp deploy
```

Execute your post deploy scripts
```
$ npm run postdeploy # Or if you have gulp globally installed: $ gulp post-deploy-script
```

If you want to fetch the coverage from the deployment (works better with a RunLocalTests) execute this command :
```
$ npm run coverage # Or if you have gulp globally installed: $ gulp coverage
```
you will get a the coverage to the lcov format in the file 'coverage.json' into the sfdc-ci-toolkit folder

You are ready to package your branch and merge it where you want (follow you development process) !
After having merged the dev, you are ready to deploy. Change the SF_CHECKONLY to false.
You can launch a prepackaged script to automate those operations :
* gulp gulp pre-deploy-script
* gulp deploy
* gulp gulp post-deploy-script
by executing :
```
$ npm run deploy
```

## Configuration
copy the .env_sample file to a .env file in the root directory.
It contains the definition of each required parameters with aen example value.
Here is what each line is used for and where:

You can optionnaly have multiple conf files.
In that case, initialize the SF_CONF_PATH env. variable with the path of the file you want to use.

**SF_VERSION**
Used for: defining the Salesforce API version used
Type of value: float one decimal precision (ex: 39.0)
Used in:
* deploy
* generate-package
* post-deploy-script
* pre-deploy-script
* post-deploy-script

**SF_USERNAME**
Used for: connecting to Salesforce
Type of value: string email format
Used in:
* deploy
* post-deploy-script
* pre-deploy-script

**SF_PASSWORD**
Used for: connecting to Salesforce
Type of value: string
Used in:
* deploy
* post-deploy-script
* pre-deploy-script

**SF_SERVERURL**
Used for: connecting to Salesforce
Type of value: string url format
Used in:
* deploy
* post-deploy-script
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
* post-deploy-script
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
* post-deploy-script
* pre-deploy-script

**POST_SCRIPT_PATH**
Used for: defining the path to the post script folder (the folder which contains the post scripts to execute anonymous)
Type of value: string relative path from SF_REPO_PATH folder
Used in:
* post-deploy-script

**PRE_SCRIPT_PATH**
Used for: defining the path to the pre script folder (the folder which contains the pre scripts to execute anonymous)
Type of value: string relative path from SF_REPO_PATH folder
Used in:
* pre-deploy-script

Here is the list of optional parameters with their default value :
* CURRENT_BRANCH : git branch name (string) of the current branch used in coverage prepare-package
* COMPARE_BRANCH : git branch name (string) of the compare branch used in coverage prepare-package
* CODECLIMATE_REPO_TOKEN : code climate repo token (string) used in coverage
* COMMIT : git commit id (string) used in coverage prepare-package
* SF_ALLOWMISSINGFILES : (boolean) used in deploy. Default: true
* SF_IGNOREWARNINGS : (boolean) used in deploy. Default: true
* SF_POLLINTERVAL : (integer) milliseconds used in deploy. Default: 5000*1000
* SF_POLLTIMEOUT : (integer) seconds used in deploy. Default: 10*1000
* SF_ROLLBACKONERROR : (boolean) used in deploy. Default: true
* SF_SINGLEPACKAGE : (boolean) used in deploy. Default: true
* SF_VERBOSE : (boolean) used in deploy. Default: true
* SF_PROJECT : project name (string) used in data dictionary filename prefix
* SF_CUSTOMOBJECTS : (boolean) used in data dictionary. Default: true

## How to add/modify Task

Just create a js file in the gulp-tasks folder following this canvas

```javascript
// Include whatever you need

module.exports = (gulp plugins, options) => {
  // use the options object (it contains all the paramters from .env file)
  return cb => {
    gulp.src('a glob pattern')
    .pipe(plugins.yourPluginName())
    .pipe(gulp.dest('/a/dest/path'));
  };
};
```

## Built With

* [ansi-colors](https://github.com/doowb/ansi-colors) - Easily add ANSI colors to your text and symbols in the terminal. Used by webpack, gulp, and many others!
* [decompress](https://github.com/kevva/decompress) - Extracting archives made easy
* [envalid](https://github.com/af/envalid) - Environment variable validation for Node.js.
* [fancy-log](https://github.com/gulpjs/fancy-log) - Log things, prefixed with a timestamp.
* [gulp](https://github.com/gulpjs/gulp) - The streaming build system.
* [gulp-jsforce-exec-anon](https://github.com/scolladon/gulp-jsforce-exec-anon) - Execute anonymous using JSforce.
* [gulp-load-plugins](https://github.com/jackfranklin/gulp-load-plugins) - Automatically load in gulp plugins.
* [gulp-rename](https://github.com/hparra/gulp-rename) - Rename files easily.
* [gulp-zip](https://github.com/sindresorhus/gulp-zip) - ZIP compress files.
* [minimist](https://github.com/substack/minimist) - parse argument options
* [sfdc-authent-delegate](https://github.com/scolladon/sfdc-authent-delegate) - Authentication delegate for Salesforce.
* [sfdc-generate-codeclimate-coverage](https://github.com/scolladon/sfdc-generate-codeclimate-coverage) - Code coverage converter to lcov from deployment result.
* [sfdc-generate-data-dictionary](https://github.com/gavignon/sfdc-generate-data-dictionary) - Generate data dictionary from a Salesforce Org.
* [sfdc-generate-package](https://github.com/scolladon/sfdc-generate-package) - generate package.xml from source.
* [sfdc-git-package](https://github.com/scolladon/sfdc-git-package) - Create Package.xml and destructiveChangesPre.xml from git diff between two commits.
* [sfdc-pps-completion](https://github.com/scolladon/sfdc-pps-completion) - Profile & Permission Set user permission completion.
* [sfdc-pps-reconciliation](https://github.com/scolladon/sfdc-pps-reconciliation) - Display inconsistency between sources and profile & permission set.
* [sfdc-specified-test](https://github.com/scolladon/sfdc-specified-test) - Salesforce specified test generation.
* [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) - XML to JavaScript object converter.

## Versioning

[SemVer](http://semver.org/) is used for versioning.

## Authors

* **Sebastien Colladon** - *Initial work* - [scolladon](https://github.com/scolladon)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
