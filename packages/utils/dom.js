export default {
  addEvent(el, type, fn, capture) {
    el.addEventListener(type, fn, { passive: false, capture: !!capture });
  },
  hasClass(el, token) {
    return new RegExp(`(\\s|^)${token}(\\s|$)`).test(el.className);
  },
  addClass(el, token) {
    if (!el) {
      return;
    }
    const tmp = el;
    if (tmp.classList) {
      tmp.classList.add(token);
    } else if (!this.hasClass(tmp, token)) {
      tmp.className += `${token}`;
    }
  },
  removeClass(el, token) {
    if (!el) {
      return;
    }
    const tmp = el;
    if (el.classList) {
      el.classList.remove(token);
    } else if (this.hasClass(el, token)) {
      tmp.className = el.className.replace(new RegExp(`(\\s|^)${token}(\\s|$)`), ' ').replace(/^\s+|\s+$/g, '');
    }
  },
  dir(elem, dir, clsName) {
    // 用于存储结果数组
    let cur = elem[dir];
    // 如果nextUntil等没有传入until，那么和parents方法一样，因为parents最多只能一个参数.只是后until就是undefined，可以一直往上调用parentNode
    // 判断当前jQuery对象所匹配的元素是否符合指定的表达式只要其中有至少一个元素符合该表达式就返回
    // 如果当前父元素已经符合until表达式了，那么不会被添加进去!
    while (cur) {
      if (this.hasClass(cur, clsName)) {
        return cur;
      }
      cur = cur[dir];
    }
    return null;
  },
  parents(elem, clsName) {
    return this.dir(elem, 'parentNode', clsName);
  },
  isWrapInCls(elem, clsName) {
    if (this.hasClass(elem, clsName)) {
      return true;
    }
    const parent = this.parents(elem, clsName);
    if (parent) {
      return true;
    }
    return false;
  },
};
