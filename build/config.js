const path = require('path');
const process = require('process');
const devConfig = require('./dev.config');
const buildConfig = require('./build.config');
const stageConfig = require('./stage.config');
const version = require('../package.json').version;
const utils = require('./utils');
const env = process.env.NODE_ENV !== 'production' ? 'dev' : 'build';
const defaultConfig = {
  configVersion: '1.1.0',
  dev: devConfig,
  build: buildConfig,
  stage: stageConfig,
};

const triggerJenkinsBuild =
  process.env.H3_ENV === 'release' || process.env.H3_ENV === 'rc';

let resultConfig = defaultConfig;

if (!triggerJenkinsBuild) {
  // 本地配置json路径
  const localConfigPath = path.resolve(__dirname, '../env.local.json');
  // 判断配置文件是否存在,不存在则新建一个
  utils.noExistsFileCreate(localConfigPath, 'env.local.json', defaultConfig);
  const localConfig = require(localConfigPath);
  // 对比本地版本，随时更新本地配置的版本
  resultConfig = utils.syncConfig(defaultConfig, localConfig, {
    override_filepath: localConfigPath,
    override: true,
  });
}

const resultEnv = resultConfig[env];

// stage (测试) 环境build
if (process.env.H3_ENV === 'stage') {
  Object.assign(resultEnv, stageConfig);
}

// release（正式） 环境build
if (triggerJenkinsBuild) {
  // 获取hash值
  const h3packagercFilePath = path.resolve(
    __dirname,
    '..',
    'public/.h3packagerc',
  );
  const { timestamp, date } = utils.getNowDateString(true);
  const assetsGenCode = utils.getVersionGitSha(version, timestamp);
  const resourceUrl =
    process.env.H3_ENV === 'release'
      ? resultEnv.resourceUrl
      : resultEnv.resourceTestUrl;
  resultEnv.assetsPublicPath = resourceUrl + resultEnv.assetsPublicPath;
  resultEnv.assetsSubDirectory = assetsGenCode;

  // 生成.sentryclirc文件
  utils.noExistsFileCreate(
    path.resolve(__dirname, '../.sentryclirc'),
    '.sentryclirc',
    utils.getSentryCliConfig(process.env.H3_ENV),
    true,
  );

  // 生成.h3packagerc文件
  const outputContentTmp = `
    ENV=${process.env.H3_ENV}
    VERSION=${version}
    STAMP=${timestamp}
    HASH=${assetsGenCode}
    VERSION_SHA1=${assetsGenCode}
    JKS_BUILD_DATE=${date}
  `;
  utils.noExistsFileCreate(
    h3packagercFilePath,
    '.h3packagerc',
    utils.removeMultipleStrLeadingSpace(outputContentTmp),
    true,
  );
}

resultEnv.version = version;

module.exports = resultEnv;
