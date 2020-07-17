<template>
  <div class="subform-tab">
    <div class="tab-flow-container">
      <div class="h3-tab-flow-subform" ref="flowTab">
        <div v-for="(app, index) in apps" :key="index" class="h3-tab-item" 
          @click="onClick(app,index)" :class="{'subform-tab-selected' : index === value , 'subform-tab-mistake' : app.mistake}" >
          {{index+1}}
        </div>
      </div>
      <div class="subform-tab-plus" @click="onPlusClick">
        <i class="icon aufont icon-base-plus"></i>
      </div>
    </div>
    <div class="subform-tab-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { H3TabFlow, H3TabItem } from '../../components/h3-tab/';


export default {
  name: 'h3-tab-subform',
  props: {
    apps: {
      type: Array,
      required: true,
      default: () => [],
      // validator: val => val.length > 0,
    },
    active: {
      type: [String, Number],
    },
    onChange: Function,
    toggle: Function,
    value: {
      type: Number,
      default: 0,
    },
  },
  components: {
    H3TabFlow,
    H3TabItem,
  },
  data() {
    return {
    };
  },
  created() {
  },
  mounted() {
    // this.$nextTick(() => {
    //   let height = 0;
    //   const items = this.$refs.flowTab.children;
    //   for (let i = 0, len = items.length; i < len; i += 1) {
    //     height += items[i].offsetHeight;
    //   }
    //   this.$refs.flowTab.style.height = `${height}px`;
    // });
  },
  methods: {
    onClick(app, index) {
      if (this.onChange) {
        this.onChange(app, index);
      } else {
        this.$emit('onChange', {
          App: app,
          Index: index,
        });
        this.$emit('input', index);
      }
    },
    onToggle() {
      if (this.toggle) {
        this.toggle();
      } else {
        this.$emit('toggle');
      }
    },
    onPlusClick() {
      this.$emit('onPlusClick');
    },
  },
  watch: {
  },
};
</script>

<style lang="less" >
@import '../../styles/mixins.less';

.noscroll-bar {
  // -ms-overflow-style:none;
  // overflow:-moz-scrollbars-none;
  // width: 100%;
  // box-sizing: border-box;
  // overflow-x: hidden;
  // overflow-y: hidden;
  // -webkit-overflow-scrolling: touch;
  background: #FFFFFF;
  position: absolute;
  top: 0;
  bottom: 0;
}
.noscroll-bar::-webkit-scrollbar{
  width: 0;
  display: none;
}
.subform-tab{
  width: 100%;
  display: flex;
  -ms-overflow-style:none;
  overflow:-moz-scrollbars-none;
  box-sizing: border-box;
  // overflow-x: hidden;
  // overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  height: 100%;
  background: #f8f8f8;
  position: absolute;
  top: 0;
  bottom: 0;
  overflow: hidden;
  .tab-flow-container{
    width: 45px;
    height: 100%;
    position: absolute;
    overflow-y: hidden;
  }
  .h3-tab-flow-subform{
    // position: absolute;
    height: 100%;
    overflow-y: scroll;
    width: 45px;
    padding-bottom: 45px;
  }
  .h3-tab-flow-subform .h3-tab-item {
    display: inline-block;
    padding: 0;
    width: 45px;
    height: 45px;
    text-align: center;
    line-height: 45px;
    font-size: 17px;
    color: #999;
    background-color: #f8f8f8;
  }
  .h3-tab-flow-subform .h3-tab-item.subform-tab-selected{
    background: #fff;
    color: #1890ff;
  }
  .h3-tab-flow-subform  .subform-tab-mistake{
    color: #F5222D !important;
  }
  
  .subform-tab-plus{
    z-index: 5;
    width: 45px;
    height: 45px;
    background: #f8f8f8;
    position: absolute;
    bottom: 0;
    text-align: center;
    line-height: 45px;
    .icon{
      font-size: 16px;
      color: #1890ff;
    }
  }
}
.subform-tab-content{
  flex: 1;
  background: #fff;
  position: absolute;
  left: 45px;
  top: 0;
  height: 100%;
  overflow: scroll;
  width: calc(~'100% - 45px');
}
.subform-tab::-webkit-scrollbar{
  width: 0;
  display: none;
}
</style>



