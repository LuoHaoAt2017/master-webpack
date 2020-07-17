const getDevServers = require('./get-dev-servers');
const getVersionHash = require('./get-version-hash');
const getVersionGitSha = require('./get-version-gitsha');
const syncConfig = require('./sync-config');
const noExistsFileCreate = require('./no-exists-file-create');
const removeMultipleStrLeadingSpace = require('./remove-multiple-str-leading-space');
const getNowDateString = require('./get-now-date-string');
const getSentryCliConfig = require('./get-sentry-cli-config');

const externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  jquery: 'jQuery',
  axios: 'axios',
  'dingtalk-jsapi': 'dd',
  '@sentry/browser': 'Sentry',
  '@sentry/intergrations': 'Sentry.Intergrations',
};

module.exports = {
  getDevServers,
  getVersionHash,
  getVersionGitSha,
  getNowDateString,
  getSentryCliConfig,
  syncConfig,
  noExistsFileCreate,
  removeMultipleStrLeadingSpace,
  externals,
};
