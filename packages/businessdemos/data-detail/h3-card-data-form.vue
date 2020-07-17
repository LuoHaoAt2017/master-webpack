<template>
  <div :class="wrapCls" :style="h3Style" >
    <h3-card-form @click.native="clickCardForm(item)" v-for="(item, index) in dataLists" :key="index">
      <div>
        <div style="display: flex"> 
          <div :class="mainTitleCls(item)">
            {{item.title}}
          </div>
          <h3-status-tip style="{margin-top: 0.04rem;}"  :type="item.status" v-if="item.status"></h3-status-tip>
        </div>
        <div class="main-summary has-aside" 
            v-for="(summary,index) in item.summary" :key="index" 
            v-if="item.summary && index < 5">
          {{summary}}
        </div>
      </div>
    </h3-card-form>
  </div>
</template>
<script>
import cx from 'classnames';
import H3CardForm from '../../widgets/h3-card-data-list/index';

const prefixCls = 'h3-card-data-form';
export default {
  name: 'h3-card-data-form',
  components: {
    H3CardForm,
  },
  props: {
    className: String,
    h3Style: Object,
    dataLists: Array,
    mainClass: String,
    mainStyle: {
      type: String,
      default: () => {},
    },
  },
  data() {
    return {
    };
  },
  computed: {
    wrapCls() {
      return cx(`${prefixCls}`, this.className);
    },
  },
  methods: {
    clickCardForm(item) {
      this.$emit('onClickCardForm', item);
    },
    mainTitleCls(item) {
      return cx('main-title', {
        'has-aside': item.status === undefined || item.status === '',
        'has-aside-status': item.status && item.status !== '',
        'without-summary': item.summary === undefined || item.summary.length < 1,
      });
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@import './style/data-detail.less';

</style>