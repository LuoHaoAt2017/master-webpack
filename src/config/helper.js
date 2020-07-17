/**
 * 日期格式化
 */
// zyq;
Date.prototype.Format = function Format(fmts) {
  let fmt = fmts;
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    'S+': this.getMilliseconds(),
  };
  if (/(y+)/.test(fmts)) {
    fmt = fmt.replace(RegExp.$1, (`${this.getFullYear()}`).substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length))); }
  }
  return fmt;
};

Date.prototype.AddDays = function AddDays(double) {
  if (Number.isNaN(Number(double))) { return this; }
  const result = new Date();
  let totalMilliSeconds = this.getTime();
  const addMilliSeconds = double * 1000 * 60 * 60 * 24;
  totalMilliSeconds += addMilliSeconds;
  result.setTime(totalMilliSeconds);
  return result;
};
Date.prototype.AddMonths = function AddMonths(double) {
  if (Number.isNaN(Number(double))) { return this; }
  const result = new Date();
  let totalMilliSeconds = this.getTime();
  const month = result.getMonth() + 1;
  const year = result.getFullYear();
  let days = this.GetMonthDays(year, month);
  days = 30;
  const addMilliSeconds = double * 1000 * 60 * 60 * 24 * days;
  totalMilliSeconds += addMilliSeconds;
  result.setTime(totalMilliSeconds);
  return result;
};

Date.prototype.IsLeap = function IsLeap(year) {
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    return true;
  }
  return false;
};

Date.prototype.GetMonthDays = function GetMonthDays(year, month) {
  let days = 30;
  switch (month) {
    case 1:
      days = 31;
      break;
    case 2:
      if (this.IsLeap(year)) {
        days = 29;
      } else {
        days = 28;
      }
      break;
    case 3:
      days = 31;
      break;
    case 4:
      days = 30;
      break;
    case 5:
      days = 31;
      break;
    case 6:
      days = 30;
      break;
    case 7:
      days = 31;
      break;
    case 8:
      days = 31;
      break;
    case 9:
      days = 30;
      break;
    case 10:
      days = 31;
      break;
    case 11:
      days = 30;
      break;
    case 12:
      days = 31;
      break;
    default:
      break;
  }
  return days;
};

String.prototype.trim = function trim() {
  return this.replace(/(^\s*)|(\s*$)/g, '');
};

Array.prototype.remove = function remove(obj) {
  for (let i = 0, len = this.length; i < len; i += 1) {
    let tmp = this[i];
    if (!Number.isNaN(Number(obj))) {
      tmp = i;
    }
    if (tmp === obj) {
      for (let j = i; j < this.length; j += 1) {
        this[j] = this[j + 1];
      }
      this.length = this.length - 1;
    }
  }
};
HTMLElement.prototype.getElementTop = function getElementTop() {
  let top = this.offsetTop;
  let cur = this.offsetParent;
  while (cur !== null) {
    top += cur.offsetTop;
    cur = cur.offsetParent;
  }
  return top;
};
