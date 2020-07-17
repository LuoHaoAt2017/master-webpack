
import { addClass, removeClass } from '../utils/class';

export default {
  bind(el, binding) {
    const oDiv = el;
    let activeClass = binding.value.activeClass;
    const disabled = binding.value.disabled;
    activeClass = activeClass ? `${activeClass}-active` : 'h3-common-active';
    const touchStartHandler = () => {
      if (disabled) {
        return;
      }
      addClass(oDiv, activeClass);
    };
    const touchMoveHandler = () => {
      removeClass(oDiv, activeClass);
    };
    const touchEndHandler = () => {
      removeClass(oDiv, activeClass);
    };
    const touchCancelHandler = () => {
      removeClass(oDiv, activeClass);
    };
    oDiv.$touchStart = touchStartHandler;
    oDiv.$touchMove = touchMoveHandler;
    oDiv.$touchEnd = touchEndHandler;
    oDiv.$touchCancel = touchCancelHandler;
    oDiv.addEventListener('touchstart', touchStartHandler, false);
    oDiv.addEventListener('touchmove', touchMoveHandler, false);
    oDiv.addEventListener('touchend', touchEndHandler, false);
    oDiv.addEventListener('touchcancel', touchCancelHandler, false);
  },
  update() {

  },
  unbind(el) {
    el.removeEventListener('touchstart', el.$touchStart);
    el.removeEventListener('touchmove', el.$touchMove);
    el.removeEventListener('touchend', el.$touchEnd);
    el.removeEventListener('touchcancel', el.$touchCancel);
    const oDiv = el;
    delete oDiv.$touchStart;
    delete oDiv.$touchMove;
    delete oDiv.$touchEnd;
    delete oDiv.$touchCancel;
  },
};
