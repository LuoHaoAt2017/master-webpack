import _isFunction from 'lodash/fp/isFunction';
const stackData = [];
/**
 * 新增popOnly函数，满足仅移出执行栈，不立即执行移除函数需求
 * updated by guosha
 */
export default {
  getStackSize: _ => stackData.length,
  pop () {
    const popOnly = this.popOnly();
    if (_isFunction(popOnly)) {
      popOnly();
    }
  },
  popOnly () {
    const len = this.getStackSize();
    try {
      // while(len > 0){
      //   len--
      //   (stackData.pop())()
      // }
      if (len > 0) {
        return stackData.pop();
      }
    } catch (e) {
      throw new Error(e);
    }
  },
  push (cb) {
    if (typeof cb === 'function') {
      stackData.push(cb);
    }
  },
};
