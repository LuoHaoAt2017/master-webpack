export const parseUrlParam = (urls, param) => {
  let url = urls;
  const searchIndex = url.indexOf('?');
  const jhIndex = url.indexOf('#');
  if (jhIndex > -1) {
    url = url.substr(0, jhIndex);
  }
  const searchParams = url.slice(searchIndex + 1).split('&');
  for (let i = 0; i < searchParams.length; i += 1) {
    const items = searchParams[i].split('=');
    if (items[0].trim().toLowerCase() === param.toLowerCase()) {
      return items[1].trim();
    }
  }
  return null;
};

export const parseUrlParams = (url: string): any => {
  const a = document.createElement('a');
  a.href = url;
  const ret = {};
  const search = a.search;
  let seg;
  let s;
  if (!search) { // 修复存在hash时search失效的问题
    const tmpArr = a.href.split('?');
    if (tmpArr.length === 1) {
      return {};
    }
    seg = tmpArr[tmpArr.length - 1].split('&'); 
  } else {
    seg = search.replace(/^\?/, '').split('&');
  }
  for (let i = 0, len = seg.length; i < len; i++) {
    if (!seg[i]) {
      continue;
    }
    s = seg[i].split('=');
    ret[s[0]] = s[1];
  }
  return ret;
};

export const includeLanscape = !!parseUrlParam(window.location.href, 'dd_orientation');

export const parseUrl = (url: string) => {
  const a = document.createElement('a');
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: parseUrlParams(url),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || ['',''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^\/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || ['',''])[1],
    segments: a.pathname.replace(/^\//, '').split('/'),
  };
};