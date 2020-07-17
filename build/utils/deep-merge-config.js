const merge = require('lodash/merge');
/**
 *
 * @param {*} obj - 对象
 * @param {*} source - 对象
 * @description - 使用lodash 的深度合并并返回
 */
function deepMergeConfig (obj, source) {
  const mergeResult = merge(obj, source);
  if (mergeResult && typeof mergeResult === 'object') {
    return mergeResult;
  } else {
    return {};
  }
}

module.exports = deepMergeConfig;
