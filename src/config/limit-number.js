
/**
   * 判断当前用户localStorag是否存在并且 是否过期
   * 当不存在 需要弹窗 并设置localStorag
   * 存在但是当前时间大于 设置的时间  需要弹窗 并重新设置localStorag
  */
export const IsExpires = (engineCode, userId) => {
  const storage = localStorage.getItem(`authorizationLimit_${engineCode}_${userId}`);
  const time = new Date().getTime();
  if (!storage) { // 不存在
    return true;
  } else if (time > Number(storage)) { // 存在 时间过期
    return true;
  }
  return false;
};

/**
 *设置 localStorage并且 设置过期时间
*/
export const SetLimitStorage = (engineCode, userId, day) => {
  const expires = day * 24 * 60 * 60 * 1000;
  const date = new Date(new Date().toDateString()).getTime() + expires; // 存当天的0点的时间
  localStorage.setItem(`authorizationLimit_${engineCode}_${userId}`, String(date));
};
