<template>
    <div>
      <h3-title 
        title="默认titleSize：md，冇icon，冇extra">
      </h3-title>
      <h3-title 
        title="这是size=xxs的title"
        size="xxs">
      </h3-title>
      <h3-title 
        title="这是size=xs的title"
        size="xs">
      </h3-title>
      <h3-title 
        title="这是size=sm的title"
        size="sm">
      </h3-title>
      <h3-title 
        title="这是size=lg的title"
        size="lg">
      </h3-title>
      <h3-title 
        title="titleSize:xs icon在上，有背景色"
        size="xs"
        iconDirection="top">
        <h3-icon 
          class="location-icon" 
          size='md' 
          color="#0e80d2"
          type='cross' 
          slot="icon">
        </h3-icon>
      </h3-title>
      <h3-title 
        title="titleSize:xs icon在右，有背景色"
        size="xs"
        iconDirection="right">
        <h3-icon 
          class="location-icon" 
          size='md' 
          color="#E5E5E5"
          type='cross' 
          slot="icon">
        </h3-icon>
      </h3-title>
      <h3-title 
        title="titleSize:xs icon在下，有背景色"
        size="xs"
        iconDirection="bottom">
        <h3-icon 
          class="location-icon" 
          size='md' 
          color="#6abf47"
          type='cross' 
          slot="icon">
        </h3-icon>
      </h3-title>

      <h3-title 
        title="审批追踪"
        size="xs"
        iconDirection="left">
        <h3-icon 
          class="location-icon" 
          size='lg' 
          color="#ff5b05"
          type='cross' 
          slot="icon">
        </h3-icon>
        <template slot="extra" >
          <span 
          v-for="(item,index) in extraArr" :key="index"
          @click="onClickExtras(index)">
          {{ item.title}} 
          <b v-if="index!= extraArr.length -1">|</b>
        </span>
        </template>
      </h3-title>

      <h3-title 
        title="可点击的icon"
        size="md"
        iconDirection="left">
        <h3-icon 
          class="location-icon" 
          size='md' 
          color="#6abf47"
          type='cross'
          @onClick='onClickIcon' 
          slot="icon">
        </h3-icon>
        <div slot="extra" @click="onClickExtra"> 测试extra</div>
      </h3-title>

      <h3-title 
        title="新的可点击的icon"
        size="md"
        iconDirection="left"
        iconType="cross"
        @onIconClick="onClickIcon"
        iconColor="#6abf47">
        <div slot="extra" @click="onClickExtra"> 测试extra</div>
      </h3-title>
    </div>
</template>

<script>
import H3Title from './h3-title.vue';
import H3Icon from '../h3-icon/index.vue';

export default {
  components: {
    H3Title, H3Icon,
  },
  data() {
    return {
      extraArr: [
        { title: '审批追踪', action: 'fn' },
        { title: '常用应用', action: 'fn' },
      ],
    };
  },
  mounted() {
  },
  activated() {
  },
  methods: {
    onClickIcon: () => { console.log('click Icon'); },
    onClickExtra: () => { console.log('this is  alone onClick Extra'); },
    onClickExtras: (index) => { console.log(index); },
  },
};
</script> 
<style lang="less" scoped>
</style>