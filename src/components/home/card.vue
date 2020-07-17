<template>
    <div class="card">
        <slot name="header">
           
        </slot>
        <slot name="content">
            
        </slot>
        <slot name="footer">

        </slot>
        <slot name="backdrop" class="backdrop"></slot>
    </div>
</template>
<script>
// eslint yjh
export default {
  data() {
    return {
    };
  },
  props: [
  ],
  components: {
  },
  created() {
  },
  methods: {
  },
};
</script>
<style lang="less">
@import '../../assets/css/home.less';  
</style>