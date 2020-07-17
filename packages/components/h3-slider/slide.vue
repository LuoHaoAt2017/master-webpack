<template>
  <div :class="wrapCls" >
    <div class="h3-3D h3-slide-view" :style="wrapStyle"  ref="slideView">
      <slot></slot>
    </div>
    <SlideNav v-if="showNav && length>1"
      :active="activeIndex"
      :num="length"
      :position="titleShow ? 'RIGHT' : 'CENTER'"
    />
  </div>
</template>

<script>
import cx from 'classnames';
import SlideNav from './slidenav';
import SlideItem from './slideitem';
import { getItemUnready } from './utils';
import env from '../../utils/env';


const {
  TOUCH_START,
  TOUCH_MOVE,
  TOUCH_END,
  TOUCH_CANCEL,
  support3D,
  supportTouch,
  isPC,
  RESIZE,
} = env;

const win = window;
const doc = document;
const OFFSET = 'offset';
const POS_MAP = {
  '-1': 'prevEl',
  0: 'currentEl',
  1: 'nextEl',
};

// 创建translate字符串
// TODO: translate(0,0) translateZ(0);
/* eslint-disable no-param-reassign */
const makeTranslate = (function () {
  const prefix = support3D ? 'translate3d(' : 'translate(';
  const suffix = support3D ? ', 0)' : ')';
  const join = ',';

  function v(n) {
    let back = `${n || 0}`;
    back = back.indexOf('%') > -1 ? back : `${back}px`;
    return back;
  }

  return function (x, y) {
    return prefix + v(x) + join + v(y) + suffix;
  };
}());

// 获取兼容PC和Device的event对象的page属性
const getCursorPage = supportTouch ? function (event, page) {
  return event.changedTouches[0][page];
} : function (event, page) {
  return event[page];
};
/* eslint-enable no-param-reassign */
const noop = () => {};

export default {
  name: 'h3-slide',
  props: {
    height: {
      type: [Number, String],
      default: '5rem',
    },
    active: {
      type: Number,
      default: 0,
    },
    auto: {
      type: Boolean,
      default: false,
    },
    loop: {
      type: Boolean,
      default: true,
    },
    showNav: {
      type: Boolean,
      default: false,
    },
    onMount: {
      type: Function,
      default: noop,
    },
    onSlideEnd: {
      type: Function,
      default: noop,
    },
    onSlideClick: {
      type: Function,
      default: noop,
    },
    autoSlideTime: {
      type: Number,
      default: 4000,
    },
    showTitle: {
      type: Boolean,
      default: false,
    },
    displayMode: {
      type: String,
      default: 'normal',
      validator: val => ['normal', 'card'].indexOf(val) > -1,
    },
  },
  components: {
    SlideNav,
    SlideItem,
  },
  created() {
    if (this.displayMode === 'card') {
      this.titleShow = false;
    }
  },
  data() {
    return {
      currentPosIndex: 0,
      length: 0,
      isAuto: this.auto,
      index: this.active,
      disabled: false,
      dummy: false,
      realIndex: {},
      duration: 200,
      speed: 300,
      effectiveDelta: Math.floor(window.innerWidth / 1.8),
      titleShow: this.showTitle,
      children: [],
    };
  },
  mounted() {
    const t = this;
    t.getLength();
    if (this.dummy) {
      // const source = this.$slots.default;
      // source.each(obj => t.$refs.slideView.appendChild(obj.cloneNode(true)));
      for (let i = 0, len = t.children.length; i < len; i += 1) {
        t.$refs.slideView.appendChild(t.children[i].elm.cloneNode(true));
      }
      // t.children.each(obj => t.$refs.slideView.appendChild(obj.elm.cloneNode(true)));
      t.children = t.children.concat(t.children[0]).concat(t.children[1]);
    }
    // 确定容器宽度
    t.width = isPC ? t.$el.clientWidth : win.innerWidth;

    t.setContext();

    // 当屏幕旋转的时候，修正布局
    win.addEventListener(RESIZE, t, false);
  },
  methods: {
    /**
    * 获取 slide 列表的真正长度，主要是考虑 children
    * 长度是 1 和 2 的情况下
    */
    getLength() {
      const t = this;
      let originLength = 0;
      // const originLength = React.Children.count(t.props.children);
      for (let i = 0, len = this.$slots.default.length; i < len; i += 1) {
        if (this.$slots.default[i].tag) {
          originLength += 1;
          this.children.push(this.$slots.default[i]);
        }
      }

      // check
      if (originLength === 1) {
        this.disabled = true;
      } else if (originLength === 2) { // item的长度经处理后不存在为2的情况
        t.dummy = true;
        t.realIndex = {
          0: 0,
          1: 1,
          2: 0,
          3: 1,
        };
      }

      // 处理以后的长度，即item的个数
      t.length = t.dummy ? 4 : originLength;
      // t.length = originLength;
    },

    /**
    * 根据 slide 列表长度设置正确的内部变量
    *
    */
    setContext(prevProps) {
      const t = this;

      // 由于子元素数量有变化，先解绑与数量相关的监听，再根据数量重新绑定。
      t.$el.removeEventListener(TOUCH_START, t, false);
      clearTimeout(t.autoSlideTimer);

      // 至少有2张slide时，才初始化事件
      if (t.length > 1) {
        t.$el.addEventListener(TOUCH_START, t, false);
      } else {
        t.$el.addEventListener('click', () => {
          t.onSlideClick({
            index: 0,
            item: t.currentEl,
            data: t.children[0].elm,
          });
        });
      }

      // 前一个，当前的，后一个item的element引用
      t.prevEl = null;
      t.currentEl = null;
      t.nextEl = null;

      t.deltaX = 0;
      t.minIndex = 0;
      t.maxIndex = t.length - 1;
      if (!prevProps) {
        t.onMount(t);
      }
      if (t.length !== 0) {
        t.goto(t.index, true);
        t.autoSlide();
      }
    },

    autoSlide() {
      const t = this;
      if (!t.isAuto) return;
      t.autoSlideTimer = setTimeout(() => {
        t.goNext();
        t.autoSlide();
      }, this.autoSlideTime || 4000);
    },

    /**
    * @param {number} index 目标位置的索引值
    * @param {boolean} callFromDidMount 是否是在 componentDidMount 中被调用的
    */
    goto(posIndex, callFromDidMount, noAnimation) {
      const t = this;
      const callFromDidMountBool = !!callFromDidMount;

      if (t.length === 1 || callFromDidMountBool) {
        // `_getItemReady` 方法被调用之前，需要先更新 `currentPosIndex` 的值
        t.currentPosIndex = posIndex;
        t.getItemReady(0, noAnimation);

        if (t.length > 2) {
          t.getItemReady(1, noAnimation);
          t.getItemReady(-1, noAnimation);
        }
      } else if (!callFromDidMountBool) {
        // 通过goNext/goPrev调用的goto，一直有方向(dir)值 向左:-1 / 向右:1
        if (t.dir) {
          getItemUnready(t.dir === 1 ? t.nextEl : t.prevEl);
          t.moveItem(t.currentEl, t.dir);
          t.moveItem(t.dir === 1 ? t.prevEl : t.nextEl, t.dir);

          // `_getItemReady`方法被调用之前，需要先更新`currentPosIndex`的值
          t.currentPosIndex = posIndex;
          t.getItemReady(t.dir * -1);

          setTimeout(() => {
            t.slideEnd();
          }, t.duration);
        } else if (posIndex === t.currentPosIndex) { // 归位的情况：移动距离小于有效距离时
          // 归位当前item
          t.moveItem(t.currentEl, 0);
          // 归位进入屏幕的另一个item
          // 说明:任意一个时间点,出现在屏幕内的item数量最多为2个,要么左边,要么右边,取决于移动方向
          if (t.moveBack) {
            t.moveItem(t.moveBack, 0);
          } else { // 当resize时
            t.moveItem(t.prevEl, 0);
            t.moveItem(t.nextEl, 0);
          }
        }
      }

      t.moveBack = null;
      t.dir = null;
    },

    goNext() {
      const t = this;
      // 方向是向左(-1)，要展现的是后一张(1)
      t.dir = -1;
      t.goto(t.getPosIndex(1));
    },

    goPrev() {
      const t = this;
      // 方向是向右(1)，要展现的是前一张(-1)
      t.dir = 1;
      t.goto(t.getPosIndex(-1));
    },

    /**
    * 移动item到新的位置
    * @param {element} item
    * @param {number} dir 移动的方向 -1:向左移动 / 1:向右移动 / 0:移动到原位
    */
    /* eslint-disable no-param-reassign */
    // DOM节点
    moveItem(item, dir) {
      const t = this;
      item.style.webkitTransitionDuration = `${t.duration}ms`;

      const newOffset = +item.getAttribute(OFFSET) + dir;

      t.setItemX(item, t.getPosX(newOffset));

      // 如果进行了切换行为，即dir为-1或1
      if (dir) {
        item.setAttribute(OFFSET, newOffset);
        t[POS_MAP[newOffset]] = item;
      }
    },
    /* eslint-enable no-param-reassign */


    /**
    * 根据指定的偏移量，找到对应的item，将其切换到可移动状态
    * @param {number} offset -1:前一个位置 / 0:当前位置 / 1: 后一个位置
    * @note 任何时刻，可移动状态的item数量只有三个
    * @note 该方法依赖`currentPosIndex`和`offset`查找目标`item`，
    *       而`_getItemUnready`方法直接给定了`item`，不需要依赖`currentPosIndex`和`offset`
    */
    getItemReady(offset, noAnimation) {
      const t = this;
      const targetPosIndex = t.getPosIndex(offset);
      // const item = t.children[targetPosIndex].elm;
      let item = null;
      if (t.$refs.slideView && t.$refs.slideView.children) {
        item = t.$refs.slideView.children[targetPosIndex];
      }
      // const item = t.refs[`item${targetPosIndex}`];
      if (!item) {
        return;
      }
      item.classList.add('ready');
      item.setAttribute(OFFSET, offset);
      item.style.webkitTransform = makeTranslate(t.getPosX(offset));

      if (noAnimation) {
        item.style.webkitTransitionDuration = '0ms';
      }

      t[POS_MAP[offset]] = item;
    },


    /**
    * 获取指定的offset所对应的X坐标值(0点在当前item的左边缘)
    * @param {number} offset -1:前一个位置 / 0:当前位置 / 1: 后一个位置
    */
    getPosX(offset) {
      const t = this;
      if (offset === -1) {
        return -t.width;
      } else if (offset === 1) {
        return t.width;
      }
      return 0;
    },

    /**
    *
    */
    /* eslint-disable no-param-reassign */
    // DOM元素
    setItemX(item, x) {
      this[`${POS_MAP[item.getAttribute(OFFSET)]}X`] = x;
      item.style.webkitTransform = makeTranslate(x);
    },
    /* eslint-enable no-param-reassign */

    /**
    * 获取前一个或后一个位置的索引值，相对值是currentPosIndex
    * @param {number} offset -1:取前一个位置 / 0:取当前位置 / 1: 取后一个位置
    */
    getPosIndex(offset) {
      const t = this;
      let index;
      if (offset === -1) {
        index = t.currentPosIndex === t.minIndex ? t.maxIndex : t.currentPosIndex - 1;
      } else if (offset === 1) {
        index = t.currentPosIndex === t.maxIndex ? t.minIndex : t.currentPosIndex + 1;
      } else if (offset === 0) {
        index = t.currentPosIndex;
      } else {
        throw new Error('error offset');
      }
      return index;
    },

    handleEvent(e) {
      const t = this;
      switch (e.type) {
        case TOUCH_START:
          t.touchStart(e);
          break;
        case TOUCH_MOVE:
          t.touchMove(e);
          break;
        case TOUCH_END:
          t.touchEnd(e);
          break;
        case TOUCH_CANCEL:
          t.touchEnd(e);
          break;
        case RESIZE:
          t.resize(e);
          break;
        default:
          break;
      }
    },

    touchStart(e) {
      // 只响应单指操作
      if (supportTouch && e.touches.length > 1) {
        return;
      }

      const t = this;

      clearTimeout(t.autoSlideTimer);

      // 恢复到0 拖拽过程中快速响应移动距离
      t.prevEl.style.webkitTransitionDuration = '0ms';
      t.currentEl.style.webkitTransitionDuration = '0ms';
      t.nextEl.style.webkitTransitionDuration = '0ms';

      // 移动初始值
      t.prevElX = t.getPosX(-1);
      t.currentElX = t.getPosX(0);
      t.nextElX = t.getPosX(1);

      // 浏览器默认滚动
      t.browserScrolling = false;

      // 是否是切换状态 此时忽略浏览器默认的滚动行为
      t.sliding = false;

      t.startPageX = getCursorPage(e, 'pageX');
      t.startPageY = getCursorPage(e, 'pageY');
      t.basePageX = t.startPageX;
      t.startTime = e.timeStamp;

      doc.addEventListener(TOUCH_MOVE, t, false);
      doc.addEventListener(TOUCH_END, t, false);
    },

    touchMove(e) {
      // 只响应单指操作
      if (supportTouch && e.touches.length > 1) {
        return;
      }

      const t = this;

      // 如果浏览器默认滚动行为已被触发，则不执行Slider的滚动
      if (t.browserScrolling) {
        return;
      }

      const pageX = getCursorPage(e, 'pageX');
      const pageY = getCursorPage(e, 'pageY');
      let distX;
      let newPrevX;
      let newCurrentX;
      let newNextX;
      let deltaY;

      t.deltaX = pageX - t.startPageX;

      // 如果slide开始滚动
      if (t.sliding) {
        e.preventDefault();
        e.stopPropagation();

        // 任意时刻的位移值
        distX = pageX - t.basePageX;

        // 当不是循环模式的时候，第一张和最后一张添加粘性
        if (t.loop === false &&
          (
            (distX >= 0 && t.currentPosIndex === t.minIndex) ||
            (distX < 0 && t.currentPosIndex === t.maxIndex) ||
            (distX < 0 && t.dummy && t.currentPosIndex === 1)
          )
        ) {
          distX -= (distX / 1.3);
        }

        // 位移后的X坐标
        newPrevX = t.prevElX + distX;
        newCurrentX = t.currentElX + distX;
        newNextX = t.nextElX + distX;

        // 更新DOM位置
        t.setItemX(t.prevEl, newPrevX);
        t.setItemX(t.currentEl, newCurrentX);
        t.setItemX(t.nextEl, newNextX);

        if (t.deltaX >= 0) {
          t.moveBack = t.prevEl;
        } else {
          t.moveBack = t.nextEl;
        }
      } else {
        deltaY = pageY - t.startPageY;

        // 如果X轴的移动距离先达到5px，则执行Slider的滚动
        // 如果Y轴的移动距离先达到5px，则执行浏览器默认的页面滚动
        if (Math.abs(t.deltaX) > 5) {
          e.preventDefault();
          e.stopPropagation();
          t.sliding = true;
        } else if (Math.abs(deltaY) > 5) {
          t.browserScrolling = true;
        }
      }

      t.basePageX = pageX;
    },

    touchEnd(e) {
      // 只响应单指操作
      if (supportTouch && e.touches.length > 1) {
        return;
      }

      const t = this;

      // 如果浏览器默认滚动行为已被触发，则不执行Slider的滚动
      if (t.browserScrolling) {
        return;
      }

      t.browserScrolling = false;

      const endTime = e.timeStamp;
      const speed = Math.floor((t.deltaX / (t.startTime - endTime)) * 1000);

      // 向右滑动
      if (t.deltaX > t.effectiveDelta || speed < -t.speed) {
        if (t.loop === false && t.currentPosIndex === t.minIndex) {
          t.goto(t.currentPosIndex);
        } else {
          t.goPrev();
        }
      } else if (t.deltaX < -t.effectiveDelta || speed > t.speed) { // 向左滑动
        if (t.loop === false &&
          (t.currentPosIndex === t.maxIndex || (t.dummy && t.currentPosIndex === 1))
        ) {
          t.goto(t.currentPosIndex);
        } else {
          t.goNext();
        }
      } else if (endTime - t.startTime < 500 && Math.abs(t.deltaX) < 5) { // 点击
        t.slideClick();
      } else { // 保持原有位置
        t.goto(t.currentPosIndex);
      }

      t.deltaX = 0;

      doc.removeEventListener(TOUCH_MOVE, t, false);
      doc.removeEventListener(TOUCH_END, t, false);

      t.autoSlide();
    },

    slideClick() {
      const t = this;
      const realIndex = t.getRealIndex(t.currentPosIndex);
      const data = t.$refs.slideView
        && t.$refs.slideView.children
        && t.$refs.slideView.children[realIndex];
      t.onSlideClick({
        index: realIndex,
        item: t.currentEl,
        data,
      });
    },

    slideEnd() {
      const t = this;
      const realIndex = t.getRealIndex(t.currentPosIndex);
      const data = t.$refs.slideView
        && t.$refs.slideView.children
        && t.$refs.slideView.children[realIndex];
      t.onSlideEnd({
        index: realIndex,
        item: t.currentEl,
        data,
      });
      // https://facebook.github.io/react/docs/component-api.html#forceupdate
      // 通常情况下我们不使用 forcecUpdate，但我们需要 slide 过程中的中间变量
      // 而非最终 state 去触发插件的更新，因此这里我们用到了 forceUpdate。
    },

    getRealIndex(posIndex) {
      const t = this;
      return t.dummy ? t.realIndex[posIndex] : posIndex;
    },

    /**
    * 当屏幕旋转时，更新基本数据 && 再次定位
    */
    resize() {
      const t = this;
      t.width = isPC ? t.$el.clientWidth : win.innerWidth;
      t.goto(t.currentPosIndex);
    },
  },
  computed: {
    wrapCls() {
      return cx('h3-slide', {
        'h3-slide-off': this.disabled,
        'h3-slide-show-title': this.titleShow,
        'H3-slide-card-mode': this.displayMode === 'card',
      });
    },
    wrapStyle() {
      return {
        height: this.height,
      };
    },
    activeIndex() {
      return this.getRealIndex(this.currentPosIndex);
    },
  },
  watch: {
    active(val) {
      this.currentPosIndex = val;
    },
  },
};
</script>

<style lang="less">

.h3-slide {
  position: relative;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  overflow: hidden;
  .h3-slide-view {
    overflow: hidden;
    position: relative;
    top: 0;
    left: 0;
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    .h3-slide-item {
      top: 0;
      left: -10000px;
      position: absolute;
      width: 100%;
      height: 100%;
      & > div {
        height: 100%;
      }
      &.ready {
        left: 0;
      }
      img {
        -webkit-user-drag: none;
        height: auto;
        max-height: 100%;
        max-width: 100%;
        position: absolute;
        margin: auto;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        object-fit: contain;
      }
      .h3-slide-item-inner {
        position: relative;
        .h3-slide-item-title {
          display: none;
          position: absolute;
          font-size: 14px;
          color: #fff;
          background-color: rgba(0, 0, 0, .3);
          left: 0;
          bottom: 0;
          width: 100%;
          line-height: 30px;
          height: 30px;
          padding: 0 16px;
          & > div {
            width: 70%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
      }
    }
  }
  .h3-slide-show-title {
    .h3-slide-item-inner {
      .h3-slide-item-title {
        display: block;
      }
    }
  }
}
  




// 卡片模式
// .{$prefix}-slide-card-mode
//   .{$prefix}-slide-item
//     border-radius 4px
//     overflow hidden
//     width 82%
//     margin-left 9%

// .{$prefix}-slide-img-contain .{$prefix}-slide-item
//   -webkit-background-size contain
//   background-size contain

// .{$prefix}-slide-img-cover .{$prefix}-slide-item
//   -webkit-background-size cover
//   background-size cover
</style>
