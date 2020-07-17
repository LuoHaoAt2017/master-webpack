const iconColorsArr: string[] = [
  '#FF4384',
  '#7457FF',
  '#FF7527',
  '#05DB9B',
  '#FFCA00'
];
const iconColorsLimit: number = 3;

const calc = (objectId: string): string => {
  const substr: string = objectId.substr(-iconColorsLimit);
  let long: number = 0;
  for (let i = 0; i < substr.length; i++) {
    const s = substr[i];
    const l = s.charCodeAt(0);
    long += l;
  }
  const left = long % iconColorsArr.length;
  return iconColorsArr[left];
}
export default calc;
