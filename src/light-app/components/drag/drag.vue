<template>
  <div
    ref="drag"
    class="drag-container"
    oncopy='document.selection.empty()'
    onbeforecopy='return false'
  >
    <slot></slot>
  </div>
</template>

<script lang='ts'>
import { RectType, DragOptionsType } from './types.d';
import {
  Vue,
  Component,
  Prop,
  Emit,
  Watch,
  Mixins
} from 'vue-property-decorator';
import { State, Getter, Mutation, Action, namespace } from 'vuex-class';

@Component({
  name: 'LDrag'
})
export default class LDrag extends Vue {
  @Prop()
  options!: any;

  $refs!: {
    drag: HTMLElement;
  };
  destroyed: boolean = false;
  moved: boolean = false;
  children: HTMLElement[] = [];
  downTime: number = 0;
  dragClassName: string = 'drag-item';
  dragIndex: number = -2; //当前拖动元素的index
  dragStart: boolean = false; //是否开始拖拽
  longTouch: boolean = false; //是否长按
  scroll: boolean = false; //是否滚动
  hidIndex: number = -2;
  el: any = null;
  dragEl: any = null;
  point: any = null;
  $holderEl: HTMLElement = null;
  moveRect: any = null; //当前拖动元素的位置信息
  rectList: RectType[] = []; //用于存放所有拖动元素的位置信息

  get currentRect() {
    return this.rectList[this.dragIndex] || null;
  }
  created() {
    this.dragClassName = this.options.className
      ? this.options.className
      : 'drag-item';
  }
  mounted() {
    this.$nextTick(() => {
      const isParent = this.$refs.drag.children[0].classList.contains(this.dragClassName);
      this.el = isParent ? this.$refs.drag : this.$refs.drag.children[0];
      this.init();
      this.listen();
    });
  }
  init() {
    if (this.destroyed) return;
    const className = this.options.dragBoxItem ? this.options.dragBoxItem: this.dragClassName;
    this.children = Array.from(this.el.children as any);
    this.children.forEach((child, index) => {
      child.classList.add(className);
      child.dataset.index = `${index}`;
    });
    this.rectList = this.children.map(child => this.getPosOfParent(child));
  }
  listen() {
    this.el.addEventListener('touchstart', this.start, false);
    this.el.addEventListener('touchmove', this.move, false);
    this.el.addEventListener('touchend', this.end, false);
  }

  unbindListener() {
    this.el.removeEventListener('touchstart', this.start);
    this.el.removeEventListener('touchmove', this.move);
    document.removeEventListener('touchend', this.end);
  }

  start(e) {
    if (this.destroyed) {
      return;
    }
    this.init();
    let el = this.parents(e.target, this.dragClassName);
    if (!el) {
      return;
    }
    if (this.options.dragBoxItem) {
      el = this.parents(e.target, this.options.dragBoxItem);
    }
    this.moved = false;
    this.dragEl = el;
    this.dragIndex = Number(el.dataset.index);
    this.dragStart = true;
    const timer = setTimeout(() => {
      if (this.dragStart && !this.scroll) {
        e.preventDefault();
        this.dragStart = true;
        this.longTouch = true;
        let { clientX, clientY } = e.touches ? e.touches[0] : e;
        let move = (this.moveRect = this.getPosOfParent(this.dragEl));
        this.css(this.dragEl, {
          zIndex: 10,
          width: move.width + 'px',
          height: move.height + 'px',
          left: move.left + 'px',
          top: move.top + 'px',
          position: 'absolute'
        });
        el.classList.add('drag-handler');
        this.insetHolder(move.index);
        let rect = el.getBoundingClientRect();
        this.point = {
          posX: clientX - rect.left,
          posY: clientY - rect.top,
          startX: clientX,
          startY: clientY,
          moveX: clientX,
          moveY: clientY
        };
      }
      clearTimeout(timer);
    }, 200);
  }

  move(e) {
    if (this.destroyed) {
      return;
    }
    if (this.longTouch) {
      e.preventDefault();
      this.dragStart = true;
      this.moved = true;
      let point = e.touches ? e.touches[0] : e;
      let { clientX, clientY } = point;
      let { startX, startY } = this.point;
      let deltaY = clientY - startY;
      let deltaX = clientX - startX;
      this.moveRect.top = this.currentRect.top + deltaY;
      this.moveRect.left = this.currentRect.left + deltaX;
      this.css(this.dragEl, {
        transform: `translate3d(${deltaX}px, ${deltaY}px, 0)`
      });
      this.point.moveX = clientX;
      this.point.moveY = clientY;
      this.effectSibling(point);
      return false;
    } else {
      this.scroll = true;
    }
  }

  end(e) {
    this.dragStart = false;
    if (this.destroyed || !this.longTouch || this.scroll) {
      this.scroll = false;
      return;
    }
    e.preventDefault();
    this.longTouch = false;
    let targetIndex = this.hidIndex;
    this.point = null;
    this.el.removeChild(this.$holderEl);
    this.$holderEl = null;
    this.dragEl.style = null;
    this.dragEl.classList.remove('drag-handler');
    // let gapTime = new Date().getTime() - this.downTime;
    if (this.moved) {
      let pos = {
        source: this.dragIndex,
        target: targetIndex
      };
      this.$emit('drag', pos);
    }
    this.dragEl = null;
    this.moveRect = null;
    this.dragIndex = -1;
    return false;
  }

  destroy() {
    this.destroyed = true;
    this.unbindListener();
  }
  getPosOfParent(el) {
    let parent = el.parentNode;
    let pR = parent.getBoundingClientRect();
    let cR = el.getBoundingClientRect();
    return {
      width: cR.width,
      height: cR.height,
      top: cR.top - pR.top,
      left: cR.left - pR.left,
      right: cR.right - pR.left,
      bottom: cR.bottom - pR.top,
      index: el.dataset.hasOwnProperty('index') ? Number(el.dataset.index) : -1
    };
  }

  parents(el, className): HTMLElement {
    if (el == document.body) {
      return null;
    }
    if (el.classList.contains(className)) {
      return el;
    } else {
      return this.parents(el.parentElement, className);
    }
  }
  css(el, style) {
    Object.keys(style).forEach(k => {
      let val = style[k];
      el.style[k] = val;
    });
  }
  effectSibling(e) {
    let move = this.moveRect;
    let point = {
      x: move.left + move.width / 2,
      y: move.top + move.height / 2
    };
    // 找到移动块中心点进入了哪个块
    let hitIndex = this.rectList.findIndex(rect => this.isHit(point, rect));
    if (hitIndex === -1) {
      return;
    }
    if (this.hidIndex === hitIndex) return;
    this.hidIndex = hitIndex;
    if (hitIndex === move.index) {
      this.insetHolder(move.index);
    }
    // 往左上移动
    else if (hitIndex < move.index) {
      this.insetHolder(hitIndex);
    }
    // 往右下移动
    else {
      this.insetHolder(hitIndex + 1);
    }
  }

  animate(div) {
    let width = parseInt(div.style.width);
    div.style.width = 0;
    div.style.transition = '.1s';
    setTimeout(() => {
      div.style.width = width + 'px';
      setTimeout(() => {
        div.style.transition = '';
      }, 120);
    }, 10);
  }

  isHit(point, rect) {
    let { x, y } = point;
    let { top, bottom } = rect;
    return y > top && y < bottom;
  }
  insetHolder(index) {
    let div = this.getHolder();
    // this.animate(div);
    this.el.insertBefore(div, this.el.children[index]);
  }
  getHolder() {
    if (this.$holderEl) {
      return this.el.removeChild(this.$holderEl);
    }
    let el = (this.$holderEl = document.createElement('div'));
    let { width, height } = this.moveRect;
    el.className = 'sorter-holder';
    el.style.width = width + 'px';
    el.style.height = height + 'px';
    el.style.background = 'rgba(234, 242, 254, .8)';

    return el;
  }
}
</script>

<style lang='less' scoped>
.drag-handler {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.drag-container {
  -webkit-user-select: none; /*webkit浏览器*/
  -khtml-user-select: none; /*早期浏览器*/
  -moz-user-select: none; /*火狐*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
}
</style>
