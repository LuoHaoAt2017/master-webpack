<template>
  <div>
    <div class="h3-action-group-wrapper">
      <div class="h3-action-group-header" v-if="showTitle">
        <slot name="header"></slot>
      </div>
      <div class="h3-action-group-content-wrapper">
        <div class="h3-action-group-content">
          <slot></slot>
        </div>
      </div>
      <div class="h3-action-group-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>
<script>

export default{
  name: 'h3-action-group',
  props: {
    showTitle: {
      type: Boolean,
      default: false,
    },
    showButton: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';

@prefixCls: h3-action-group;
.@{prefixCls}-wrapper{
  width: 100%;
  .hairline('top', #e4eee4);
  z-index: 1000;
  background: #fff;
}
.h3-action-group-header{
  width: 100%;
  .px2rem(height, 112);
  .px2rem(padding-top, 35);
  .px2rem(padding-bottom, 35);
  .px2rem(padding-left, 30);
  .px2rem(padding-right, 30);
  box-sizing: border-box;
  .px2rem(font-size, 30);
  color: #333;
  background: #fff;
}

.@{prefixCls}-content {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  position: relative;
  // .hairline('top', #e4e4e4);
  // .hairline('bottom', #e4e4e4);
  background: #fff;
  white-space: nowrap;
  position: relative;
}
// .h3-action-wrapper{
//   position: relative;
//   .hairline('top', #e4e4e4);
// }
.h3-action-group-content-wrapper{
  position: relative;
  // .hairline('top', #e4e4e4);
  .px2rem(border-top-width, 1);
  border-top-style: solid;
  border-top-color: #e4e4e4;
  .hairline('bottom', #e4e4e4);
  
  // .px2rem(border-bottom-width, 1);
  // border-bottom-style: solid;
  // border-bottom-color: #e4e4e4;
  background: #fff;
  white-space: nowrap;
}
.h3-status-tip-action{
  .px2rem(width, 80);
  .px2rem(height, 32);
  display: inline-block;
}
.h3-action-group-footer{
  position: relative;
  .h3-button{
    .hairline('top', transparent);
  }
}

</style>

