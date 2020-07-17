
import { addClass, removeClass } from '../utils/class';

export default {
  inserted(el) {
    const oDiv = el;
    const fixedClass = 'h3-fixed-top';
    // 记录原始位置 和 滚动条的距离
    const rect = oDiv.getBoundingClientRect();
    const top = rect.top;
    const height = rect.height;
    let initialMargin = 0;
    let hasRecord = false;
    // const isIOS = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);

    const toggleFixed = () => {
      // 判断目标对象的位置
      const scrollTop = oDiv.parentElement.scrollTop;
      const nextSibling = oDiv.nextElementSibling;
      if (!hasRecord) {
        initialMargin = parseInt(window.getComputedStyle(nextSibling)['margin-top'], 10);
        hasRecord = true;
      }
      if (scrollTop > top) {
        // 紧邻的兄弟节点添加margin
        nextSibling.style.marginTop = `${initialMargin + height}px`;
        addClass(oDiv, fixedClass);
        addClass(oDiv, 'sticky');
        // if (isIOS) {
        //   addClass(oDiv, 'sticky');
        // }
      } else {
        nextSibling.style.marginTop = `${initialMargin}px`;
        removeClass(oDiv, fixedClass);
        removeClass(oDiv, 'sticky');
        // if (isIOS) {
        //   removeClass(oDiv, 'sticky');
        // }
      }
    };
    const fixedRestore = () => {
      const scrollTop = oDiv.parentElement.scrollTop;
      const nextSibling = oDiv.nextElementSibling;
      if (scrollTop > top) {
        // 紧邻的兄弟节点添加margin
        nextSibling.style.marginTop = `${initialMargin + height}px`;
        addClass(oDiv, fixedClass);
      } else {
        nextSibling.style.marginTop = `${initialMargin}px`;
        removeClass(oDiv, fixedClass);
      }
    };

    const touchStartHandler = () => {
    };
    const touchMoveHandler = () => {
      toggleFixed();
    };
    const touchEndHandler = () => {
      setTimeout(fixedRestore, 100);
    };
    const touchCancelHandler = () => {
    };
    oDiv.$touchStart = touchStartHandler;
    oDiv.$touchMove = touchMoveHandler;
    oDiv.$touchEnd = touchEndHandler;
    oDiv.$touchCancel = touchCancelHandler;
    document.addEventListener('touchstart', touchStartHandler, false);
    document.addEventListener('touchmove', touchMoveHandler, false);
    document.addEventListener('touchend', touchEndHandler, false);
    document.addEventListener('touchcancel', touchCancelHandler, false);
  },
  update() {
    
  },
  unbind(el) {
    const oDiv = el;
    document.removeEventListener('touchstart', el.$touchStart);
    document.removeEventListener('touchmove', el.$touchMove);
    document.removeEventListener('touchend', el.$touchEnd);
    document.removeEventListener('touchcancel', el.$touchCancel);
    delete oDiv.$touchStart;
    delete oDiv.$touchMove;
    delete oDiv.$touchEnd;
    delete oDiv.$touchCancel;
  },
};
