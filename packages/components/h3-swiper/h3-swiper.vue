<template>
  <div class="h3-slider">
    <div class="h3-swiper" :class="wrapCls" :style="{height: xheight}">
      <slot></slot>
      <div
      class="h3-swiper-item"
      v-for="(item, index) in list"
      @click="clickListItem(item)"
      :data-index="index">
        <a href="javascript:">
          <div class="h3-img" :style="{backgroundImage: buildBackgroundUrl(item)}"></div>
          <p class="h3-swiper-desc" v-if="showDescMask">{{ item.title }}</p>
        </a>
      </div>

      <div
      v-if="listTwoLoopItem.length > 0"
      class="h3-swiper-item h3-swiper-item-clone"
      v-for="(item, index) in listTwoLoopItem"
      @click="clickListItem(item)"
      :data-index="index">
        <a href="javascript:">
          <div class="h3-img" :style="{backgroundImage: buildBackgroundUrl(item)}"></div>
          <p class="h3-swiper-desc" v-if="showDescMask">{{ item.title }}</p>
        </a>
      </div>

    </div>
    <div :class="[dotsClass, 'h3-indicator', `h3-indicator-${dotsPosition}`]" v-show="showDots">
      <a href="javascript:" v-for="key in length">
        <i class="h3-icon-dot" :class="{'active': key - 1 === current}"></i>
      </a>
    </div>
  </div>
</template>

<script>
import Swiper from './swipe';
import { go } from '../../libs/router';

export default {
  name: 'h3-swiper',
  created() {
    this.index = this.value || 0;
    if (this.index) {
      this.current = this.index;
    }
  },
  mounted() {
    this.hasTwoLoopItem();
    this.$nextTick(() => {
      if (!(this.list && this.list.length === 0)) {
        this.render(this.index);
      }
      this.xheight = this.getHeight();
      this.$emit('on-get-height', this.xheight);
    });
  },
  methods: {
    hasTwoLoopItem() {
      if (this.list.length === 2 && this.loop) {
        this.listTwoLoopItem = this.list;
      } else {
        this.listTwoLoopItem = [];
      }
    },
    clickListItem(item) {
      go(item.url, this.$router);
      this.$emit('on-click-list-item', JSON.parse(JSON.stringify(item)));
    },
    buildBackgroundUrl(item) {
      return item.fallbackImg ? `url(${item.img}), url(${item.fallbackImg})` : `url(${item.img})`;
    },
    render(index = 0) {
      if (this.swiper) {
        this.swiper.destroy();
      }
      this.swiper = new Swiper({
        container: this.$el,
        direction: this.direction,
        auto: this.auto,
        loop: this.loop,
        interval: this.interval,
        threshold: this.threshold,
        duration: this.duration,
        height: this.height,
        minMovingDistance: this.minMovingDistance,
        imgList: this.imgList,
        mode: this.mode,
      })
        .on('swiped', (prev, i) => {
          this.current = i % this.length;
          this.index = i % this.length;
        });
      if (index > 0) {
        this.swiper.go(index);
      }
    },
    rerender() {
      if (!this.$el || this.hasRender) {
        return;
      }
      this.hasRender = true;
      this.hasTwoLoopItem();
      this.$nextTick(() => {
        this.index = this.value || 0;
        this.current = this.value || 0;
        this.length = this.list.length || this.$children.length;
        this.destroy();
        this.render(this.value);
      });
    },
    destroy() {
      this.hasRender = false;
      if (this.swiper) {
        this.swiper.destroy();
      }
    },
    getHeight() {
      const hasHeight = parseInt(this.height, 10);
      if (hasHeight) {
        return this.height;
      } else if (this.aspectRatio) {
        return `${this.$el.offsetWidth * this.aspectRatio}px`;
      }
      return '180px';
    },
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    direction: {
      type: String,
      default: 'horizontal',
    },
    showDots: {
      type: Boolean,
      default: true,
    },
    showDescMask: {
      type: Boolean,
      default: true,
    },
    dotsPosition: {
      type: String,
      default: 'right',
    },
    dotsClass: String,
    auto: Boolean,
    loop: Boolean,
    interval: {
      type: Number,
      default: 3000,
    },
    threshold: {
      type: Number,
      default: 50,
    },
    duration: {
      type: Number,
      default: 300,
    },
    height: {
      type: String,
      default: 'auto',
    },
    aspectRatio: Number,
    minMovingDistance: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
    mode: {
      type: String,
      validator: val => ['normal', 'drawer'].indexOf(val) > -1,
      default: 'normal',
    },
  },
  data() {
    return {
      hasRender: false,
      current: this.index || 0,
      xheight: 'auto',
      length: this.list.length,
      index: 0,
      listTwoLoopItem: [],
    };
  },
  computed: {
    wrapCls() {
      if (this.mode !== 'normal') {
        return 'h3-swiper-drawer';
      }
      return '';
    },
  },
  watch: {
    auto(val) {
      if (!val) {
        if (this.swiper) {
          this.swiper.stop();
        }
      } else if (this.swiper) {
        this.swiper._auto(); // eslint-disable-line
      }
    },
    list() {
      this.rerender();
    },
    current(currentIndex) {
      this.index = currentIndex;
      this.$emit('on-index-change', currentIndex);
    },
    index(val) {
      const self = this;
      if (val !== this.current) {
        this.$nextTick(() => {
          if (self.swiper) {
            self.swiper.go(val);
          }
        });
      }
      this.$emit('input', val);
    },
    value(val) {
      this.index = val;
    },
  },
  beforeDestroy() {
    this.destroy();
  },
};

</script>

<style lang="less">
@import '../../styles/mixins.less';

@pre: h3;

.@{pre}-slider {
  overflow: hidden;
  position: relative;

  > .@{pre}-indicator, .@{pre}-indicator-right {
    position: absolute;
    right: 15px;
    bottom: 10px;

    > a {
      float: left;
      margin-left: 6px;

      > .@{pre}-icon-dot {
        display: inline-block;
        vertical-align: text-bottom;
        width: 4px;
        height: 4px;
        border-radius: 2px;
        background-color: #d0cdd1;
      }
      > .@{pre}-icon-dot.active {
        background-color: #1890FF;
      }

    }
  }

  > .@{pre}-indicator-center {
    right: 50%;
    transform: translateX(50%)
  }

  > .@{pre}-indicator-left {
    left: 15px;
    right: auto;
  }

  > .@{pre}-swiper {
    overflow: hidden;
    position: relative;

    > .@{pre}-swiper-item {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      > a {
        display: block;
        width: 100%;
        height: 100%;

        > .@{pre}-img {
          display: block;
          width: 100%;
          height: 100%;
          background: center center no-repeat;
          background-size: cover;
        }

        > .@{pre}-swiper-desc {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1.4em;
          font-size: 16px;
          padding: 20px 50px 12px 13px;
          margin: 0;
          background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, .7) 100%);
          color: #fff;
          text-shadow: 0 1px 0 rgba(0, 0, 0, .5);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-wrap: normal;
        }

      }
    }
  }

  > .@{pre}-swiper-drawer {
    > .@{pre}-swiper-item {
      padding: 5% 15%;
    }
  }
}
</style>
