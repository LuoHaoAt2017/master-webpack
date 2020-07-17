<template>
    <div :class="wrapCls">
      <div v-if=" type === 'draft' " class="status-content">草稿</div>
      <div v-if=" type === 'approving' " class="status-content">进行中</div>
      <div v-if=" type === 'executed' " class="status-content">生效</div>
      <div v-if=" type === 'cancellation' " class="status-content">作废</div>
    </div>
</template>
<script>
import cx from 'classnames';

const prefixCls = 'h3-status-tip';
export default {
  name: 'h3-status-tip',
  props: {
    className: {
      type: String,
      default: '',
    },
    h3Style: Object,
    type: {
      type: String,
      default: 'approving',
      validator: val => ['draft', 'approving', 'executed', 'cancellation'].indexOf(val) > -1,
    },
  },
  data() {
    return {
    };
  },
  methods: {
  },
  computed: {
    wrapCls() {
      return cx(`${prefixCls}`, `${prefixCls}-${this.type}`, this.className);
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';

.h3-status-tip{
  position: relative;
  height: 16px;
  min-width: 40px;
  .status-content {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 10px;
    line-height: normal;
    transform: translate(-50%, -50%);
    text-align: center;
    box-sizing: content-box;
    // padding: 0 3px;
    min-width: 40px;
  }
  &-draft{
    color: #FAAD14;
    .hairline('all',#FAAD14,8px);
    border-color: #FAAD14;
    background: rgba(250,173,20,0.10);
  }
  &-approving{
    color: #1890FF;
    .hairline('all',#1890FF,8px);
    border-color: #1890FF;
    background: rgba(24,144,255,0.10);
  }
  &-executed{
    color: #52C41A;
    .hairline('all',#52C41A,8px);
    background: rgba(82,196,26,0.10);
  }
  &-cancellation{
    color: #CCCCCC;
    .hairline('all',#CCCCCC,8px);
    border-color: #CCCCCC;
    background: rgba(204,204,204,0.10);
  }
}
</style>


