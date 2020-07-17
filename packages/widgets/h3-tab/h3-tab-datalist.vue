<template>
  <div class="noscroll-bar">
    <h3-tab-flow ref="flowTab" bar-active-color="#108ee9" :line-width="2" :borderBottom="false">
      <h3-tab-item v-for="(app, index) in apps" :key="index" 
        @click.native="onClick(app,index)" :selected="index === selectedIndex" >
      {{app.DisplayName}}
      </h3-tab-item>
    </h3-tab-flow>
  </div>
</template>

<script>
import { H3TabFlow, H3TabItem } from '../../components/h3-tab/';
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
    active: {
      type: [String, Number],
    },
    onChange: Function,
    toggle: Function,
    selectedIndex: {
      type: Number,
      default: 0,
    },
  },
  components: {
    H3TabFlow,
    H3TabItem,
  },
  directives: {
    fixedtop,
  },
  data() {
    return {
    };
  },
  created() {
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
    onClick(app, index) {
      if (this.onChange) {
        this.onChange(app, index);
      } else {
        this.$emit('onChange', {
          App: app,
          Index: index,
        });
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
  },
};
</script>

<style lang="less" >
@import '../../styles/mixins.less';

.noscroll-bar {
  -ms-overflow-style:none;
  overflow:-moz-scrollbars-none;
  // width: 100%;
  box-sizing: border-box;
  overflow-x: scroll;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  background: #FFFFFF;
}
.noscroll-bar::-webkit-scrollbar{
  width: 0;
  display: none;
}
</style>



