export function addEvent(elem, type, eventHandle) {
  if (elem === null || typeof elem === 'undefined') {
    return;
  }
  const ontype = `on${type}`;
  if (elem.addEventListener) {
    elem.addEventListener(type, eventHandle, false);
  } else if (elem.attachEvent) {
    elem.attachEvent(ontype, eventHandle);
  }
  // else {
  //   elem[ontype] = eventHandle;
  // }
}

export function removeEvent(elem, type, eventHandle) {
  if (elem === null || typeof elem === 'undefined') {
    return;
  }
  const ontype = `on${type}`;
  if (elem.removeEventListener) {
    elem.removeEventListener(type, eventHandle, false);
  } else if (elem.detachEvent) {
    elem.detachEvent(ontype, eventHandle);
  }
  //  else {
  //   elem[ontype] = null;
  // }
}

export const getData = (response) => {
  let data = {};
  if (response.content) {
    if (response.content.data) {
      ({ data } = response.content);
    } else {
      data = response.content;
    }
  } else if (response.data) {
    ({ data } = response);
  } else {
    data = typeof response === 'object' ? response : {};
  }
  return data;
};

export const normalizeLocale = (locale) => {
  const newLocale = locale.toLowerCase();
  if (newLocale.indexOf('-') !== -1) {
    return newLocale;
  } else if (newLocale.indexOf('_') !== -1) {
    return newLocale.split('_').join('-');
  } else if (newLocale) {
    let normalizedLocale;
    const locales = ['zh-cn', 'en-us'];
    for (let i = 0; i < locales.length; i += 1) {
      const item = locales[i];
      if (item.indexOf(newLocale) !== -1) {
        normalizedLocale = item;
        break;
      }
    }
    return normalizedLocale;
  }
  return undefined;
};


export const decoratorsPositions = [
  'TopLeft',
  'TopCenter',
  'TopRight',
  'CenterLeft',
  'CenterCenter',
  'CenterRight',
  'BottomLeft',
  'BottomCenter',
  'BottomRight'];

export const guid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0;
  const v = c == 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});
