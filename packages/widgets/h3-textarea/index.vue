<template>
<!--  :class='{"animated pulse":errorBol}' -->
    <div id="form-text-area" >
        <h3Textarea :required="true" :placeholder ="placeholder" :maxLength ="maxLength" :clear= "clear" 
        :showCount = "showCount" :controlStyle="textareaStyle" :hasBottomLine="hasBottomLine" id="h3-comment-area"></h3Textarea>
    </div>
</template>

<script>
import h3Textarea from '../../components/h3-textarea/index.vue';

export default {
  name: 'h3-comment-area',
  props: {
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
      default() {
        return {
          paddingTop: '15px',
          paddingBottom: '15px',
        };
      },
    },
    hasBottomLine: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    h3Textarea,
  },
};
</script>

<style lang="less">
#h3-comment-area{
  width: 100%;
  box-sizing: border-box;
  color:#999;
}


</style>
