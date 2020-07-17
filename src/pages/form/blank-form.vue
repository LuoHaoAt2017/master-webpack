<template>

</template>
<script>
export default {
  name: 'blankForm',
  data() {
    return {};
  },
  activated() {
    this.$router.replace({
      name: 'formPage',
      params: {
        schemaCode: this.$route.params.schemaCode,
        bizObjectId: this.$route.params.bizObjectId,
        mode: this.$route.params.mode,
        isExternalForm: this.$route.params.isExternalForm,
      },
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$store.state.excludeComp = [];
    this.$destroy();
    next();
  },
  methods: {},
};
</script>

