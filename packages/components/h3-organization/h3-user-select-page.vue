<template>
  <h3-user-select :routeParams='routeParams' :fromRoute='fromRoute' :entry-type="entryType" :eventMark = "eventMark"></h3-user-select>
</template>
<script>
import h3UserSelect from './h3-user-select';

export default {
  name: 'h3-user-select-page',
  components: {
    h3UserSelect,
  },
  props: {
  },
  data() {
    return {
      routeParams: '',
      fromRoute: '',
      eventMark: '',
      entryType: 'Other',
      isFlter: '',
    };
  },
  created() {
    this.routeParams = this.$route.params;
    this.eventMark = this.$route.params.eventMark;
    this.isFilter = this.routeParams.isFilter;
  },
  activated() {
    this.routeParams = this.$route.params;
    this.eventMark = this.$route.params.eventMark;
    this.isFilter = this.routeParams.isFilter;
  },
  mounted() {

  },
  updated() {

  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.fromRoute = from.name;
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy();
    next();
  },
  methods: {

  },
  computed: {

  },
  watch: {
  },
};
</script>

