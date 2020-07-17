<template>
  <div>
    <div class="nav">
      <tab  :active="activeCode"  ref="tabs"  assoKey="AppCode" :toggle="onToggleAppGroupsShow" :apps="tabApps" :onChange="scrollToAppPosition" v-if="tabApps.length>1"></tab>    
    </div>
  </div>
</template>
<script>
import H3Tab from '../../widgets/h3-tab/index';

export default{
  components: {
    H3Tab,
  },
  props: {},
  data() {
    return {
      apps: [{
        
      }],
    };
  },
  methods: {},
};
</script>
<style lang="less">

</style>

