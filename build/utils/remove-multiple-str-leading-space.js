/**
 *
 * @param {string} strTemplate - ES6字符串模板多行
 * @param {boolean} onlyMatchSpace - 只匹配行前空格(中文空格和英文空格)
 * @returns {string} - 符合格式的字符串数据
 * @description - 返回去除行头空格的字符串
 */
function removeMultipleStrLeadingSpace (strTemplate, onlyMatchSpace = true) {
  if (!strTemplate) {
    return '';
  }
  if (onlyMatchSpace) {
    // eslint-disable-next-line no-irregular-whitespace
    return strTemplate.replace(/^[ 　]+/gm, '');
  }
  return strTemplate.replace(/^\s+/gm, '');
}

module.exports = removeMultipleStrLeadingSpace;
