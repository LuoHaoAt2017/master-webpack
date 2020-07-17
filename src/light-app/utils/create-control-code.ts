const hash = require('object-hash');

function getCode (time: string) {
  const gHashCode = hash(time, {
    algorithm: 'md5',
    encoding: 'hex',
    respectType: false,
  });
  const key = 'F' + gHashCode.slice(0, 7);
  return key;
}

export default function createControlCode (codeList: string[]) {
  let tempValue = new Date().getTime();
  let key = getCode(`'${tempValue}'`);
  while (codeList.includes(key)) {
    tempValue = tempValue + 1;
    key = getCode(`'${tempValue}'`);
  }
  return key;
}
