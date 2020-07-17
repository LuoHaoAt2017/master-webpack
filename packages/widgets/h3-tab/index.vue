<template>
  <div class="h3-apps-tab">
    <div class="noscroll-bar">
      <h3-tab-flow ref="flowTab" bar-active-color="#108ee9" :line-width="2" :borderBottom="false">
        <h3-tab-item :selected="app[assoKey] === assoKeyValue" 
        v-for="(app, index) in apps" :key="index" @click.native="onClick(index)">
        {{app.DisplayName}}
        </h3-tab-item>
      </h3-tab-flow>
    </div>
    <template v-if="apps.length > 2">
      <div class="h3-apps-tab-more" @click="onToggle">
        <h3-icon type="same-size-o" style="color: #999;"></h3-icon>
      </div>
      <div class="h3-apps-tab-shadow"></div>
    </template>
  </div>
</template>

<script>
import { H3TabFlow, H3TabItem } from '../../components/h3-tab/';
import H3Icon from '../../components/h3-icon/index.vue';
import fixedtop from '../../directives/fixedTop';


export default {
  name: 'h3-apps-tab',
  props: {
    apps: {
      type: Array,
      required: true,
      default: () => [],
      validator: val => val.length > 0,
    },
    assoKey: {
      type: String, // 关联key
      required: true,
    },
    active: {
      type: [String, Number],
    },
    onChange: Function,
    toggle: Function,
  },
  components: {
    H3TabFlow,
    H3TabItem,
    H3Icon,
  },
  directives: {
    fixedtop,
  },
  data() {
    return {
      assoKeyValue: '',
    };
  },
  created() {
    if (!this.active) {
      this.assoKeyValue = this.apps[0][this.assoKey];
    }
  },
  mounted() {
    this.$nextTick(() => {
      let width = 0;
      const items = this.$refs.flowTab.$el.children;
      for (let i = 0, len = items.length - 1; i < len; i += 1) {
        width += items[i].offsetWidth;
      }
      this.$refs.flowTab.$el.style.width = `${width + 20}px`;
    });
  },
  methods: {
    onClick(index) {
      const val = this.apps[index][this.assoKey];
      if (this.onChange) {
        this.onChange(val);
      } else {
        this.$emit('onChange', val);
      }
    },
    onToggle() {
      if (this.toggle) {
        this.toggle();
      } else {
        this.$emit('toggle');
      }
    },
  },
  watch: {
    active(val) {
      if (val) {
        this.assoKeyValue = val;
      }
    },
  },
};
</script>

<style lang="less" >
@import '../../styles/mixins.less';
.h3-apps-tab {
  position: relative;
  padding-right: 42px !important;
  height: 44px;
  .hairline('bottom', #ddd);
  overflow: hidden;
}
.h3-fixed-top {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 900;
  box-sizing: border-box;
}
.sticky {
  position: -webkit-sticky;
  position: -moz-sticky;
  position: -ms-sticky;
  position: -o-sticky;
  position: sticky;
}
.h3-apps-tab-more {
  position: absolute;
  top: 0;
  right: 0;
  width: 42px;
  height: 44px;
  line-height: 44px;
  text-align: center;
  background-color: #fff;
  opacity: 0.96;
  z-index:1;
  // .hairline('bottom', #ddd);
  // .hairline('left', #ddd);
}
// 两侧变淡阴影
.h3-apps-tab-shadow{
    position: absolute;
    top: 0;
    right:0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-top: 7px;
    margin-right: 12px;
    box-shadow: -3px 0 13px rgba(0,0,0,0.25);
  }
.noscroll-bar {
  -ms-overflow-style:none;
  overflow:-moz-scrollbars-none;
  padding-bottom: 5px;
  width: 100%;
  overflow:scroll;
  -webkit-overflow-scrolling:touch;
}
.noscroll-bar::-webkit-scrollbar{
  width: 0;
  display: none;
}
</style>



