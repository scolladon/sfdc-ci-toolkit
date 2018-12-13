const envalid = require('envalid');
const { str, url, bool, num } = envalid;

const env = envalid.cleanEnv(process.env, {
  SF_VERSION:         str(),
  SF_SERVERURL:       url(),
  SF_TESTLEVEL:       str(),
  SF_TESTSUFFIX:      str(),
  SF_SRC_PATH:        str(),
  SF_REPO_PATH:       str(),
  POST_SCRIPT_PATH:   str(),
  PRE_SCRIPT_PATH:    str()
}, {
  dotEnvPath: process.env.SF_CONF_PATH !== '' ? process.env.SF_CONF_PATH : '.env'
})

module.exports = {
  'username': env.SF_USERNAME,
  'password': env.SF_PASSWORD,
  'consumerKey': env.SF_CONSUMERKEY,
  'privateKeyPath': env.PRIVATE_KEY_PATH,
  'loginUrl': env.SF_SERVERURL,
  'pollTimeout': env.SF_POLLTIMEOUT || 5000*1000,
  'pollInterval': env.SF_POLLINTERVAL || 10*1000,
  'version': env.SF_VERSION,
  'checkOnly' : env.SF_CHECKONLY === 'false' ? false : true,
  'testLevel' : ((env.SF_TESTLEVEL === 'RunSpecifiedTests' && env.SF_RUNTESTS !== '') || env.SF_TESTLEVEL !== 'RunSpecifiedTests') ? env.SF_TESTLEVEL : 'RunLocalTests',
  'runTests' : (env.SF_TESTLEVEL === 'RunSpecifiedTests' && env.SF_RUNTESTS !== '') ? env.SF_RUNTESTS.split(',') : undefined,
  'singlePackage' : env.SF_SINGLEPACKAGE || true,
  'rollbackOnError' : env.SF_ROLLBACKONERROR || true,
  'ignoreWarnings' : env.SF_IGNOREWARNINGS || true,
  'allowMissingFiles' : env.SF_ALLOWMISSINGFILES || true,
  'projectName' : env.SF_PROJECT,
  'allCustomObjects' : env.SF_CUSTOMOBJECTS || true,
  'verbose' : env.SF_VERBOSE || true,
  'src' : env.SF_SRC_PATH,
  'insert' : env.INSERT_LOAD,
  'upsert' : env.UPSERT_LOAD,
  'update' : env.UPDATE_LOAD,
  'delete' : env.DELETE_LOAD,
  'repo' : env.SF_REPO_PATH,
  'commit': env.COMMIT,
  'repoToken': env.CODECLIMATE_REPO_TOKEN,
  'branch': env.BRANCH,
  'postScript' : env.POST_SCRIPT_PATH,
  'preScript' : env.PRE_SCRIPT_PATH,
  'testSuffix' : env.SF_TESTSUFFIX,
  'currentBranch': env.CURRENT_BRANCH,
  'compareBranch': env.COMPARE_BRANCH || 'HEAD'
};
