<template>
  <div class="h3-popup-header" :class="showBottomBorder ? 'bd-bottom' : ''">
    <div class="h3-popup-header-title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="h3-popup-header-cancel" @click="$emit('on-click-cancel')">
      <slot name="left-text">{{ cancelText }}</slot>
    </div>
    <div class="h3-popup-header-clear" @click="$emit('on-click-clear')">
      <slot name="left-text">{{ clearText }}</slot>
    </div>
    <div class="h3-popup-header-right" @click="$emit('on-click-right')">
      <slot name="right-text">{{ rightText }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'popup-header',
  props: {
    cancelText: {
      type: String,
      default: '取消',
    },
    clearText: {
      type: String,
      default: '清空',
    },
    rightText: {
      type: String,
      default: '确定',
    },
    title: String,
    showBottomBorder: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="less">
@import '../../styles/mixins.less';

.bd-bottom {
  .hairline(direction,#d9d9d9);
}

.h3-popup-header {
  // display: flex;
  height: @popup-header-height;
  line-height: @popup-header-height;
  font-size: @popup-header-font-size;
  background-color: @popup-header-bg-color;
  background-image: linear-gradient(to bottom, #e7e7e7, #e7e7e7, transparent, transparent);
  background-position: bottom;
  background-size: 100% 1px;
  background-repeat: no-repeat;
}

.h3-popup-header-title {
  // flex: 1;
  height: 100%;
  text-align: center;
  color: @popup-header-title-text-color;
}
.h3-popup-header-cancel,
.h3-popup-header-clear {
  position: absolute;
  top: 0;
  padding-left: @popup-header-left-text-padding;
  color: @popup-header-right-text-color;
}
.h3-popup-header-clear {
  left: 47px;
}

.h3-popup-header-right {
  position: absolute;
  top: 0;
  right: 0;
  padding-right: @popup-header-right-text-padding;
  color: @popup-header-right-text-color;
}
.h3-popup-header.bd-bottom:after {
  border-color: #D9D9D9;
}
</style>
