export default function handleNumber (
  number: number,
  decimalPlaces: number,
  numberFormat: number,
  showMode: number,
): string {
  if (number) {
    let value = `${number}`;
    const reg = /\B(?=(\d{3})+$)/g;
    if (decimalPlaces > 0) {
      let afterLen = 0;
      let isInt = false;
      const after = value.split('.')[1];
      if (after) {
        afterLen = after.length;
      } else {
        afterLen = 0;
        isInt = true;
      }
      if (decimalPlaces > afterLen) {
        const padAfterLen = decimalPlaces - afterLen;
        for (let i = 0; i < padAfterLen; i++) {
          if (isInt && i === 0) {
            value += '.';
          }
          value += '0';
        }
      } else {
        value = value.slice(0, value.length - (afterLen - decimalPlaces));
      }
      // 显示千分位
      if (showMode) {
        const valueArr = value.split('.');
        const valueBefore = valueArr[0].replace(reg, ',');
        const valueAfter = valueArr[1];
        value = valueBefore.concat('.').concat(valueAfter);
      }
    } else if (decimalPlaces < 1) {
      // 显示千分位
      if (showMode) {
        value = value.split('.')[0].replace(reg, ',');
      } else {
        value = value.split('.')[0];
      }
    }
    return value;
  } else if (number === 0) {
    let value = `${number}`;
    if (decimalPlaces > 0) {
      for (let i = 0; i < decimalPlaces; i++) {
        if (i === 0) {
          value += '.';
        }
        value += '0';
      }
    }
    return value;
  } else {
    return '';
  }
}
