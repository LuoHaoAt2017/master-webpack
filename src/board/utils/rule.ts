const isArray = (arg) => {
  return Object.prototype.toString.call(arg) === '[object Array]';
};

/**
 * 判断arr1是否是arr2的子集
*/
export const containsArray = (arr1, arr2) => {
  // return arr1.every(v => arr2.includes(v));
  // 只要有任意一个就算包含
  let ret = false;
  for (const v of arr1) {
    if (arr2.includes(v)) {
      ret = true;
      break;
    }
  }
  return ret;
};

type RangeNumberType = number | string | null | undefined;

/**
 * 是否是数字
*/
export const isNumber = (arg) => {
  return arg || arg === 0;
};

/**
 * 数值范围判断
*/

export const rangeNumber = (target, range: {min :RangeNumberType; max: RangeNumberType}) => {
  if (!target && target !== 0) {
    return false;
  }
  const source = parseFloat(target);
  const hasMin = isNumber(range.min);
  const hasMax = isNumber(range.max);
  if (hasMin && hasMax) {
    return source >= parseFloat(range.min + '') && source <= parseFloat(range.max + '');
  } else if (hasMin) {
    return source >= parseFloat(range.min + '');
  } else if (hasMax) {
    return source <= parseFloat(range.max + '');
  }
  return true;
};

type RangeDateType = string | Date | null | undefined;

const getDate = (dateStr: string) => {
  if (dateStr.length === 5) {
    // 时分
    return Date.parse(`2000-01-01 ${dateStr}`);
  }
  return Date.parse(dateStr);
}



/**
 * 数值范围判断
*/
export const rangeDate = (target, range: {min :RangeDateType; max: RangeDateType}) => {
  if (!target) {
    return false;
  }
  const tDate = getDate(target);
  if (range.min && range.max) {
    return tDate >= getDate(range.min as string) && tDate <= getDate(range.max as string);
  } else if (range.min) {
    return tDate >= getDate(range.min as string);
  } else if (range.max) {
    return tDate <= getDate(range.max as string);
  }
  return true;
};

export const equals = (target, source) => {
  return target === source;
};
