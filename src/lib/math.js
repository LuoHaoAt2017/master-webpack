import $ from 'jquery';
import { isiOS } from '../config/common';

// 用于计算规则的公式

const math = {
  isMobile() {
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
      return true;
    }
    return false;
  },
  // SUM(a,b,...),求和
  SUM(...args) {
    let sum = 0;
    for (let i = 0; i < args.length; i += 1) {
      if (args[i] !== '' && !Number.isNaN(Number(args[i]))) {
        sum += Number(args[i]);
      }
    }
    return Number(sum);
  },
  // MAX(a,b,c,...),求最大值
  MAX(...args) {
    let max = args[0];
    for (let i = 0; i < args.length; i += 1) {
      if (max < args[i]) {
        max = args[i];
      }
    }
    if ($.isNumeric(max)) {
      return Number(max);
    }
    return max;
  },
  // MIN(a,b,...),求最小值
  MIN(...args) {
    let min = args[0];
    for (let i = 0; i < args.length; i += 1) {
      if (min > args[i]) {
        min = args[i];
      }
    }
    return min;
  },
  // ABS(a),求绝对值
  ABS(...args) {
    let abs = 0;
    if (!Number.isNaN(Number(args[0]))) {
      abs = Math.abs(Number(args[0]));
    }
    return Number(abs);
  },
  // AVG(a,b,...),求平均值
  AVG(...args) {
    let length = 0;
    let sum = 0;
    for (let i = 0, len = args.length; i < len; i += 1) {
      if (!Number.isNaN(Number(args[i]))) {
        sum += Number(args[i]);
        length += 1;
      }
    }
    if (length === 0) {
      return 0;
    }
    return Number(sum / length);
  },
  // SIN(a)//参数是角度
  SIN(...args) {
    let sin = 0;
    const arg = args[0];
    const accuracy = 1E15;
    if (!Number.isNaN(Number(arg))) {
      sin = Math.round(Math.sin((Number(arg) * 2 * Math.PI) / 360) * accuracy) / accuracy;
    }
    return Number(sin);
  },
  // COS(a)//参数是角度
  COS(...args) {
    let cos = 0;
    const arg = args[0];
    const accuracy = 1E15;
    if (!Number.isNaN(Number(arg))) {
      cos = Math.round(Math.cos((Number(arg) * 2 * Math.PI) / 360) * accuracy) / accuracy;
    }
    return Number(cos);
  },
  // PI()
  PI() {
    return Number(Math.PI);
  },
  // ROUND(a,b) 四舍五入到制定位数
  ROUND(...args) {
    const target = args[0];
    const accuracy = args[1];

    if (Number.isNaN(Number(target)) || Number.isNaN(Number(accuracy))) {
      return 0;
    }
    return Math.round(Number(target) * Number(`1e${Number(accuracy)}`)) / Number(`1e${Number(accuracy)}`);
    // return Number(Number(target).toFixed(Number(accuracy)));
  },
  // SQRT(a)
  SQRT(...args) {
    const inputVal = args[0];
    if (!Number.isNaN(Number(inputVal))) {
      const numVal = Number(inputVal);
      if (numVal > 0) {
        return Math.sqrt(numVal);
      }
    }
    return '';
  },
  // NOW(),当前时间
  NOW() {
    // if (this.isMobile()) {
    //     return new Date().Format('yyyy/MM/dd hh:mm:ss');
    // } else {
    return new Date().Format('yyyy-MM-dd hh:mm:ss');
    // }
  },
  // YEAR(date),返回日期年份()
  YEAR(...args) {
    let year = 1900;
    if (args.length < 1) {
      return year;
    }
    let date = args[0];
    if (!date) {
      return -1;
    }
    // Error要处理data格式
    date = date.toString().replace(/-/g, '/').replace(/T/g, ' ');
    if (isiOS) {
      if (date.length === 7) {
        date += '/01';
      }
    }
    const d = new Date(date);
    year = d.getFullYear();
    return Number(year);
  },
  // YEARS(endDate,startDate)返回两个日期之间年份差
  YEARS(...args) {
    let end = args[0];
    let start = args[1];
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const year = day * 365;
    if (!end || !start) {
      return 0;
    }
    end = end.toString().replace(/-/g, '/').replace(/T/g, ' ');
    start = start.toString().replace(/-/g, '/').replace(/T/g, ' ');
    if (isiOS) {
      if (end.length === 7) {
        end += '/01';
      }
      if (start.length === 7) {
        start += '/01';
      }
    }
    const dateEnd = new Date(end);
    const dateStart = new Date(start);
    const diff = dateEnd - dateStart;
    // if (Number.isNaN(diff)) return NaN;
    if (Number.isNaN(Number(diff))) return 0;
    return Number((diff / year).toFixed(2));
  },
  // QUARTER(date),返回日期季度
  QUARTER(...args) {
    const quarter = 1;
    if (args.length < 1) {
      return quarter;
    }
    let date = args[0];
    if (!date) {
      return -1;
    }
    date = date.toString().replace(/-/g, '/').replace(/T/g, ' ');
    const d = new Date(date);
    // quarter = parseInt((d.getMonth() + 2) / 4) + 1;
    const curMonth = d.getMonth() + 1;
    if (curMonth >= 1 && curMonth <= 3) {
      return 1;
    } else if (curMonth > 3 && curMonth <= 6) {
      return 2;
    } else if (curMonth > 6 && curMonth <= 9) {
      return 3;
    } else if (curMonth > 9 && curMonth <= 12) {
      return 4;
    }
    return null;

    // return Number(quarter);
  },
  // MONTH(date),返回日期月份
  MONTH(...args) {
    let month = 1;
    if (args.length < 1) {
      return month;
    }
    let date = args[0];
    if (!date) {
      return -1;
    }
    date = date.toString().replace(/-/g, '/').replace(/T/g, ' ');
    if (isiOS) {
      if (date.length === 7) {
        date += '/01';
      }
    }
    // 兼容ios,ios在12-31之间会返回1
    if (date < 32 && date > 12) {
      month = NaN;
    } else {
      const d = new Date(date);
      month = d.getMonth() + 1;
    }
    return Number(month);
  },
  // DAY(date),返回日期天
  DAY(...args) {
    let day = 1;
    if (arguments.length < 1) {
      return day;
    }
    let date = args[0];
    if (!date) {
      return -1;
    }
    date = date.toString().replace(/-/g, '/').replace(/T/g, ' ');
    const d = new Date(date);
    day = d.getDate();
    return Number(day);
  },
  // HOUR(time),返回时间中小时部分
  HOUR(...args) {
    let hour = 0;
    if (args.length < 1) {
      return hour;
    }
    let date = args[0];
    if (!date) {
      return -1;
    }
    date = date.toString().replace(/-/g, '/').replace(/T/g, ' ');
    if (date.trim().length <= 5 && date.indexOf(':') > 0) {
      return Number(date.trim().split(':')[0]);
    }
    const d = new Date(date);
    hour = d.getHours();
    return Number(hour);
  },
  // MINUTE(time),返回时间中分钟部分
  MINUTE(...args) {
    let minute = 0;
    if (args.length < 1) {
      return minute;
    }
    let date = args[0];
    if (!date) {
      return -1;
    }
    date = date.toString().replace(/-/g, '/').replace(/T/g, ' ');
    if (date.trim().length <= 5 && date.indexOf(':') > 0) {
      return Number(date.trim().split(':')[1]);
    }
    const d = new Date(date);
    minute = d.getMinutes();
    return Number(minute);
  },
  // SECOND(time),返回时间中秒部分
  SECOND(...args) {
    let second = 0;
    if (args.length < 1) {
      return second;
    }
    let date = args[0];
    if (!date) {
      return -1;
    }
    date = date.toString().replace(/-/g, '/').replace(/T/g, ' ');
    const d = new Date(date);
    second = d.getSeconds();
    return Number(second);
  },
  // TODAY(),返回当前日期
  TODAY() {
    // let newDate = new Date();
    // if (this.isMobile()) {
    //     return new Date().Format('yyyy/MM/dd');
    // } else {
    return new Date().Format('yyyy-MM-dd');
    // }
  },
  // WEEKDAY(date),返回指定日期为星期几
  WEEKDAY(...args) {
    let weekday = 0;
    if (args[0].length === 0) {
      return weekday;
    }
    let date = args[0];
    if (!date) {
      return -1;
    }
    date = date.toString().replace(/-/g, '/').replace(/T/g, ' ');
    date = new Date(date);
    weekday = date.getDay();
    return weekday;
  },
  // WEEKNUM(date),返回指定日期是一年中第几周
  WEEKNUM(...args) {
    let weeknum = 0;
    if (args[0].length === 0) {
      return weeknum;
    }
    let date = args[0];
    if (!date) {
      return -1;
    }
    date = date.toString().replace(/-/g, '/').replace(/T/g, ' ');
    date = new Date(date);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const today = new Date(year, month, day);
    const firstDayOfYear = new Date(year, 0, 1);
    const days = (today.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);

    const firstWeekDay = firstDayOfYear.getDay(); // 第一天星期几
    weeknum = Math.ceil(Number(days - (6 - firstWeekDay)) / 7);
    return weeknum + 1;
  },
  // DATE(year,month,day,[hour,minute,second]),将年月日时分秒转成日期对象
  DATE(...args) {
    let date = null;
    if (args.length !== 3 && args.length !== 6) {
      return date;
    }
    const y = args[0];
    if (!y) {
      return null;
    }
    const m = args[1] ? args[1] : 0;
    const d = args[2] ? args[2] : 0;
    const h = args[3] ? args[3] : 0;
    const mm = args[4] ? args[4] : 0;
    const s = args[5] ? args[5] : 0;
    date = new Date(y, m - 1, d, h, mm, s);
    // 移动端也返回横杠格式的，保持计算一致
    // if (this.isMobile()) {
    //   if (arguments.length === 3) {
    //     return date.Format('yyyy/MM/dd');
    //   } else if (arguments.length === 6) {
    //     return date.Format('yyyy/MM/dd hh:mm:ss');
    //   }
    // } else 
    if (arguments.length === 3) {
      return date.Format('yyyy-MM-dd');
    } else if (arguments.length === 6) {
      return date.Format('yyyy-MM-dd hh:mm:ss');
    }
    return null;
  },
  // 转换日期格式为yyyy-mm-dd hh:m:ss
  CONVERTTIME(times) {
    let time = times;
    time = time.toString().replace(/-/g, '/');
    if (this.isMobile()) {
      return new Date(time).Format('yyyy/MM/dd hh:mm:ss');
    }
    return new Date(time).Format('yyyy-MM-dd hh:mm:ss');
  },
  // ADDYEAR(date,years),将指定日期加减指定年数
  ADDYEAR(...args) {
    let date = args[0];
    // let days = arguments[1];
    if (date === undefined || date === '') {
      return '';
    }
    let flag = false;
    if (date.length <= 10) {
      flag = true;
    }
    date = date.toString().replace(/-/g, '/').replace(/T/g, ' ');
    if (isiOS) {
      if (date.length === 7) {
        date += '/01';
      }
    }
    date = new Date(date);
    let newDate = new Date(date.setYear(date.getFullYear() + parseInt(args[1], 10)));
    if (flag) {
      newDate = new Date(newDate).Format('yyyy-MM-dd');
    } else {
      newDate = new Date(newDate).Format('yyyy-MM-dd hh:mm');
    }
    return newDate;
  },
  // ADDMONTH(date,months),将指定日期加减指定月数
  ADDMONTH(...args) {
    let date = args[0];
    // let days = args[1];
    if (date === undefined || date === '') {
      return undefined;
    }
    let flag = false;
    if (date.length <= 10) {
      flag = true;
    }
    date = date.toString().replace(/-/g, '/').replace(/T/g, ' ');
    if (isiOS) {
      if (date.length === 7) {
        date += '/01';
      }
    }
    date = new Date(date);
    let newDate = new Date(date.setMonth(date.getMonth() + parseInt(args[1], 10)));
    if (flag) {
      newDate = new Date(newDate).Format('yyyy-MM-dd');
    } else {
      newDate = new Date(newDate).Format('yyyy-MM-dd hh:mm');
    }
    return newDate;
  },
  // ADDDAY(date,days),将指定日期加减指定天数
  ADDDAY(...args) {
    let date = args[0];
    const days = args[1];
    if (date === undefined || date === '') {
      // return void 0;
      return '';
    }
    // Error,建议用正则表达式匹配
    let flag = false; // 标识是否只是日期格式yyyy-mm-dd
    if (date.length <= 10) {
      flag = true;
    }
    date = date.toString().replace(/-/g, '/').replace(/T/g, ' ');

    date = new Date(date);
    let newDate = new Date(date.setDate(date.getDate() + parseInt(days, 10)));
    if (flag) {
      newDate = new Date(newDate).Format('yyyy-MM-dd');
    } else {
      newDate = new Date(newDate).Format('yyyy-MM-dd hh:mm');
    }
    return newDate;
  },
  // DAYS(end,start) 两个日期之间天数
  DAYS(...args) {
    let end = args[0];
    let start = args[1];
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    end = end.toString().replace(/-/g, '/').replace(/T/g, ' ');
    start = start.toString().replace(/-/g, '/').replace(/T/g, ' ');
    if (isiOS) {
      if (end.length === 7) {
        end += '/01';
      }
      if (start.length === 7) {
        start += '/01';
      }
    }
    const dateEnd = new Date(end);
    const dateStart = new Date(start);
    const diff = dateEnd - dateStart;
    // if (Number.isNaN(diff)) return NaN;
    if (Number.isNaN(Number(diff))) return 0;
    return Number((diff / day).toFixed(2));
  },
  // HOURS(end,start) 两个日期之间小时数
  HOURS(...args) {
    let end = args[0];
    // 更改
    // if (!end) {
    //   const date = new Date();
    //   const y = date.getFullYear();
    //   let m = date.getMonth() + 1;
    //   let d = date.getDate();
    //   m = m > 9 ? m : `0${m}`;
    //   d = d > 9 ? d : `0${d}`;
    //   end = `${y}-${m}-${d} 00:00`;
    // }
    if (end.length === 10) {
      end += ' 00:00';
    }
    const reg = new RegExp(/^\d{2}:\d{2}/);
    if (reg.test(end)) {
      const date = new Date();
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      m = m > 9 ? m : `0${m}`;
      d = d > 9 ? d : `0${d}`;
      end = `${y}-${m}-${d} ${end}`;
    }
    let start = args[1];
    if (start.length === 10) {
      start += ' 00:00';
    }
    if (reg.test(start)) {
      const date = new Date();
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      m = m > 9 ? m : `0${m}`;
      d = d > 9 ? d : `0${d}`;
      start = `${y}-${m}-${d} ${start}`;
    }
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    end = end.toString().replace(/-/g, '/').replace(/T/g, ' ');
    start = start.toString().replace(/-/g, '/').replace(/T/g, ' ');
    const dateEnd = new Date(end);
    const dateStart = new Date(start);
    const diff = dateEnd - dateStart;
    // if (Number.isNaN(diff)) return NaN;
    if (Number.isNaN(Number(diff))) return 0;
    return Number((diff / hour).toFixed(2));
  },
  // MINUTES(end,start) 两个日期之间分钟数
  MINUTES(...args) {
    let end = args[0];
    // 更改
    // if (!end) {
    //   const date = new Date();
    //   const y = date.getFullYear();
    //   let m = date.getMonth() + 1;
    //   let d = date.getDate();
    //   m = m > 9 ? m : `0${m}`;
    //   d = d > 9 ? d : `0${d}`;
    //   end = `${y}-${m}-${d} 00:00`;
    // }
    if (end.length === 10) {
      end += ' 00:00';
    }
    const reg = new RegExp(/^\d{2}:\d{2}/);
    if (reg.test(end)) {
      const date = new Date();
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      m = m > 9 ? m : `0${m}`;
      d = d > 9 ? d : `0${d}`;
      end = `${y}-${m}-${d} ${end}`;
    }
    let start = args[1];
    // 更改
    // if (!start) {
    //   const date = new Date();
    //   const y = date.getFullYear();
    //   let m = date.getMonth() + 1;
    //   let d = date.getDate();
    //   m = m > 9 ? m : `0${m}`;
    //   d = d > 9 ? d : `0${d}`;
    //   start = `${y}-${m}-${d} 00:00`;
    // }
    if (start.length === 10) {
      start += ' 00:00';
    }
    if (reg.test(start)) {
      const date = new Date();
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      m = m > 9 ? m : `0${m}`;
      d = d > 9 ? d : `0${d}`;
      start = `${y}-${m}-${d} ${start}`;
    }
    const second = 1000;
    const minute = second * 60;
    // hour = minute * 60;
    // day = hour * 24;
    end = end.toString().replace(/-/g, '/').replace(/T/g, ' ');
    start = start.toString().replace(/-/g, '/').replace(/T/g, ' ');
    const dateEnd = new Date(end);
    const dateStart = new Date(start);
    const diff = dateEnd - dateStart;
    // if (Number.isNaN(diff)) return NaN;
    if (Number.isNaN(Number(diff))) return 0;
    return Number((diff / minute).toFixed(2));
  },
  // StartsWith(string,start) 判断字符串是否以特定字符串开始
  STARTSWITH(...args) {
    let string = args[0];
    let starter = args[1];
    if (!Number.isNaN(Number(string))) {
      string += '';
    }
    if (!Number.isNaN(Number(starter))) {
      starter += '';
    }
    const str = string.substring(0, starter.length);
    return str === starter;
  },
  // IsNullOrEmpty(a) 判断字符串是否为空
  ISNULL(...args) {
    const arg = args[0];
    if (arg === '' || arg === undefined || arg === null || arg === 0) {
      return true;
    } else if (arg instanceof Array && arg.length === 0) {
      return true;
    } else if (typeof arg === 'object' && Object.keys(arg).length === 0) {
      return true;
    }
    return false;
  },
  // FORMAT(a,b) 格式化字符串
  FORMAT() { },
  // IIF(a,b,c) 如果a成立则返回b否则返回c
  // 'IIF': function () {
  //    let condition = arguments[0];
  //    if (eval(condition)) {
  //        return arguments[1];
  //    } else {
  //        return arguments[2];
  //    }
  // },
  IF(...args) {
    const condition = args[0];
    if (eval(condition)) {
      return args[1];
    }
    return args[2];
  },
  CASE(...args) {
    for (let i = 0; i < args.length - 1; i += 1) {
      if (i % 2 === 0 && eval(args[i])) {
        return args[i + 1];
      }
    }
    return null;
  },
  NEWGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 || 0;
      const v = c === 'x' ? r : ((r && 0x3) || 0x8);
      return v.toString(16);
    });
  },
  // COUNT(v) 统计
  COUNT() {
    return arguments.length;
  },
  // MOD(a,b)两数相除余数
  MOD(...args) {
    const mod = 0;
    if (args.length === 0) {
      return 0;
    } else if (args.length === 1) {
      return Number(args[0]);
    }
    const num = Number(args[0]);
    const div = Number(args[1]);
    if (div === 0) {
      return mod;
    }
    return num % div;
  },
  // INT(v),向下取整
  INT(...args) {
    // let int = 0;
    if (args.length === 0) {
      return 0;
    }
    return Math.floor(Number(args[0]));
  },
  FLOOR() {

  },
  // trunc(number,digits),将数字截为整数或保留指定位数小数
  TRUNC(...args) {
    let trunc = 0;
    if (args.length === 0) {
      return trunc;
    } else if (args.length < 2) {
      return args[0];
    }
    const number = `${args[0]}`;
    const digits = Number(args[1]);
    const arr = number.split('.');
    let decimal = arr[1] || '';
    if (decimal.length <= digits) {
      trunc = Number(`${arr[0]}.${decimal}`);
    } else {
      decimal = decimal.slice(0, digits);
      trunc = Number(`${arr[0]}.${decimal}`);
    }
    return trunc;
  },
  // IsNumber(v),判断是否是数字
  ISNUMBER(...args) {
    let isNumber = false;
    if (args.length > 0) {
      isNumber = !Number.isNaN(Number(args[0]));
    }
    return isNumber;
  },
  // LEFT(text,number),从左边第一个字符串开始截取制定长度的字符串
  LEFT(...args) {
    let left = '';
    if (args.length > 0) {
      const str = args[0];
      const len = args[1] ? args[1] : 0;
      left = (`${str}`).slice(0, len);
    }
    return left;
  },
  // LEN(text),计算字符串长度
  LENGTH(...args) {
    let len = 0;
    if (!args[0]) {
      return 0;
    }
    if (args.length > 0) {
      len = (`${args[0]}`).length;
    }
    return len;
  },
  // LOWER(text),将字符串转成小写
  TOLOWER(...args) {
    let lower = '';
    if (args.length > 0) {
      const notNum = Number.isNaN(Number(args[0]));
      if (notNum) {
        lower = args[0].toLowerCase();
      } else {
        lower = args[0];
      }
    }
    return lower;
  },
  // ToUpper(text),将字符串转成大写
  TOUPPER(...args) {
    let upper = '';
    if (args.length > 0) {
      const notNum = Number.isNaN(Number(args[0]));
      if (notNum) {
        upper = args[0].toUpperCase();
      } else {
        upper = args[0];
      }
    }
    return upper;
  },
  // replace(oldtext,start,num,newtext),将字符串中部分字符串用另外字符串替换
  REPLACE(...args) {
    const replace = '';
    if (args.length === 0) {
      return replace;
    } else if (args.length < 4) {
      return args[0];
    }
    let oldStr = args[0] || '';
    oldStr += '';
    const start = args[1];
    const num = args[2];
    const newStr = args[3];
    // 如果旧字符串为空，则返回新字符串
    if (oldStr.length === 0) {
      return newStr;
    }
    // 如果替换起始位置大于旧字符串长度，返回旧字符串+新字符串
    if (start > oldStr.length) {
      return oldStr + newStr;
    }
    // 如果替换起始位置+替换长度>旧字符串长度,返回前部+新字符串
    if ((start + num) - 1 > oldStr.length) {
      const pre = oldStr.slice(0, start - 1);
      return pre + newStr;
    }
    const pre = oldStr.slice(0, start - 1);
    const post = oldStr.slice((start + num) - 1);
    return pre + newStr + post;
  },
  // right(text,num),从字符串右边查找指定位数字符
  RIGHT(...args) {
    let right = '';
    if (args.length === 0) {
      return right;
    } else if (args.length < 2) {
      return args[0];
    }
    const text = args[0] || '';
    const num = Number(args[1]);
    const len = text.length;
    const start = len - num;
    if (start <= 0) {
      return text;
    }
    right = (`${text}`).slice(start);
    return right;
  },
  // search(text_find,text_within,start_num),在第二个字符串中从指定位置开始查找第一个字符串
  SEARCH(...args) {
    let index = 0;
    if (args.length < 3) {
      return index;
    }
    const oldStr = args[1] || '';
    const target = args[0];
    const start = Number(args[2]);
    index = (`${oldStr}`).indexOf(target, start - 1);
    return index + 1;
  },
  // substitute(text,old,new,times),将字符串中旧字符串用新字符串替换
  SUBSTITUTE(...args) {
    let postText = '';
    if (args.length >= 4) {
      // subsitute = arguments[0];
      let originalText = args[0] || '';
      const oldText = args[1] || '';
      const newText = args[2] || '';
      const times = args[3];
      originalText += '';
      if (Number.isNaN(Number(times))) {
        postText = originalText.replace(oldText, newText);
      } else {
        let tag = 0;
        while (tag < times) {
          let tempText = oldText;
          if (oldText.length <= 0) {
            tempText = ' ';
          }
          originalText = originalText.replace(tempText, newText);
          tag += 1;
        }
        postText = originalText;
      }
    } else {
      postText = args[0];
    }
    return postText;
  },
  // trim(t),去掉字符首位空格
  TRIM(...args) {
    let trim = '';
    if (args.length > 0) {
      trim = $.trim(args[0]);
    }
    return trim;
  },
  // Concatenate(a,b,c,...),拼接字符串
  CONCATENATE(...args) {
    let concatenate = '';
    const arg = args;
    for (let i = 0; i < arg.length; i += 1) {
      concatenate += arg[i];
    }
    return concatenate;
  },
  // VALUE(t),将文本转化为数字
  VALUE(...args) {
    let value = 0;
    if (args.length > 0) {
      value = Number(args[0]);
    }
    return value;
  },
  // CONTAIN()
  CONTAINS(...args) {
    let ret = false;
    if (args.length < 2) {
      return ret;
    }
    const source = args[0].toString();
    const target = args[1].toString();
    ret = source.indexOf(target) > -1;
    return ret;
  },
  // split(text,separator),分割字符串
  SPLIT(...args) {
    if (args.length === 0) {
      return [];
    }
    if (args.length === 1) {
      const split = [];
      split.push(args[0]);
      return split;
    }
    const text = args[0];
    const separator = args[1];
    return text.split(separator);
  },
  // substring(text,start,num)
  SUBSTRING(...args) {
    if (args.length < 3 || args[0] === '') {
      return null;
    }
    const start = Number(args[1]);
    const length = Number(args[2]);
    const substring = (`${args[0]}`).slice(start - 1, (start + length) - 1);
    return substring;
  },
  // 获取地址控件值
  GETADDRESS(...args) {
    let address = '';
    if (args.length === 0) {
      return '';
    }
    address = args[0];
    if (address === '') {
      return address;
    }
    let temp;
    if (typeof address === 'string') {
      temp = $.parseJSON(address);
    } else {
      temp = address;
    }
    address = temp.adname;
    if ($.trim(temp.Detail) !== '') {
      if ($.trim(address) !== '') {
        address += (` ${temp.Detail}`);
      } else {
        address = temp.Detail;
      }
    }

    return address;
  },
  // 将数值转成大写人民币
  UPPERMONEY(...args) {
    // let currency = '';
    if (args.length === 0) {
      return '';
    }
    let money = args[0];
    if (Number.isNaN(Number(money))) {
      money = 0;
    }
    money = `${Math.round(money * 100)}`;
    let chineseMoney = ''; // 准换后的汉字金额
    const str1 = '零壹贰叁肆伍陆柒捌玖'; // 汉字数字
    let str2 = '万仟佰拾亿仟佰拾万仟佰拾元角分'; // 对应单位
    const len = money.length; // money的字符串长度
    let ch1; // 数字的汉语读法
    let ch2; // 数字位的汉字读法
    let nZero = 0; // 用来计算连续的零值的个数
    let str3; // 指定位置的数值
    if (len > 15) {
      // 超出计算范围
      return '';
    }
    if (money === 0 || money === '0') {
      chineseMoney = '零元整';
      return chineseMoney;
    }
    str2 = str2.substr(str2.length - len, len); // 取出对应位数的string2值
    for (let i = 0; i < len; i += 1) {
      str3 = parseInt(money.substr(i, 1), 10);
      if (i !== (len - 3) && i !== (len - 7) && i !== (len - 11) && i !== (len - 15)) {
        if (str3 === 0) {
          ch1 = '';
          ch2 = '';
          nZero += 1;
        } else if (str3 !== 0 && nZero !== 0) {
          ch1 = `零${str1.substr(str3, 1)}`;
          ch2 = str2.substr(i, 1);
          nZero = 0;
        } else {
          ch1 = str1.substr(str3, 1);
          ch2 = str2.substr(i, 1);
          nZero = 0;
        }
      } else {
        // 该位是万亿，亿，万，元位等关键位
        if (str3 !== 0 && nZero !== 0) {
          ch1 = `零${str1.substr(str3, 1)}`;
          ch2 = str2.substr(i, 1);
          nZero = 0;
        } else if (str3 !== 0 && nZero !== 0) {
          ch1 = `零${str1.substr(str3, 1)}`;
          ch2 = str2.substr(i, 1);
          nZero = 0;
        } else if (str3 !== 0 && nZero === 0) {
          ch1 = str1.substr(str3, 1);
          ch2 = str2.substr(i, 1);
          nZero = 0;
        } else if (str3 === 0 && nZero >= 3) {
          ch1 = '';
          ch2 = '';
          nZero += 1;
        } else {
          ch1 = '';
          ch2 = str2.substr(i, 1);
          nZero += 1;
        }
        if (i === (len - 11) || i === (len - 3)) {
          // 如果该位是亿位或元位，则必须写上
          ch2 = str2.substr(i, 1);
        }
      }
      // 负数
      if (money.substr(i, 1) === '-') {
        ch1 = '负';
        ch2 = '';
      }
      chineseMoney = chineseMoney + ch1 + ch2;
    }
    if (str3 === 0) {
      // 最后一位（分）为0时，加上“整”
      chineseMoney += '整';
    }
    return chineseMoney;
  },
};


export default math;
