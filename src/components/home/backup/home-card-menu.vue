<template>
  <div :class="wrapCls">
    <h3-card :has-body-content="!withoutContent" body-class-name="formBody" @click.native="onClickCard">
      <div class="formRow" v-if="!withoutContent">
        <div class="formApp" @click="onClickApp(node)"
        v-for="(node,index) in commonNodes"  :key="node.SchemaCode" v-if="index < 8" v-longtouch="{app:node,handler:longTouchHandler}">
          <div class="formIcon" :style="{color: node.ObjectId ? getAppIconColor(node.ObjectId) : colors[index%5]}">
            <span :class="node.IconCss"></span>
          </div>
          <div class="formName dp-font26">{{node.DisplayName}}</div>
        </div>
      </div>
      <template v-if="withoutContent">
        <div class="add-icon"><span class="aufont icon-base-plus"></span></div>
        <span v-if="isCustom !== null">{{emptyMsg}}</span>
      </template>
    </h3-card>
  </div>
</template>
<script>
import cx from 'classnames';
import longtouch from '../../directives/long-touch';
import H3Card from '../../../packages/widgets/h3-card-new/h3-card.vue';

const prefixCls = 'home-card-menu';
const iconColorsMap = ['#FF4384', '#7457FF', '#FF7527', '#05DB9B', '#FFCA00']; // 其实只取长度
const iconColorsLimit = 3;

export default {
  name: 'home-card-menu',
  components: {
    H3Card,
  },
  directives: {
    longtouch,
  },
  props: {
    className: String,
    H3Style: Object,
    commonNodes: Array,
    isCustom: Boolean,
  },
  data() {
    return {
      colors: ['#FF6851', '#FFA228', '#19A7FB', '#1CC972', '#FFA228'],
    };
  },
  methods: {
    onClickApp(node) {
      this.$emit('onClickApp', node);
    },
    longTouchHandler(form) {
      this.$emit('onLongTouch', form);
    },
    floatRight(index) {
      return index === 3 || index === 7 ? '' : 'formApp-right';
    },
    onClickCard() {
      if (this.withoutContent) {
        this.$emit('manage');
      }
    },
    getAppIconColor(objectId) {
      if (objectId) {
        const substr = objectId.substr(-iconColorsLimit);
        let long = 0;
        for (let i = 0; i < substr.length; i++) {
          const s = substr[i];
          const l = s.charCodeAt(0);
          long += l;
        }
        const left = long % iconColorsMap.length;
        return iconColorsMap[left];
      }
    },
  },
  computed: {
    wrapCls() {
      return cx(prefixCls, this.className);
    },
    withoutContent() {
      return !this.commonNodes || this.commonNodes.length < 1;
    },
    emptyMsg() {
      return this.isCustom ? '点击“+”或右上角管理可以设置常用表单哦~' : '当前未创建应用或表单';
    },
  },
};
</script>
<style lang="less">
@import '../../styles/common';
@baseFontSize: 75;
.px2rem(@name,@px) {
    @{name}: @px/@baseFontSize * 1rem;
}
.formRow{
  display: flex;
  flex-flow: wrap;
  flex-basis: 100%;
  align-items: flex-start;
  // .px2rem(padding-left, 5);
  // .px2rem(padding-right, 5);
  .formApp{
    display: flex;
    flex-direction: column;
    // flex-basis: 25%;
    // .px2rem(width, 144);
    align-items: center;
    .px2rem(margin-bottom, 32);
    .px2rem(margin-right, 17);
    .px2rem(margin-left, 17);
    .formIcon{
      display: flex;
      justify-content: center;
      align-items: center;
      span{
        .px2rem(font-size, 56);
      }
    }
    .formName{
      // .px2rem(font-size, 24);
      .px2rem(width, 130);
      text-overflow: ellipsis;
      text-align: center;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      display: -webkit-box;
      color: #333333;
      .px2rem(margin-top, 8);
      word-break: break-all;
    }
  }
}
.formBody{
  .px2rem(padding-top, 32) !important;
  .px2rem(padding-bottom, 0) !important;
  display: flex;
  .px2rem(padding-right, 17)!important;
  .px2rem(padding-left, 17)!important;
}
</style>


