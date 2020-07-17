<template>
  <div class="h3-multiple-check-circle">
    <div class="response-area" v-if="!isSingleCheck" @click="triggerMultipleCheck()">
      <i class="icon aufont " :class="iconCls"></i>
    </div>

    <!-- <div v-if="isSingleCheck" @click.stop="triggerSingleCheck" class="response-area response-area-single">
      <div class="single-check-circle" :class="selected ? 'single-check-circle-selected': ''">
        <div :class="selected ? 'single-selected' : ''"></div>
      </div>
    </div> -->
    <div v-if="isSingleCheck && selected" class="response-area response-area-single">
      <!-- <div class="single-check-circle" :class="selected ? 'single-check-circle-selected': ''">
        <div :class="selected ? 'single-selected' : ''"></div>
      </div> -->
      <span class="single-select-inner"></span>
      <!-- <i class="icon aufont icon-base-check"></i> -->
    </div>
  </div>
</template>
<script>
export default{
  name: 'h3-multiple-check-item',
  components: {},
  props: {
    isEditing: {
      type: Boolean,
      default: false,
    },
    itemdata: {
      type: Object,
      default: () => {},
    },
    selected: {
      type: Boolean,
      default: false,
    },
    isSingleCheck: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    triggerMultipleCheck() {
      this.$emit('tigger-multiple-check');
    },
    triggerSingleCheck() {
      this.$emit('trigger-single-check');
    },
  },
  computed: {
    iconCls() {
      if (!this.selected) {
        return 'icon-base-circle-o select-circle';
      }

      if (this.isEditing && this.selected) {
        return 'icon-base-check-circle selected-circle';
      }

      return '';
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@import '../../styles/themes/default';
@prefixCls: h3-multiple-check;

.@{prefixCls}-circle{
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    .px2rem(width, 80);
    height: 100%;
  }

.select-circle {
  font-size: 22px !important;
  color: #ccc;
  position: absolute;
  .px2rem(right, 30);
  top: 50%;
  transform: translateY(-50%);
}
.selected-circle{
  font-size: 22px !important;
  color: #1890ff;
  position: absolute;
  .px2rem(right, 30);
  top: 50%;
  transform: translateY(-50%);
}

.single-check-circle{
  width: 22px;
  height: 22px;
  border-width: 1px;
  border-style: solid;
  border-color: #ccc;
  border-radius: 100%;
  padding: 3px;
  &-selected{
    border-color: #1890ff;
  }
}
.single-selected{
  background: #1890ff;
  width: 100%;
  height: 100%;
  border-radius: 100%;
}

.response-area{
  .px2rem(width, 120);
  .px2rem(height, 120);
  text-align: center;
  .px2rem(line-height, 88);
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.response-area-single{
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  i {
    color: #1890ff;
  }
}

.single-select-inner {
  color: #1890ff;
  position: absolute;
  right: 0;
  width: @icon-size-xxs;
  height: @icon-size-xxs;
  box-sizing: border-box;
  transform: rotate(0deg);

  &::after {
    position: absolute;
    display: block;
    top: -2.5 * @hd;
    right: 15px;
    z-index: 999;
    width: 7 * @hd;
    height: 14 * @hd;
    border-style: solid;
    border-width: 0 1.5 * @hd 1.5 * @hd 0;
    content: '\0020';
    transform: rotate(45deg);
  }
}


</style>

