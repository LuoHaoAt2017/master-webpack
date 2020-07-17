const filter = (str: string): string => {
  const pattern = new RegExp(
    "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}《》【】‘；：”“'。，、？%]"
  );
  let res = '';
  for (var i = 0; i < str.length; i++) {
    res = res + str.substr(i, 1).replace(pattern, '');
  }
  return res;
};
export default filter;
