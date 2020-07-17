import formater from './format';

export function each(obj, fn) {
  for (const key of Object.getOwnPropertyNames(obj)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (fn.call(obj[key], key, obj[key]) === false) {
        break;
      }
    }
  }
}

export function trimZero(val) {
  let res = val;
  res = String(res);
  res = res ? parseFloat(res.replace(/^0+/g, '')) : '';
  res = res || 0;
  res += '';
  return res;
}

export function generateRange(start = 0, end) {
  const results = [];
  for (let i = start; i <= end; i += 1) {
    results.push(this.addZero(i));
  }
  return results;
}

export function isToday(val1, val2) {
  return val1.getFullYear() === val2.getFullYear() &&
  val1.getMonth() === val2.getMonth() &&
  val1.getDate() === val2.getDate();
}

export function addZero(val) {
  const res = String(val);
  return res.length < 2 ? `0${res}` : res;
}

export function isLeapYear(year) {
  return year % 100 !== 0 && year % 4 === 0 || year % 400 === 0;
}

export function getMaxDay(year, month) {
  const y = parseFloat(year);
  const m = parseFloat(month);
  if (m === 2) {
    return isLeapYear(y) ? 29 : 28;
  }
  return [4, 6, 9, 11].indexOf(m) >= 0 ? 30 : 31;
}

export function parseRow(tmpl, value) {
  return tmpl.replace(/\{value\}/g, value);
}

// parse Date String
export function parseDate(format, value) {
  const formatParts = format.split(/[^A-Za-z]+/);
  let valueParts = value.split(/\D+/);
  if (formatParts.length !== valueParts.length) {
    // if it is error date, use current date
    const date = formater(new Date(), format);
    valueParts = date.split(/\D+/);
  }

  const result = {};

  for (let i = 0; i < formatParts.length; i += 1) {
    if (formatParts[i]) {
      result[formatParts[i]] = valueParts[i];
    }
  }
  return result;
}

export function getElement(expr) {
  return (typeof expr === 'string') ? document.querySelector(expr) : expr;
}

export function toElement(html) {
  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = html;
  return tempContainer.firstElementChild;
}

export function removeElement(el) {
  if (el) {
    el.parentNode.removeChild(el);
  }
}
