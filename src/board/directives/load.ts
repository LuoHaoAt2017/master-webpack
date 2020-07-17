import { DirectiveOptions } from 'vue';

export default {
  bind (el: any, binding, vNode) {
    let startPos: {x?: number, y?: number, time?: number} = {};
    let endPos: {x?: number, y?: number, time?: number} = {};
    let isVScroll = false;
    
    function touchstart (event) {
      const touch = event.changedTouches[0]; //touches数组对象获得屏幕上所有的touch，取第一个touch
      startPos = {x:touch.pageX,y:touch.pageY,time:+new Date}; //取第一个touch的坐标值
      el.addEventListener('touchmove', touchmove, false);
      el.addEventListener('touchend', touchend, false);
    }
    function touchmove (event) {
      if(event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
      const touch = event.changedTouches[0];
      endPos = {x:touch.pageX - startPos.x, y:touch.pageY - startPos.y};
      if (endPos.y > 0 && el.scrollTop <= 0) {
        // 拖到了顶部, 阻止回弹效果
        event.preventDefault();
        return;
      }
      isVScroll = Math.abs(endPos.x) < Math.abs(endPos.y) && endPos.y < 0;
      // if (isVScroll) {
      //   el.style.transform = 'translateY(' + endPos.y + 'px)';
      // }
    }
    function touchend (e) {
      const duration = +new Date - startPos.time; //滑动的持续时间
      if (isVScroll && Number(duration) > 10) {
        if (binding.expression) {
          if (binding.value && binding.value.handler && typeof (binding.value.handler) === 'function') {
            binding.value.handler(e);
          }
        }
      }
      el.removeEventListener('touchmove',touchmove,false);
      el.removeEventListener('touchend',touchend,false);
    }

    el.__touchstart__ = touchstart;
    el.addEventListener('touchstart', touchstart, false);
  },
  unbind (el: any) {
    if (el.__touchstart__) {
      el.removeEventListener('touchstart', el.__touchstart__);
      delete el.__touchstart__;
    }
  },
} as DirectiveOptions;