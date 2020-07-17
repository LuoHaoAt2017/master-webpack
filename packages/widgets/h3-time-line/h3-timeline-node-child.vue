<template>
  <div class="h3-timeline-node-child-wrapper">
    <div class="timeline-node-child-circle-wrapper" :class="isMinHeight?'timeline-node-child-center':''">
      <div class="timeline-node-child-circle">
      </div>
    </div>
    
    <div class="node-child-product" ref="timelineNodeChildContent" :class="isMinHeight?'node-child-puroduct-minheigth':''">
      <div class="node-child-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'h3-timeline-node-child',
  data() {
    return {
      isMinHeight: false,
    };
  },
  mounted() {
    const contentHeight = this.$refs.timelineNodeChildContent.offsetHeight;
    if (contentHeight <= 45) {
      this.isMinHeight = true;
    }
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@prefixCls: h3-timeline-node-child;

.@{prefixCls}-wrapper{
  background: #fff;
  .px2rem(padding-left, 36);
  position: relative;
  .px2rem(min-height, 90);
  height: auto;
  .timeline-node-child-border{
    .px2rem(width, 4);
    height: 100%;
    background: #f8f8f8;
  }
  .timeline-node-child-circle-wrapper{
    .px2rem(width, 16);
    .px2rem(height, 16);
    position: absolute;
    .px2rem(top, 32);
    .px2rem(left, 35);
  }
  .timeline-node-child-center{
    .px2rem(top, 37);
  }
  .timeline-node-child-circle{
    position: absolute;
    top: -50%;
    left: -50%;
    .px2rem(width, 12);
    .px2rem(height, 12);
    background: #fff;
    border: 5px solid #eee;
    border-radius: 100%;
    transform: scale(0.5);
  }
  .node-child-product{
    .px2rem(border-left-width, 4);
    border-left-style: solid;
    border-left-color: #f8f8f8;
    .px2rem(padding-top, 20);
    .px2rem(padding-bottom, 20);
    .px2rem(padding-left, 30);
    .px2rem(padding-right, 30);
    .px2rem(min-height, 90);
    .node-child-content{
      .px2rem(min-height, 50);
    }
  }
  // .node-child-puroduct-minheigth{
  
  // }
}
</style>


