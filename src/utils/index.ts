export const jsonParse = (str: string): any => {
  try {
    return JSON.parse(str);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production' || process.env.H3_ENV === 'stg') {
      console.error(`JSON字符串解析失败: ${str}`); // eslint-disable-line
    }
    return false;
  }
};

export const htmlEscape = (text) => {
  return text.replace(/[<>"&]/g, function (match) {
    switch (match) {
      case '<': return '&lt;';
      case '>':return '&gt;';
      case '&':return '&amp;';
      case '"':return '&quot;';
    }
  });
};

export * from './url';

/**
 * 根据键值获取cookie值
 * @param key cookie key值
 */
export function getCookie (key: string): string {
  const reg = new RegExp(`(^| )${key}=([^;]*)(;|$)`);
  const arr = document.cookie.match(reg);
  if (arr) {
    return unescape(arr[2]);
  }
  return '';
}

export const isAndroid = window.navigator.userAgent.indexOf('Android') > -1 || window.navigator.userAgent.indexOf('Adr') > -1;

export const isiOS = !!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
