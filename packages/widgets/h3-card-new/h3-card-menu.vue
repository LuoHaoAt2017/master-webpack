<template>
  <div :class="wrapCls">
    <h3-card
      :has-body-content="!withoutContent"
      body-class-name="formBody">
      <div class="formRow" v-if="!withoutContent">
        <div class="formApp"
        :class="floatRight(index)"
        @click="onClickApp(node)"
        v-for="(node,index) in commonNodes"  :key="node.SchemaCode" v-if="index < 8">
          <div class="formIcon" :style="{color:node.Background}">
            <span :class="node.IconCss"></span>
          </div>
          <div class="formName">{{node.DisplayName}}</div>
        </div>
      </div>
      <template v-if="withoutContent">
        <div class="add-icon"><span class="aufont icon-base-plus" @click="settingFavority"></span></div>
        点击“+”或右上角管理可以设置常用表单哦~
      </template>
    </h3-card>
  </div>
</template>
<script>
import cx from 'classnames';
import H3Title from '../h3-title/h3-title.vue';
import H3Card from './h3-card.vue';

const prefixCls = 'h3-card-menu';
export default {
  name: 'h3-card-menu',
  components: {
    H3Title,
    H3Card,
  },
  props: {
    className: String,
    H3Style: Object,
    commonNodes: Array,
  },
  data() {
    return {
    };
  },
  methods: {
    onClickApp(node) {
      this.$emit('onClickApp', node);
    },
    settingFavority() {
      if (!this.withoutContent) { return; }
      this.$emit('settingFavority');
    },
    floatRight(index) {
      return index === 3 || index === 7 ? '' : 'formApp-right';
    },
  },
  computed: {
    wrapCls() {
      return cx(prefixCls, this.className);
    },
    withoutContent() {
      return this.commonNodes === undefined || this.commonNodes.length === undefined || this.commonNodes.length < 1;
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@import '../../styles/themes/default';
@import '../../styles/h3-ui/h3-card';

.formRow{
  display: flex;
  flex-flow: wrap;
  flex-basis: 100%;
  align-items: center;
  .formApp{
    display: flex;
    flex-direction: column;
    // flex-basis: 25%;
    .px2rem(width, 144);
    align-items: center;
    .px2rem(margin-bottom, 32);
    .formIcon{
      display: flex;
      justify-content: center;
      align-items: center;
      span{
        .px2rem(font-size, 54);
      }
    }
    .formName{
      .px2rem(font-size, 24); 
      .px2rem(width, 144);
      white-space: nowrap;
      text-overflow: ellipsis;
      text-align: center;
      overflow: hidden;
      color: #333333;
      .px2rem(margin-top, 8);
    }
  }
  .formApp-right{
    .px2rem(margin-right, 22);
  }

}
.formBody{
  .px2rem(padding-top, 32);
  .px2rem(padding-bottom, 0) !important;
  display: flex;
}
.add-icon{
  display: flex;
  align-items: center;
  justify-content: center;
  .px2rem(width, 54);
  .px2rem(height, 54);
  .px2rem(margin-bottom, 20);
  .hairline('all', #E4E4E4, 6px);
  span{
    .px2rem(font-size, 34);
  }
}
</style>


