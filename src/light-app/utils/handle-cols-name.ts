export default function handleColsName (
  colNames: string[],
): { [name: string ] : number} {
  const names = colNames;
  const ret = {};
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const nameSplit = name.split('-');
    let nameNumber = 0;
    let realName = name;
    if (nameSplit.length > 1) {
      const last = nameSplit[nameSplit.length - 1];
      nameNumber = Number(last);
      realName = nameSplit.slice(0, nameSplit.length - 1).join('-');
      if (ret[realName] <= nameNumber) {
        ret[realName] = nameNumber;
      } else if (ret[realName] === undefined) {
        if (last) {
          ret[realName] = nameNumber;
        } else {
          ret[name] = 0;
        }
      } else if (nameNumber === 0) {
        ret[name] = 0;
      }
    } else {
      if (!ret[nameSplit[0]]) {
        ret[realName] = 0;
      }
      continue;
    }
  }
  return ret;
}
