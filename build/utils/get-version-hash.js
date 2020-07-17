const hash = require('object-hash');
/**
 *
 * @param {object} info - package.json version 和时间戳
 * @description 返回版本号拼接时间戳md5算出来的hex
 */
function getVersionHash ({ version = '', timeStamp = '' }) {
  let tempVersion = version.trim().replace(/[,;%]/g, '');
  tempVersion =
    tempVersion && tempVersion[0].toLowerCase() === 'v'
      ? tempVersion
      : `v${tempVersion}`;
  const versionUnderlineStr = tempVersion.indexOf('.')
    ? tempVersion.split('.').join('_')
    : tempVersion;
  const needHashContent = `${versionUnderlineStr}${timeStamp}`;
  const buildAssetsHash = hash(needHashContent, {
    algorithm: 'md5',
    encoding: 'hex',
    respectType: false,
  });
  return `${versionUnderlineStr}_${buildAssetsHash.slice(0, 8)}`;
}

module.exports = getVersionHash;
