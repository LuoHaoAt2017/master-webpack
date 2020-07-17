const removeMultipleStrLeadingSpace = require('./remove-multiple-str-leading-space');
/**
 *
 * @param {string} env - 环境变量,比如 rc/release
 * @return {string}
 * @description - 生成 sentry 可以识别的配置文件内容
 */
function getSentryCliConfig (env = 'rc') {
  const rc = `
    [defaults]
    url=https://sentry2.techoa.h3yun.net/
    org=sentry
    project=h3yun-mobile-test

    [auth]
    token=dc81d82e953f41a4aa4ef7b72cec44354bd5cd85348549f390e8f6aa83e57773
    `;
  const release = `
    [defaults]
    url=https://sentry2.techoa.h3yun.net/
    org=sentry
    project=h3yun-mobile

    [auth]
    token=dc81d82e953f41a4aa4ef7b72cec44354bd5cd85348549f390e8f6aa83e57773
    `;
  const envConfig = {
    rc,
    release,
  };
  return removeMultipleStrLeadingSpace(envConfig[env]);
}

module.exports = getSentryCliConfig;
