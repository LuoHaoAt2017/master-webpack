const iconColorsArr: string[] = [
  'rgba(255, 67, 132, 0.6)',
  'rgba(116, 87, 255, 0.6)',
  'rgba(255, 117, 39, 0.6)',
  'rgba(5, 219, 155, 0.6)',
  'rgba(255, 202, 0, 0.6)',
];
const iconColorsLimit: number = 3;

export const calcAvatarColor = (objectId: string): string => {
  const substr: string = objectId.substr(-iconColorsLimit);
  let long: number = 0;
  for (let i = 0; i < substr.length; i++) {
    const s = substr[i];
    const l = s.charCodeAt(0);
    long += l;
  }
  const left = long % iconColorsArr.length;
  return iconColorsArr[left];
};

export const getUserName = (name: string, reserve: number = 1): string => {
  if (!name) return '';
  return name.toUpperCase().substr(name.length - reserve);
}
;
