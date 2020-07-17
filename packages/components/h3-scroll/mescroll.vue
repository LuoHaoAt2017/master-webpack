<template>
  <div id="mescroll" class="mescroll">
    <slot></slot>
  </div>
</template>

<script>
import MeScroll from 'mescroll.js';
import 'mescroll.js/mescroll.min.css';


export default {
  name: 'h3-scroll-new',
  props: {
    isLock: {
      type: Boolean,
      default: false,
    },
    enableDown: {
      type: Boolean,
      default: true,
    },
    enableUp: {
      type: Boolean,
      default: true,
    },
    refresh: {
      type: Function,
    },
    loadMore: {
      type: Function,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    noMoreMessage: {
      type: String,
      default: '已加载全部数据',
    },
    wrapId: {
      type: String,
    },
    scroll: Function,
  },
  data() {
    return {
      mescroll: null,
    };
  },
  mounted() {
    const self = this;
    self.mescroll = new MeScroll('mescroll', {
      up: {
        auto: true,
        use: this.enableUp,
        page: { size: self.pageSize },
        callback: self.upCallback, // 上拉回调
        // 默认为可回弹，兼容ios 9.0
        isBounce: true, // 此处禁止ios回弹,解析(务必认真阅读,特别是最后一点)
        htmlNodata: `<p class="upwarp-nodata">${self.noMoreMessage}</p>`,
        warpId: this.wrapId,
        isLock: this.isLock,
        // empty: {
        //   icon: 'src/assets/img/blankpage.png',
        //   tip: 'shishishi ',
        // },
      },
      down: {
        use: this.enableDown,
        auto: true,
      },
    });
    self.mescroll.optUp.onScroll = (mescroll, y, isUp) => {
      if (self.scroll) {
        self.scroll(mescroll, y, isUp);
      }
    };
    self.mescroll.lockUpScroll(this.isLock);
  },
  methods: {
    upCallback(page) {
      const self = this;
      if (self.loadMore) {
        self.loadMore(page, (length, total) => {
          self.mescroll.endBySize(length, total);
        }, () => {
          self.mescroll.endErr();
        });
      }
    },
  },
};
</script>



