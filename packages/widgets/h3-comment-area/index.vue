<template>
  <div :class="wrapCls">
    <h3Textarea 
    :required="true" :placeholder ="placeholder" :maxLength ="maxLength" :clear= "clear" 
    :showCount = "showCount" :controlStyle="textareaStyle" :className="textareaClassName"
    :hasBottomLine="hasBottomLine"
    :countClsName="countClsName"
    >
    </h3Textarea>
  </div>
</template>

<script>
import h3Textarea from '../../components/h3-textarea/index.vue';

import cx from 'classnames';
const prefixCls = 'h3-comment-area';

export default {
  name: 'h3-comment-area',
  props: {
    commentAreaClassName: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    maxLength: {
      type: Number,
      default: 140,
    },
    showCount: {
      type: Boolean,
      default: false,
    },
    clear: {
      type: Boolean,
      default: true,
    },
    textareaStyle: {
      type: Object,
    },
    textareaClassName: {
      type: String,
    },
    hasBottomLine: {
      type: Boolean,
      default: false,
    },
    countClsName: {
      type: String,
    },
  },
  components: {
    h3Textarea,
  },
  computed: {
    wrapCls() {
      return cx(`${prefixCls}`, this.commentAreaClassName);
    },
  },
};
</script>

<style lang="less">
@import '../../styles/mixins';

.h3-comment-area{
  width: 100%;
  box-sizing: border-box;
  color:#999;
  .px2rem(height, 324);
}


</style>
