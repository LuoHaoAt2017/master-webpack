/* eslint-disable no-console */
const { execSync } = require('child_process');
const hash = require('object-hash');
const colors = require('colors/safe');

/**
 *
 * @param {*} value 生成 hashCode，截取前七位
 */
function generatorHashCode (useTimeStamp) {
  if (useTimeStamp) {
    const tempValue = typeof useTimeStamp === 'number' && String(useTimeStamp).length > 6
      ? useTimeStamp
      : `${new Date().getTime()}`;
    const gHashCode = '_' + hash(tempValue, {
      algorithm: 'md5',
      encoding: 'hex',
      respectType: false,
    });
    return gHashCode.slice(0, 9);
  }
  return '';
}

/**
 *
 * @param {string} version - package.json version
 * @param {boolean|number} useTimeStamp -  生成时间戳或者传入时间戳
 * @description 返回版本号拼接当前分支最新的commit sha(short)
 */
function getVersionGitSha (version = '', useTimeStamp) {
  try {
    let tempVersion = version.trim().replace(/[,;%]/g, '');
    tempVersion =
      tempVersion && tempVersion[0].toLowerCase() === 'v'
        ? tempVersion
        : `v${tempVersion}`;
    const versionUnderlineStr = version.indexOf('.')
      ? version.split('.').join('_')
      : tempVersion;
    const currentBranchNewCommitSha = execSync(
      'git rev-parse --short HEAD --verify',
    ).toString();
    const newHashCode = generatorHashCode(useTimeStamp);
    const generatorVersion = `v${versionUnderlineStr}__${currentBranchNewCommitSha.trim()}${newHashCode}`;
    console.log(colors.yellow('当前分支最新commit的sha1'));
    console.log(colors.green('---> ' + colors.cyan(currentBranchNewCommitSha.trim())));
    console.log(colors.yellow('当前生成的version的sha1'));
    console.log(colors.green('---> ' + colors.cyan(generatorVersion)));
    return generatorVersion;
  } catch (error) {
    console.log(
      colors.red('最新 Commit Git Sha 获取失败,赶紧找找问题去！\n' + error),
    );
  }
}

module.exports = getVersionGitSha;
