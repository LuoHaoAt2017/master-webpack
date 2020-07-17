// zyq;
let x = 0;
let y = 0;
let longTouch = false;
let timer = null;
const touchMoveHandler = function touchMoveHandler (e) {
  if (Math.abs(x - e.touches[0].clientX) >= 25 ||
    Math.abs(y - e.touches[0].clientY) >= 25) {
    // if (x != e.touches[0].clientX || y != e.touches[0].clientY) {
    clearTimeout(timer);
  }
  longTouch = false;
  return false;
};
const touchEndHandler = function touchEndHandler () {
  if (!longTouch) {
    clearTimeout(timer);
  }
  x = 0;
  y = 0;
  document.removeEventListener('touchmove', touchMoveHandler);
  document.removeEventListener('touchend', touchEndHandler);
  return false;
};
const touchStartHandler = function touchStartHandler (e) {
  if (e.touches.length > 1) {
    return false;
  }
  // e.preventDefault();
  const el = e.currentTarget;
  longTouch = false;
  timer = setTimeout(() => {
    longTouch = true;
    if (el.longTouchHandler) {
      el.longTouchHandler();
    }
    document.removeEventListener('touchmove', touchMoveHandler);
    document.removeEventListener('touchend', touchEndHandler);
    // 手动触发touchend 防止BScroll的模拟点击事件穿透到form页面
    const evt = new window.Event('touchend');
    evt.changedTouches = [{}];
    window.dispatchEvent(evt);
  }, 500);
  x = e.touches[0].clientX;
  y = e.touches[0].clientY;
  document.addEventListener('touchmove', touchMoveHandler, false);
  document.addEventListener('touchend', touchEndHandler, false);
  return false;
};

export default {
  bind (els, binding) {
    const el = els;
    const value = binding.value;
    if (binding.expression) {
      el.longTouchHandler = function longTouchHandler () {
        if (value.index) {
          value.handler(value.app);
        } else {
          value.handler(value.app, value.index);
        }
      };
      el.addEventListener('touchstart', touchStartHandler);
    }
  },
  update (els, binding) {
    const el = els;
    const value = binding.value;
    el.longTouchHandler = function longTouchHandler () {
      if (value.handler) {
        value.handler(value.app);
      }
    };
  },
  unbind (el) {
    el.removeEventListener('touchstart', touchStartHandler);
  },
};
