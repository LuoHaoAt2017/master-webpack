import map from 'array-map';
import find from 'array-find';

export default function (value, list, delimiter) {
  if (value && list.length <= 0) {
    return '';
  }
  let tmpDelimiter = delimiter;
  if (!tmpDelimiter) {
    tmpDelimiter = ' ';
  }

  let rs = map(value, (one, index) => {
    if (list.length && Object.prototype.toString.call(list[0]) === '[object Array]') {
      // return find(list[index], item => item.value === one);
      const res = [];
      for (let i = 0, len = list[index].length; i < len; i += 1) {
        if (list[index][i] === one) {
          res.push(list[index][i]);
        }
      }
      return res;
    }
    return find(list, item => item.value === one);
  });
  rs = rs.filter(one => typeof one !== 'undefined');
  return map(rs, one => one.name || one).join(delimiter).replace('--', '');
}

