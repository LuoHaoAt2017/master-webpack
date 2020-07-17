<template>
  <div>
    <h3-card
      :has-body-content="!noContent"
      :header-badge="true">
      <template slot="headerTitle">
        我的报销申请
      </template>
      <template slot="headerExtra">
        11:32
      </template>
      <template v-if="!noContent" >
        <h3-approve-trace :approve-info="approveTrace"></h3-approve-trace>
      </template>
      <template v-if="noContent">
        <h3-icon
          class="location-icon" 
          size='md' 
          color="#6abf47"
          type='cross'>
        </h3-icon>
        暂时还没有内容哦~
      </template>
      <template slot="footerContent">
        <h3-button-group :buttonGroup="buttonArray2" ></h3-button-group>
      </template>
    </h3-card>
    </div>
</template>

<script>
import H3Card from '../h3-card-new/h3-card.vue';

export default {
  components: {
    H3Card,
  },
  data() {
    return {
      approveTrace: {
        name: '张三',
        icon: 'https://cn.vuejs.org/images/logo.png',
        time: '666',
      },
      buttonArray2: [{
        title: '发起流程',
        type: '',
        size: '',
        onClick: this.onClickExtra,
      },
      ],
    };
  },
  mounted() {
  },
  activated() {
  },
  methods: {
    onClickIcon:function(e){console.log(e)},
    onClickExtra:function(e){alert('this is  alone onClick Extra')},
    onClickExtras:function(index){alert('this is  '+ index +'th onClick Extra')}
  },
};
</script> 
<style lang="less" scoped>
</style>