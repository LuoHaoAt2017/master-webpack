<template>
  <div class="filter-item">
    <div class="title">{{title}}</div>
    <div class="container">
      <div v-for="(item,index) in items" :key="index"  
      :class="setClass(item)" @click="toggleActiveStatus(item, index)">
          <span class="name">{{item.DisplayName}}</span>
          <span v-if="item.Count && item.Count >0">({{item.Count}})</span>
          <!-- <div class="" v-show=""></div> -->
      </div>
    </div>
  </div>
</template>
<script>
import cx from 'classnames';

export default {
  name: 'h3-filter-item',
  props: {
    group: {
      type: String,
      requires: true,
    },
    title: {
      type: String,
      requires: true,
    },
    items: {
      type: Array, // { displayName, code, count}
      requires: true,
      validator: val => val && val.length > 0,
    },
    cols: {
      type: Number,
    },
  },
  mounted() {
    this.init();
  },
  data() {
    return {
      activeIndex: 0,
    };
  },
  methods: {
    init() {
      if (this.items && this.items.length > 0) {
        this.items[0].Active = true;
        this.activeIndex = 0;
      }
    },
    toggleActiveStatus(item, index) {
      this.activeIndex = index;
      const tmp = item;
      for (let i = 0, len = this.items.length; i < len; i += 1) {
        this.items[i].Active = false;
      }
      tmp.Active = true;
    },
    setClass(item) {
      return cx(`layout-${this.cols}-col`, {
        active: item.Active,
      });
      // if (this.column && this.column === 2) {
      //   return active ? 'sheet active' : 'sheet';
      // } else if (this.column && this.column === 3) {
      //   return active ? 'instance-state active' : 'instance-state';
      // }
      // return active ? 'active' : 'sheet';
    },
    getValue() {
      return this.items[this.activeIndex];
    },
    reset() {
      for (let i = 0, len = this.items.length; i < len; i += 1) {
        this.items[i].Active = false;
      }
      this.items[0].Active = true;
      this.activeIndex = 0;
    },
  },
};
</script>
<style lang="less" scoped>
@import '../../../../packages/styles/mixins';

.filter-item {
  .px2rem(padding,24);
  .title {
    text-align: left;
    color: #2c3038;
    .px2rem(font-size,30);
  }
  .container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    // flex-basis: 50%;
    border-bottom: 1px solid #EEEEEE;
    .px2rem(padding-bottom,30);
    div {
      .px2rem(height,72);
      .px2rem(line-height,72);
      .px2rem(margin-right,20);
      .px2rem(margin-top,20);
      .px2rem(border-radius,10);
      color: #333333;
      background-color: #F8F8F8;
      text-align: center;
      &.layout-2-col {
        .px2rem(width,258);
        span {
          display: inline-block;
        }
        .name {
          max-width: 64%;
          height: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          vertical-align: top;
        }
      }
      &.layout-2-col:nth-child(2n){
        margin-right: 0;
      }
      &.layout-3-col {
        .px2rem(width,164);
      }
      &.layout-3-col:nth-child(3){
        margin-right: 0;
      }

      &.active {
        color:  #1890FF;
        background-color: #EAF4FE;
        .px2rem(border-radius,6);
        background-image:url('../../../assets/img/selected.png');
        background-position: bottom right;
        background-repeat: no-repeat;
        .px2rem(background-size,30);
      }
    }
  }
}
</style>


