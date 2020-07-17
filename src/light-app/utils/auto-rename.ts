export default function autoRename (
  originName: string,
  existNames: { [name: string]: number },
): string {
  let name = originName;
  let valueNumber = 0;
  const nameCopy = name;
  const valueSplit = nameCopy.split('-');
  if (valueSplit.length > 1) {
    valueNumber = Number(valueSplit[valueSplit.length - 1]);
    name = valueSplit.slice(0, valueSplit.length - 1).join('-');
  }
  const repeat = existNames[name];
  const padReat = existNames[nameCopy] || 0;
  if (valueNumber > 0 && valueNumber <= repeat) {
    return `${name}-${valueNumber}-${padReat + 1}`;
  } else if (repeat !== undefined && valueNumber <= repeat) {
    return `${name}-${repeat + 1}`;
  }
  return nameCopy;
}
