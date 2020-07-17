const deepMergeConfig = require('./deep-merge-config');
const compareSemverVersion = require('./compare-semver-version');
const colors = require('colors/safe');
const process = require('process');
const fs = require('fs');

function mergeConfig (defaultConfig, localConfig, options) {
  const log = console.log; // eslint-disable-line no-console
  const cacheDefaultConfigVersion = {
    configVersion: defaultConfig.configVersion,
  };
  const combindConfig = {
    ...deepMergeConfig(defaultConfig, localConfig),
    ...cacheDefaultConfigVersion,
  };
  try {
    if (options.override && options.override_filepath) {
      fs.writeFileSync(
        options.override_filepath,
        JSON.stringify(combindConfig, null, 4),
      );
      log(colors.green('配置文件合并成功,继续构建-->'));
    }
  } catch (error) {
    log(colors.red.underline('合并失败,进程结束'));
    process.exit(1);
  }
  if (combindConfig && typeof combindConfig === 'object') {
    return combindConfig;
  } else {
    return localConfig;
  }
}

function syncConfig (defaultConfig = {}, localConfig = {}, options = {}) {
  const log = console.log; // eslint-disable-line no-console
  // 对比本地版本，随时更新本地配置的版本

  if (!localConfig.configVersion) {
    return mergeConfig(defaultConfig, localConfig, options);
  }

  const hasNewVersion = compareSemverVersion(
    defaultConfig.configVersion,
    localConfig.configVersion,
  );
  if (hasNewVersion) {
    log(colors.blue('来自氚云的提示'));
    log(`
      默认配置版本：${colors.green.underline(defaultConfig.configVersion)}
      本地配置版本：${colors.yellow.underline(localConfig.configVersion)}
      提示：${colors.red(
        '当前项目本地配置版本落后于最新版本,将尝试自动合并最新配置',
      )}
    `);
    return mergeConfig(defaultConfig, localConfig, options);
  } else {
    return localConfig;
  }
}

module.exports = syncConfig;
