export const queryElement = (node: string, selectScope?: any) => {
  let d = !selectScope ? document : selectScope;
  let ret;
  if(/\./.test(node)){
      node = node.replace('.','');
      //HTMLcollection 伪数组
      ret = d.getElementsByClassName(node);
  }else if(/\#/.test(node)){
      node = node.replace('#','');
      //HTML元素
      ret = d.getElementById(node);
  }else{
      //HTMLcollection 伪数组
      ret = d.getElementsByTagName(node);
  }
  return ret;
}

export const closest = (node: any, parent: string) => {
  if(parent){
    const parents: HTMLCollection = queryElement(parent);
    let tmp = node;
    while(tmp.nodeType !== 9){
      tmp = tmp.parentNode;
      // class tagName时判断伪数组中是否存在该node元素
      // id时判断是否相等
      if(Array.prototype.indexOf.call(parent, tmp) >= 0 || tmp === parent){
          return node;
      }
    }
  }
  return null;
}

export const parentsUtil = (el, selector, filter) => {
  const result = [];
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

  // match start from parent
  el = el.parentElement;
  while (el && !matchesSelector.call(el, selector)) {
    if (!filter) {
      result.push(el);
    } else {
      if (matchesSelector.call(el, filter)) {
        result.push(el);
      }
    }
    el = el.parentElement;
  }
  return result;
};

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
export const hasParent = (node, parent) => {
  while (node) {
      if (node == parent) {
          return true;
      }
      node = node.parentNode;
  }
  return false;
};
