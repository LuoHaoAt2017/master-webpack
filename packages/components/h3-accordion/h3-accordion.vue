<template>
  <div class="h3-accordion">
    <slot></slot>
  </div>
</template>
<script>
import channel from './channel';

export default {
  name: 'h3-accordion',
  props: {
    defaultIndex: {
      type: [Number, String],
      default: 0,
    },
    // TODO: validator
    multi: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    activeIndex() {
      return parseInt(this.defaultIndex, 10);
    },
  },
  // created() {
  //   channel.$emit('activeIndexChanged', this.activeIndex);
  // },
  mounted() {
    // const firstActiveIndex = {
    //   index: this.activeIndex,
    //   parentIndex: 0,
    // };
    this.$nextTick(() => {
      channel.$emit('activeIndexChanged', this.index);
    });
  },
};
</script>

<style lang="less">
@import '../../styles/mixins.less';
@import './style/index.less';
.h3-accordion {
  padding-left: 15px;
  .list {
      position: relative;
      // padding-top: 1px;
      // padding-bottom: 1px;
      padding-left: 0;
      box-sizing: content-box;
  }
  .icon {
    display: -webkit-box;
    display: -moz-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -moz-align-items: center;
    align-items: center;
    position: absolute;
    top: 17px;
    line-height: normal;
    font-size: 12px;
  }

  .item {
      // border-bottom: 1px solid #ddd;
      background-color: #fff;
      color: #444;
      z-index: 2;
      display: block;
      // margin: -1px;
      padding: 10px;
      padding-right: 15px;
      font-size: 16px;
      min-height: 45px;
      position: relative;
      .hairline('bottom', #eee);
  }
  // .item-borderless{
  //   .hairline('bottom', #eee);
  // }

  .item, .item-content, .item-content h1, .item-content h2, .item-content h3, .item-content h4, .item-content h5, .item-content h6, .item-content p, .item h1, .item h2, .item h3, .item h4, .item h5, .item h6, .item p {
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
      // display: -webkit-box;
      // -webkit-box-orient: vertical;
      // -webkit-line-clamp: 4;
      // overflow: hidden;
      max-height: 120px;
      overflow-y: scroll;
  }


  .item-icon-right {
      padding-right: 54px;
  }
  .item-icon-left {
      padding-left: 19px;
  }

  .item-icon-right .icon {
      right: 11px;
  }
  .item-icon-left .icon {
    left: 0;
  }
} 
</style>