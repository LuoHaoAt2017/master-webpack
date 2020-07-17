<template>
  <div>
    <div v-if="twoContents" :class="wrapCls">
      <div class="cancel" @click="onCancel">
      取消
      </div>
      <div class="choose" @click="allChoosed">
        <template v-if="isAll || selectedNum==0">全部{{tip}}</template>
        <template v-else>{{tip}}({{selectedNum}})</template>
      </div>
    </div>
    <div :class="wrapCls" v-if="!twoContents">
      <div class="h3-batch-action-sheet-three-content">
        <span @click="onCancel" class="cancel">取消</span>
        <div class="batch-middle-content">
          <div class="batch-content-middle-selected">已选{{selectedNum}}条</div>
          <div v-if="loadedNum && isAll" class="batch-content-loaded-num">当前加载{{loadedNum}}条</div>
        </div>
        <span  @click="allSelected" class="checkAll">{{tip}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import cx from 'classnames';

const prefixCls = 'h3-batch-action-sheet';
export default {
  name: 'h3-batch-action-sheet',
  props: {
    className: {
      type: String,
      default: '',
    },
    h3Style: Object,
    number: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      // required: true,
    },
    show: {
      type: Boolean,
      default: false,
    },
    tip: {
      type: String,
      default: '全选',
    },
    isAll: {
      type: Boolean,
      default: true,
    },
    selectedNum: {
      type: [Number, String],
    },
    loadedNum: {
      type: [Number, String],
    },
    twoContents: {
      type: Boolean,
      default: true,
    },
    direction: {
      type: String,
      default: 'bottom',
    },
    hasBottomLine: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tempNumber: this.number,
      chooseAll: false,
    };
  },
  methods: {
    click(e) {
      if (this.onClick) {
        this.onClick(e);
      }
    },
    onCancel() {
      // 取消展示
      this.showSelf = false;
      this.$emit('onCancel'); // 取消
    },
    allChoosed() {
      if (this.selectedNum === 0) {
        this.$emit('selectAll', true); // 全选
      }
      this.$emit('selectAll', false); // 部分
    },
    allSelected() {
      if (this.tip === '全选') {
        this.$emit('selectAll'); // 全选
      }
      if (this.tip === '全不选') {
        this.$emit('cancelAll'); // 全选
      }
    },
  },
  computed: {
    wrapCls() {
      return cx(`${prefixCls}-${this.direction}`, this.className, {
        [`${prefixCls}-bottom-line`]: this.hasBottomLine,
        [`${prefixCls}`]: this.twoContents,
      });
    },
    checkedNum() {
      if (this.tempNumber > 99) {
        return 99;
      }
      if (this.tempNumber < 0) {
        return 0;
      }
      return this.tempNumber;
    },
  },
  watch: {
    number(val) {
      this.tempNumber = val;
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@prefixCls: h3-batch-action-sheet;

.@{prefixCls}{
  position: fixed !important;
  z-index: 1000 !important;
  display: flex;
  align-items: center;
  flex-direction: row;
  bottom: 0;
  .px2rem(height,88);
  width: 100%;
  background: #FFFFFF;
  div{
    flex-basis: 50%;
    .px2rem(font-size,30);
  }
  .cancel{
    .px2rem(padding-left,30);
    color: #333333;
  }
  .choose{
    text-align: right;
    .px2rem(padding-right,30);
    color: #1890FF;
  }
}
.@{prefixCls}-top{
  position: fixed !important;
  z-index: 1000 !important;
  top: 0;
  width: 100%;
  .px2rem(height, 88);
}
.@{prefixCls}-bottom-line{
  .hairline('bottom', #e4e4e4);
}

.@{prefixCls}-three-content{
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1000 !important;
  align-items: center;
  flex-direction: row;
  // .px2rem(height,87);
  .px2rem(padding-top, 28);
  .px2rem(padding-bottom, 28);
  width: 100%;
  background: #FFFFFF;
  .px2rem(padding-right, 30);
  .px2rem(padding-left, 30);
  box-sizing: border-box;
  .cancel{
    color: #1890ff;
    padding-left: 0;
    .px2rem(font-size, 32);
    .px2rem(line-height, 32);
  }
  .checkAll{
    color: #1890FF;
   .px2rem(font-size, 32);
   .px2rem(line-height, 32);
  }
}
.batch-middle-content{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  .batch-content-middle-selected{
    .px2rem(font-size, 32);
    .px2rem(line-height, 32);
    .px2rem(height, 32);
  }
}
.batch-content-loaded-num{
  .px2rem(font-size, 24) !important;
  .px2rem(line-height, 24) !important;
  color: #999;
  .px2rem(margin-top, 8);
}
</style>


