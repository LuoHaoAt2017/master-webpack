export default {
  // 获取一个月有多少天
  getDaysInOneMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const d = new Date(year, month, 0);
    return d.getDate();
  },
  // 向前空几个
  getMonthweek(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const dateFirstOne = new Date(`${year}/${month}/1`);
    return dateFirstOne.getDay() === 0 ? 7 : dateFirstOne.getDay();
    // return dateFirstOne.getDay() === 0 ? 6 : dateFirstOne.getDay() - 1;
  },
  /**
   * 获取当前日期上个月或者下个月
   */
  getOtherMonth(date, str = 'nextMonth') {
    const timeArray = this.dateFormat(date).split('/');
    const year = timeArray[0];
    const month = timeArray[1];
    const day = timeArray[2];
    let year2 = year;
    let month2;
    if (str === 'nextMonth') {
      month2 = parseInt(month, 10) + 1;
      if (month2 === 13) {
        year2 = parseInt(year2, 10) + 1;
        month2 = 1;
      }
    } else {
      month2 = parseInt(month, 10) - 1;
      if (month2 === 0) {
        year2 = parseInt(year2, 10) - 1;
        month2 = 12;
      }
    }
    let day2 = day;
    const days2 = new Date(year2, month2, 0).getDate();
    if (day2 > days2) {
      day2 = days2;
    }
    if (month2 < 10) {
      month2 = `0${month2}`;
    }
    if (day2 < 10) {
      day2 = `0${day2}`;
    }
    const t2 = `${year2}/${month2}/${day2}`;
    return new Date(t2);
  },
  // 获取任意年月的一天
  getSpecialMonth(year, month, day) {
    let day2 = day;
    const days2 = new Date(year, month, 0).getDate();
    if (day2 > days2) {
      day2 = days2;
    }
    if (day2 < 10) {
      day2 = `0${day2}`;
    }
    const t2 = `${year}/${month}/${day2}`;
    return new Date(t2);
  },
  // 上个月末尾的一些日期
  getLeftArr(date) {
    const arr = [];
    const leftNum = this.getMonthweek(date);
    const preDate = this.getOtherMonth(date, 'preMonth');
    const num = this.getDaysInOneMonth(preDate) - leftNum;
    // 上个月多少开始
    for (let i = 1; i <= leftNum; i += 1) {
      const nowTime = `${preDate.getFullYear()}/${(preDate.getMonth() + 1)}/${(num + i)}`;
      arr.push({
        id: num + i,
        date: nowTime,
        isToday: false,
        otherMonth: 'preMonth',
      });
    }
    return arr;
  },
  // 下个月末尾的一些日期
  getRightArr(date) {
    const arr = [];
    const nextDate = this.getOtherMonth(date, 'nextMonth');
    const leftLength = this.getDaysInOneMonth(date) + this.getMonthweek(date);
    const len = 7 - leftLength % 7;
    for (let i = 0; i < len; i += 1) {
      const nowTime = `${nextDate.getFullYear()}/${(nextDate.getMonth() + 1)}/${(i + 1)}`;
      arr.push({
        id: i + 1,
        date: nowTime,
        isToday: false,
        otherMonth: 'nextMonth',
      });
    }
    return arr;
  },
  // format日期
  dateFormat(date) {
    date = new Date(date);
    return `${date.getFullYear()}/${(date.getMonth() + 1)}/${date.getDate()}`;
  },
  // 获取某月的列表不包括上月和下月
  getMonthListNoOther(date) {
    const arr = [];
    const num = this.getDaysInOneMonth(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const toDay = this.dateFormat(new Date());

    for (let i = 0; i < num; i += 1) {
      const nowTime = `${year}/${month}/${i + 1}`;
      arr.push({
        id: i + 1,
        date: nowTime,
        isToday: toDay === nowTime,
        otherMonth: 'nowMonth',
      });
    }
    return arr;
  },
  // 获取某月的列表 用于渲染
  getMonthList(date) {
    return [...this.getLeftArr(date), ...this.getMonthListNoOther(date), ...this.getRightArr(date)];
  },
};
