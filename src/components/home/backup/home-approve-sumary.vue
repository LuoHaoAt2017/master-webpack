<template>
  <div class="has-summary" v-if="approveItem.ItemSummary !== '' && approveItem.MobileDicData && approveItem.MobileDicData.length >0 ">
    <div v-for=" (summary,index) in approveItem.MobileDicData" :key="index" v-if="index < 6"> 
      <template v-for="(val,key) in summary">
        {{key}} : {{val}}
      </template>
    </div>
  </div>
  <div class="no-summary" v-else>
    <div class="no-summary-icon"><i class="aufont icon-base-exclamation-circle-o"></i></div>
    <div class="no-summary-tip" v-if="type === 'assist' ">当前表单未设置摘要，设置摘要后信息展示更全面</div>
    <div class="no-summary-tip" v-if="type === 'trace' ">当前表单未设置摘要，提醒管理员设置摘要</div>
    <div class="no-summary-click" @click.stop="goSettingStrategy">查看攻略</div>
  </div>
</template>
<script>
import cx from 'classnames';

const prefixCls = 'home-approve-sumary';
export default {
  name: 'home-approve-sumary',
  components: {
  },
  props: {
    className: String,
    h3Style: Object,
    approveItem: Object,
    type: {
      type: String,
      defalut: 'assist',
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
    goSettingStrategy() {
      this.$router.push({ name: 'summaryhelp', params: {} });
    },
  },
};
</script>
<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
    @{name}: @px/@baseFontSize * 1rem;
}
.no-summary{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  .px2rem(min-height,260) !important;
  div{
    text-align: center;
  }
  &-icon{
    i{
    .px2rem(font-size, 54);
    color: #D8D8D8;
    }
  }
  &-tip{
    .px2rem(margin-top, 16);
    .px2rem(font-size, 26);
  }
  &-click{
    .px2rem(margin-top, 32);
    .px2rem(font-size, 30);
    color: #1890FF;
  }
}
.has-summary{
  display: flex;
  flex-direction: column;
  flex: 1;
  align-self: flex-start;
  .px2rem(min-height,260) !important;
  div{
    text-align: left;
    .px2rem(font-size, 26);
    .px2rem(width, 640);
    .px2rem(height, 42);
    .px2rem(line-height, 34);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: hidden;
  }
  div:last-child{
    .px2rem(margin-bottom,0);
  }
 
}
</style>