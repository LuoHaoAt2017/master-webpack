const compareVersions = require('compare-versions');

/**
 *
 * @param {string} currentVersion - 当前版本
 * @param {string} compareVersion - 比对版本
 * @description 传入 v开头会忽略 v比对,比如 v1.1.1-> 1.1.1
 * @return {boolean} - 当前版本大返回 true,反之为 false
 */
function compareSemverVersion (currentVersion, compareVersion) {
  if (!compareVersion) {
    return true;
  }
  return compareVersions.compare(currentVersion, compareVersion, '>');
}

module.exports = compareSemverVersion;
