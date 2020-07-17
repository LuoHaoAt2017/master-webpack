<template>
  <h3-card :title="getName(`${data.DispalyName}-${data.GroupDisplayName}`)" 
  :hasLine="hasLine"
  className="h3-card-grid" >
      <h3-grid :rowNums="rowNums" :colNums="colNums" :hasLine="hasLine">
        <h3-grid-item v-for="(item, index) in data.Childrens" 
        :key="`${index}_gridItem`" 
        :rowNum="getRowNum(index)" 
        :colNum="getColNum(index)" 
        activeCls="h3-grid-item">
          <div class="h3-grid-item-content" @click="goApplyLists(item)">
            <div class="h3-grid-item-inner-content">
              <span class="iconwrap icon-back2">
                 <i :class="`font-icon ${item.IconCss}`"></i>
              </span>
              <div class="h3-grid-text" v-html="getName(item.DisplayName)"></div>
            </div>
          </div>
        </h3-grid-item>
      </h3-grid>
    </h3-card>
</template>
<script>
import h3Card from './h3-card';
import { H3Grid, H3GridItem } from '../h3-grid/index';

export default {
  name: 'h3-card-grid',
  components: {
    h3Card,
    H3Grid,
    H3GridItem,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    colNums: {
      type: Number, // 显示多少列
      default: 4,
    },
    highLightText: String,
    data: Object,
    hasLine: Boolean,
  },
  data() {
    return {
    };
  },
  created() {
  },
  mounted() {

  },
  updated() {

  },
  methods: {
    getRowNum(index) {
      if (index === 0) {
        return 0;
      }
      return Math.ceil((index + 1) / this.colNums) - 1;
    },
    getColNum(index) {
      // console.log('getcolnum:', index, index % this.colNums);
      return index % this.colNums;
    },
    getName(val) {
      if (this.highLightText) {
        return val.replace(this.highLightText, `<span class='h3-card-grid-highlight'>${this.highLightText}</span>`);
      }
      return val;
    },
    // 点击图标跳转接口，参数为当前菜单信息
    goApplyLists(menu) {
      this.$emit('goApplyLists', menu);
    },
  },
  computed: {
    // 计算会显示多少行
    rowNums() {
      if (!this.data || this.data.Childrens.length === 0) {
        return 0;
      }
      return Math.ceil(this.data.Childrens.length / this.colNums);
    },
  },
  watch: {
  },
};
</script>
<style lang="less">
@prefixCls: h3-card-grid;

.@{prefixCls} {
  .h3-card-body {
    padding-top:0;
  }
  .h3-card-grid-highlight {
    color:#1890FF;
  }
  .h3-grid-item {
    .iconwrap {
      display:inline-block;
      width:47px;
      height: 47px;
      line-height:50px;
      border-radius:10px;
      .font-icon {
        color: #fff;
      }
    }
    .icon-back2 {
      background-color: #1890FF;
    }
  }
}

</style>


