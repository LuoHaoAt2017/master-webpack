export function createControlCode(maxNum: number) {
  const len = 7;
  let curNum = maxNum + 1;
  const numLen = ('' + curNum).length;
  let zero = '';
  while (len - numLen - zero.length > 0) {
    zero = zero + 0;
  }
  const key = 'F' + zero + curNum;
  return { key, maxNum: curNum };
}
