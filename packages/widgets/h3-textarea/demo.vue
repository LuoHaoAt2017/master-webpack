<template>
  <H3TextArea :placeholder="placeholder" :maxLength="maxLength" :clear="clear" :showCount="showCount" :hasBottomLine="hasBottomLine"></H3TextArea>
</template>
<script>
import H3TextArea from './index.vue';

export default {
  components: {
    H3TextArea,
  },
  data() {
    return {
      placeholder: '请输入审核结果',
      maxLength: 200,
      clear: true,
      showCount: false,
      hasBottomLine: false,
    };
  },
};
</script>
<style lang="less">

</style>


