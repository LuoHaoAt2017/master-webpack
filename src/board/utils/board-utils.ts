import { FormControlType, BoardGroupAllValue } from '../typings/const';
import { IBoardColorSettingRule, FilterType } from '../typings';
import handleNumber from './handle-number';

/**
* 获取不同格式日期值
*/
export const fotmatDateValue = (val: string, format: string) => {
  switch (format) {
    case 'yyyy-mm-dd':
      return val.substr(0, 10);
    case 'yyyy-mm-dd hh:mm':
      return val.substr(0, val.length - 3).replace('T', ' ');
    case 'yyyy-mm':
      return val.substr(0, 7);
    case 'hh:mm':
      return val.substr(val.length - 8, 5);
  }
};

const getNumberFormat = (code: string, controls: any) => {
  const ctrl = controls[code];
  return {
    ShowMode: ctrl.ShowMode,
    DecimalPlaces: ctrl.DecimalPlaces,
  };
};

/**
 * 获取日期控件格式
 */
const getDateFormat = (code: string, controls: any) => {
  return controls[code].DateTimeMode;
};
/**
 * 获取控件值
*/
export const getControlValue = (field: string, type: FormControlType, form: any,
  controls: any) => {
  if (type === FormControlType.FormDateTime ||
    type === FormControlType.FormCreatedTime ||
    type === FormControlType.FormModifiedTime) {
    if (form.cellValues[field]) {
      const format = getDateFormat(field, controls) || 'yyyy-mm-dd hh:mm';
      if (format) {
        return fotmatDateValue(form.cellValues[field] as string, format);
      }
    }
    return '';
  } else if (type === FormControlType.FormNumber) {
    const format = getNumberFormat(field, controls);
    return handleNumber(form.cellValues[field], format.DecimalPlaces, -1, format.ShowMode);
  }
  return form.cellValues[field];
};

const formatDate = (dateObj: Date) => {
  const month = dateObj.getMonth() + 1;
  const date = dateObj.getDate();
  return `${dateObj.getFullYear()}-${formatStr(month)}-${formatStr(date)}`;
};

const formatStr = (num: number) => {
  return num < 10 ? `0${num}` : num;
};

interface IDateValue {
  min: string;
  max: string;
}

/**
 * 获取格式化日期范围值
*/
export const getDateRange = (dateStr = '') => {
  // const dateObj = new Date();
  const dateObj = (dateStr && dateStr !== BoardGroupAllValue) ? new Date(dateStr) : new Date();
  const ret:{[key: string]: IDateValue} = {};
  const monthNow = dateObj.getMonth() + 1;
  const yearNow = dateObj.getFullYear();
  const dayNow = dateObj.getDay();// 星期几 0-6
  const millSeconds = dateObj.getTime();
  const monthDay = new Date(yearNow, monthNow, 0).getDate();
  ret.today = {
    min: `${formatDate(dateObj)} 00:00`,
    max: `${formatDate(dateObj)} 23:59`,
  };
  const daySeconds = 24 * 60 * 60 * 1000;
  const yesObj = new Date(millSeconds - daySeconds);
  ret.yesterday = {
    min: `${formatDate(yesObj)} 00:00`,
    max: `${formatDate(yesObj)} 23:59`,
  };
  const mondayObj = new Date(millSeconds - dayNow * daySeconds);
  const sundayObj = new Date(millSeconds - dayNow * daySeconds + 6 * daySeconds);
  const lastMondayObj = new Date(millSeconds - dayNow * daySeconds - 7 * daySeconds);
  const lastSundayObj = new Date(millSeconds - dayNow * daySeconds - 7 * daySeconds + 6 * daySeconds);
  ret.thisWeek = {
    min: `${formatDate(mondayObj)} 00:00`,
    max: `${formatDate(sundayObj)} 23:59`,
  };
  ret.lastWeek = {
    min: `${formatDate(lastMondayObj)} 00:00`,
    max: `${formatDate(lastSundayObj)} 23:59`,
  };
  ret.thisMonth = {
    min: `${yearNow}-${formatStr(monthNow)}-01 00:00`,
    max: `${yearNow}-${formatStr(monthNow)}-${monthDay} 23:59`,
  };
  const lastMonth = monthNow === 1 ? 12 : monthNow - 1;
  const lastMonthYear = monthNow === 1 ? yearNow - 1 : yearNow;
  const lastMonthDays = new Date(lastMonthYear, lastMonth, 0).getDate();
  ret.lastMonth = {
    min: `${lastMonthYear}-${formatStr(lastMonth)}-01 00:00`,
    max: `${lastMonthYear}-${formatStr(lastMonth)}-${lastMonthDays} 23:59`,
  };
  ret.year = {
    min: `${yearNow}-01-01 00:00`,
    max: `${yearNow}-12-31 23:59`,
  };
  ret.lastYear = {
    min: `${yearNow - 1}-01-01 00:00`,
    max: `${yearNow - 1}-12-31 23:59`,
  };
  return ret;
};

/**
* 规则是否需要被删除掉
*/
export const isRuleShouleBeRemoved = (ruleItem: IBoardColorSettingRule, controlOptions: any) => {
  const control = controlOptions[ruleItem.columnId];
  if (!control) return true;
  if (control.Type === FormControlType.FormPhoto || control.Type === FormControlType.FormAttachment) {
    return true;
  }
  if (ruleItem.operator === FilterType.contains && !ruleItem.range && (
    control.Type === FormControlType.FormNumber ||
    control.Type === FormControlType.FormDateTime
  )) {
    return true;
  }
  // 日期类型不能为range
  if (ruleItem.operator === FilterType.range && (
    control.Type === FormControlType.FormDateTime
  )) {
    return true;
  }
  // 非日期控件不能有等于或日期范围
  if (ruleItem.operator === FilterType.rangedate &&
    control.Type !== FormControlType.FormDateTime &&
    control.Type !== FormControlType.FormCreatedTime &&
    control.Type !== FormControlType.FormModifiedTime
  ) {
    return true;
  }
  if (ruleItem.operator === FilterType.contains && ruleItem.value && !Array.isArray(ruleItem.value) && (
    control.Type === FormControlType.FormUser ||
    control.Type === FormControlType.FormDepartment ||
    control.Type === FormControlType.FormMultiUser ||
    control.Type === FormControlType.FormMultiDepartment
  )) {
    return true;
  }
  return false;
};
