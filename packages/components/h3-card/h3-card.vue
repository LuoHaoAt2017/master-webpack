<template>
  <div :class="wrapCls" :style="cardStyle">
    <card-header 
      :className="headerClassName" 
      :h3Style="headerStyle"
      :title="title"
      :subTitle="subTitle"
      :thumdStyle="thumbStyle"
      :hasExtra="hasHeaderExtra">
      <slot name="headerContent"></slot>
      <slot name="headerThumb" slot="thumb"></slot>
      <slot name='headerExtra' slot='extra'></slot>
    </card-header>
    <card-body :className="bodyClassName" :h3Style="bodyStyle" >
      <slot></slot>
    </card-body>
    <card-footer :className="footClassName" :h3Style="footStyle">
      <slot name="footerContent" slot='content'></slot>
      <slot name='footerExtra' slot='extra'></slot>
    </card-footer>
  </div>
</template>
<script>
import cx from 'classnames';
import cardHeader from './h3-card-header.vue';
import cardBody from './h3-card-body.vue';
import cardFooter from './h3-card-footer.vue';

const prefixCls = 'h3-card';
export default {
  name: 'h3-card',
  components: {
    cardHeader,
    cardBody,
    cardFooter,
  },
  props: {
    full: false,
    className: String,
    thumbStyle: Object,
    title: String,
    subTitle: String,
    headerClassName: String,
    headerStyle: Object,
    cardBodyStyle: Object,
    hasHeaderExtra: Boolean,
    bodyClassName: String,
    bodyStyle: Object,
    footClassName: String,
    footStyle: Object,
    hasLine: {
      type: Boolean,
      default: true,
    },
    cardStyle: Object,
  },
  data() {
    return {
    };
  },
  methods: {},
  computed: {
    wrapCls() {
      return cx(prefixCls, this.className, {
        [`${prefixCls}-line`]: this.hasLine,
        [`${prefixCls}-full`]: this.full,
      });
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
@import '../../styles/themes/default';
@import '../../styles/h3-ui/h3-card';
</style>


