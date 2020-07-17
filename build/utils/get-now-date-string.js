const colors = require('colors/safe');
const removeMultipleStrLeadingSpace = require('./remove-multiple-str-leading-space');
function pad (v) {
  return v < 10 ? '0' + v : v;
}

/**
 * @param {boolean} - includeTimestamp,是否返回时间戳,不传则不返回
 * @return {string|object} - 当前的时间(YYYYMMDDhhmmss),若有时间戳则返回一个对象
 */
function getNowDateString (includeTimestamp = false) {
  const d = new Date();
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hour = pad(d.getHours());
  const min = pad(d.getMinutes());
  const sec = pad(d.getSeconds());
  const NowDateStr = `${year}-${month}-${day} ${hour}:${min}:${sec}`;
  const NowTimeStamp = d.getTime();
  const tplStr = `
    ${colors.yellow('正在获取时间中....')}
    ${colors.yellow(`此刻时间戳：${NowTimeStamp}`)}
    ${colors.yellow(`此刻时间为：${NowDateStr}`)}
    ${colors.green('继续执行构建-->')}
    `;
  console.log(colors.green(removeMultipleStrLeadingSpace(tplStr))); // eslint-disable-line
  if (includeTimestamp) {
    return {
      date: NowDateStr,
      timestamp: NowTimeStamp,
    };
  }
  return NowDateStr;
}

module.exports = getNowDateString;
