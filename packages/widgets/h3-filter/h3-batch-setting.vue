<template>
    <div :class="wrapCls">
      <div class="cancel" @click="onCancel">
        取消
      </div>
      <div class="top-" v-if="direction === 'top'">
        已选{{checkedNum}}条
      </div>
      <div class="choose" @click="allChoosed" v-if="direction === 'top'">
        <template>{{tip}}</template>  
      </div>
      <div class="choose" @click="allChoosed" v-if="direction === 'bottom'">
        <template v-if="checkedNum === 0 || checkedNum === total">{{tip}}</template>
        <template v-if="checkedNum > 0 && checkedNum != total">已选</template> 
        <template v-if="checkedNum > 0">({{checkedNum}})</template>
      </div>
    </div>
</template>
<script>
import cx from 'classnames';

const prefixCls = 'h3-batch-setting';
export default {
  name: 'h3-batch-setting',
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
      required: true,
    },
    show: {
      type: Boolean,
      default: false,
    },
    tip: {
      type: String,
      default: '全选',
    },
    direction: {
      type: String,
      default: 'bottom',
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
      if (this.chooseAll && this.checkedNum === this.total) {
        this.tempNumber = 0;
        this.chooseAll = false;
      } else {
        this.tempNumber = this.total;
        this.chooseAll = true;
      }
      this.$emit('selectAll', this.tempNumber); // 全选
    },
  },
  computed: {
    wrapCls() {
      return cx(`${prefixCls}`, this.className);
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
@import '../../styles/themes/default';
@import '../../styles/mixins';

.h3-batch-setting{
  position: fixed !important;
  z-index: 1000 !important;
  display: flex;
  align-items: center;
  flex-direction: row;
  bottom: 0;
  .px2rem(height,88);
  width: 100%;
  background: #FFFFFF;
  .hairline('top',#ddd);
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
  &-bottom{
    bottom: 0;
  }
  &-top{
    top: 0;
  }
}

</style>


