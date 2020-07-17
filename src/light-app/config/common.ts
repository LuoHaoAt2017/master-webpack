/**
 * 千位分隔符
 * @num number 数字or数字字符串
 * @fixed number 小数位数, 位数不足补位
 */
export const splitThousands = (num, fixed) => {
  if (typeof num !== 'number') {
    num = +num; // 处理num值为空字符串的情况
  }
  const reg = /\B(?=(\d{3})+$)/g;   //  另一写法:/\B(?=(\d{3})+\b)/g
  num = num.toString().split('.');
  fixed = fixed == undefined ? 0 : fixed;
  num[0] = num[0].replace(reg, ',');
  if (!num[1] || num[1].length < fixed) {
    let differ;
    if (num[1]) {
      differ = fixed - num[1].length;
    } else {
      num[1] = '';
      differ = fixed;
    }
    const temp = new Array(differ + 1).join('0');
    num[1] = num[1].concat(temp);
  }
  num[1] = num[1]
    ? num[1].substr(0, fixed)
    : '00000000000000000'.substr(0, fixed);
  return fixed ? num.join('.') : num[0];
}