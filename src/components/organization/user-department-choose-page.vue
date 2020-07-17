<template>
  <div class="user-deparment-choose-page">
    <!-- <x-header class="header" v-if="!$store.state.corpId" :left-options="{preventGoBack:true}" @on-click-back="goBack()">
        选择</x-header> -->
      <layout title="选择" :leftOptions="{ preventGoBack: true }" @on-click-back="goBack">
      <user-department-choose :routeParams='routeParams' :fromRoute='fromRoute' :entry-type="entryType" :eventMark = "eventMark"></user-department-choose>
      </layout>
  </div>
</template>
<script>
import { UserSelectEntryType } from '../../config/common';
import userDepartmentChoose from './user-department-choose-node';

export default {
  name: 'userDepartmentChoosePage',
  components: {
    userDepartmentChoose,
  },
  data() {
    return {
      routeParams: '',
      fromRoute: '',
      eventMark: '',
      entryType: UserSelectEntryType.Other,
      isFlter: '',
    };
  },
  created() {
    this.routeParams = this.$route.params;
    this.eventMark = this.$route.params.eventMark;
    this.isFilter = this.routeParams.isFilter;
  },
  activated() {

  },
  beforeRouteEnter(to, from, next) {
    next((vms) => {
      const vm = vms;
      vm.fromRoute = from.name;
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy();
    next();
  },
  methods: {
    goBack() {
      this.$router.goBack();
    },
  },
};
</script>
<style lang="less">
.user-deparment-choose-page{
  height: 100%;
}
</style>


