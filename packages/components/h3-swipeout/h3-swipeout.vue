<template>
  <div class="h3-swipeout">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'h3-swipeout',
};
</script>

<style lang="less">
@import '../../styles/themes/default.less';

.h3-swipeout {
  width: 100%;
  overflow: hidden;
}
.h3-swipeout-item {
  position: relative;
}
.h3-swipeout-button-box {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  font-size: 0;
  text-align: right;
}
.h3-swipeout-button-box-left {
  text-align: left;
}
.h3-swipeout-button-box > div {
  height: 100%;
}
.h3-swipeout-button {
  height: 100%;
  text-align: center;
  font-size: 14px;
  color: @swipeout-button-font-color;
  border: none;
}
.h3-swipeout-content {
  position: relative;
  background: @swipeout-content-bg-color;
}
.h3-swipeout-content.h3-swipeout-content-animated {
  transition: transform 0.2s;
}
.h3-swipeout-button-primary {
  background-color: @swipeout-button-primary-bg-color;
}
.h3-swipeout-button-warn {
  background-color: @swipeout-button-warn-bg-color;
}
.h3-swipeout-button-default {
  background-color: @swipeout-button-default-bg-color;
}
</style>