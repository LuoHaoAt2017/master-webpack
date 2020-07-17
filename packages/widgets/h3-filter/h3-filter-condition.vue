<template>
    <div :class="wrapCls" >
      <div id="content">
        <div>筛选条件:</div>
        <!-- <span v-for="(item,index) in items" :key="index">{{item.DisplayName}}</span> -->
        <div class="h3-filter-condition-displayname" >{{displayName}}</div>
      </div>
      <div class="filter-extra" @click="click">
        <h3-icon type="close-circle-o" size="xs"></h3-icon>
      </div>
    </div>
</template>
<script>
import cx from 'classnames';
import H3Icon from '../h3-icon/index.vue';

const prefixCls = 'h3-filter-condition';
export default {
  name: 'h3-filter-condition',
  components: {
    H3Icon,
  },
  props: {
    items: Object, // {DisplayName, Code}
    showResult: {
      type: Boolean,
      default: true,
    },
    reset: {
      type: Function,
    },
  },
  methods: {
    click(e) {
      if (this.reset) {
        this.reset(e);
      }
      this.$emit('reset');
    },
  },
  computed: {
    wrapCls() {
      return cx(`${prefixCls}`);
    },
    displayName() {
      let res = '';
      for (const key of Object.keys(this.items)) {
        if (Object.prototype.hasOwnProperty.call(this.items, key)) {
          res += `${this.items[key].DisplayName}、`;
        }
      }
      res = res.substring(0, res.length - 1);
      return res;
    },
  },
};
</script>
<style lang="less">
// @import '../../styles/themes/default';
@import '../../styles/mixins';

.h3-filter-condition{
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .px2rem(height, 80);
  .px2rem(padding-left,30);
  .px2rem(padding-right,30);
  .px2rem(border-radius,6);
  background-color: #F8F8F8;
  position: fixed;
  z-index: 3;
  width: 100%;
  box-sizing: border-box;
  #content {
    display: flex;
    .px2rem(padding-right,30);
    width: 100%;
    .h3-filter-condition-displayname {
      flex: 1;
      white-space: nowrap;
      overflow-x: scroll;
    }
  }
  div{
    .px2rem(font-size,26);
    color: #999999;
    border:none !important;
  }
  .filter-extra{
    display: flex;
    align-items: center;
    border-radius: 100%;
    border: 1px solid #999999;
    .px2rem(padding-top, 22);
    .px2rem(padding-bottom, 22);
    .px2rem(padding-right, 30);
    .px2rem(padding-left, 30);
    position: absolute;
    right: 0;
    span{
      .px2rem(font-size,26);
      .px2rem(margin-right,5);
    }
  }
}

</style>


