export const find = (arr, val) => {
  const finded = arr.find(el => el === val);
  if (!finded) {
    return false;
  }
  return true;
};

export default { };
