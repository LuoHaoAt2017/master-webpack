<template>
  <div class="h3-action-wrapper" @click="onClick">
    <p class="action-icon-wrapper">
      <span class="action-icon-area">
        <i class="icon aufont action-icon" :class="iconCls"></i>
      </span>
    </p>
    <p class="action-name">{{actionName}}</p>
  </div>
</template>

<script>
export default{
  name: 'h3-action-group-item',
  props: {
    iconType: {
      type: String,
      required: true,
    },
    actionName: {
      type: String,
    },
    action: {
      type: String,
    },
    handler: {
      type: Function,
    },
    index: {
      type: Number,
    },
  },
  computed: {
    iconCls() {
      return `icon-base-${this.iconType}`;
    },
  },
  methods: {
    onClick() {
      if (this.handler) {
        this.handler();
      } else {
        this.$emit('clickAction', { index: this.index, actionName: this.action });
      }
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';

.h3-action-wrapper{
  display: inline-block;
  .px2rem(width, 134);
  .px2rem(height, 100);
  position: relative;
  
  .h3-action-inner-wrapper{
    .px2rem(width, 134);
    .px2rem(height, 100);
  }
  .action-icon-wrapper{
    text-align: center;
    .px2rem(margin-top, 14);
    .px2rem(height, 48);
  }

  .action-icon-area{
    .px2rem(width, 48);
    .px2rem(height, 48);
    display: inline-block;
  }
  .action-icon {
    .px2rem(font-size, 40);
    color: #666;
  }
  .action-name{
    text-align: center;
    .px2rem(font-size, 20);
    color: #666666;
    .px2rem(line-height, 20);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    .px2rem(bottom, 14);
  }
}
</style>

