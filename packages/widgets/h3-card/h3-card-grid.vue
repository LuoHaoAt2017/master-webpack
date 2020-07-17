<template>
<div ref="h3CardGrid" >
  <h3-card v-if="data" :title="getTitleName(data === null ? '' : data.DisplayName,data === null ? '' :data.GroupDisplayName)" 
  :subTitle ="getSubtitle(data === null ? '' : data.DisplayName,data === null ? '' : data.subTitle)"
  :hasLine="hasLine"
  :className="cardCls"
  ref="h3Grid"
  :headerStyle="cardHeaderStyle"
  :bodyStyle="cardBodyStyle"
  :cardStyle = "cardStyle"
  >
    <h3-grid :rowNums="rowNums()" :colNums="colNums" :hasLine="hasLine" >
      <h3-grid-item v-for="(item, index) in data.Childrens" 
      :key="`gridItem_${index}_${item.Code}`" 
      :style="gridItemStyle" 
      :itemHeight="itemHeight"
      activeCls="h3-grid-item"
      class="list-complete-item"
      >
        <div class="h3-grid-item-content" 
          @click="goApplyLists(item)" 
          v-touch="{activeClass: 'h3-grid-item'}"
          :style="gridItemContentStyle"
          :class="[item.restore ? 'restore' :'', item.Active ?'active':'' ]"
          >
          <div class="h3-grid-item-inner-content" @click.stop="addToRecent(item, index)">
            <span class="iconwrap icon-back2" @click.stop="addToRecent(item, index)">
              <i :class="getAppIconClass(item,index)" @click.stop="addToRecent(item, index)"></i>
            </span>
            <div class="h3-grid-text" v-html="getName(item && item.DisplayName)" @click.stop="addToRecent(item,index)"></div>
          </div>
        </div>
      </h3-grid-item>
    </h3-grid>
  </h3-card>
  <h3-white-space style="background-color:#F8F8F8;height:1px" v-show="showWhiteSpace"/>
</div>
</template>
<script>
import cx from 'classnames';
import h3Card from '../../components/h3-card/h3-card.vue';
import { H3Grid, H3GridItem } from '../../components/h3-grid/index';

import h3WhiteSpace from '../../components/h3-white-space/index.vue';
import H3Icon from '../../components/h3-icon/index.vue';
import touch from '../../directives/touch';

const appIconColorArray = ['app-icon-color-1', 'app-icon-color-2', 'app-icon-color-3', 'app-icon-color-4'];

export default {
  name: 'h3-card-grid',
  components: {
    h3Card,
    H3Grid,
    H3GridItem,
    h3WhiteSpace,
    H3Icon,
  },
  directives: {
    touch,
  },
  props: {
    prefixCls: {
      type: String,
      default: 'h3-card-grid',
    },
    title: {
      type: String,
      default: '',
    },
    colNums: {
      type: Number, // 显示多少列
      default: 4,
    },
    highLightText: String,
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    hasLine: Boolean,
    hasMultiApps: Boolean,
    showWhiteSpace: {
      type: Boolean,
      default: true,
    },
    appState: {
      type: Number,
      default: 0,
    },
    cardHeaderStyle: Object,
    cardBodyStyle: Object,
    cardStyle: Object,
    itemHeight: Number,
    gridItemStyle: Object,
    gridItemContentStyle: Object,
  },
  data() {
    return {
      hasChanged: false,
    };
  },
  methods: {
    randomFrom(lowerValue, upperValue) {
      let random = upperValue - lowerValue;
      random += 1;
      random *= Math.random();
      random += lowerValue;
      return Math.floor(random);
    },
    // 计算会显示多少行
    rowNums() {
      if (!this.data || !this.data.Childrens || this.data.Childrens.length === 0) {
        return 0;
      }
      return Math.ceil(this.data.Childrens.length / this.colNums);
    },
    getChildrens() {
      return this.data === null ? [] : this.data.Childrens;
    },
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
      // 1.判断是否超过六个字符
      // 2.超过六个字符，且索引>6
      // 3.超过六个字符，索引等于6
      const length = val.length;
      if (this.highLightText) {
        const index = val.indexOf(this.highLightText);
        if (length <= 6) {
          return val.replace(this.highLightText, `<span class='h3-card-grid-highlight'>${this.highLightText}</span>`);
        } else if (index > 6) {
          let result = val.substr(0, 5);
          result = `${result}<span class='h3-card-grid-highlight'>...</span>`;
          return result;
        }
        let result = val.substr(0, index);
        if (this.highLightText.length + index >= 6) {
          /* 如 "超过六个表单"表+...需要高亮 index:4, substr(4,6) */
          const rightLetter = val.substr(index, 6 - 1 - index);
          result = `${result}<span class='h3-card-grid-highlight'>${rightLetter}...</span>`;
        } else {
          const rightLetter = val.substr(index, 6 - 1 - index).replace(this.highLightText, `<span class='h3-card-grid-highlight'>${this.highLightText}</span>`);
          result = `${result}${rightLetter}...`;
        }
        return result;
      }
      if (length > 6) {
        return `${val.substr(0, 5)}...`;
      }
      return val;
    },
    getTitleName(appName, groupName) {
      if (appName === undefined && groupName === undefined) {
        return '';
      }
      if (groupName === undefined) {
        return appName.replace(this.highLightText, `<span class='h3-card-grid-highlight'>${this.highLightText}</span>`);
      }
      return `${appName}-${groupName}`.replace(this.highLightText, `<span class='h3-card-grid-highlight'>${this.highLightText}</span>`);
    },
    getSubtitle(appName, groupName) {
      if (groupName === undefined) {
        return '';
      }
      if (appName === undefined && groupName === undefined) {
        return '';
      }
      if (groupName === undefined) {
        return appName.replace(this.highLightText, `<span class='h3-card-grid-highlight'>${this.highLightText}</span>`);
      }
      return `${groupName}`.replace(this.highLightText, `<span class='h3-card-grid-highlight'>${this.highLightText}</span>`);
    },
    getAppIconClass(item, index) {
      let classStr = `font-icon ${item.IconCss}`;
      classStr = `${classStr} ${appIconColorArray[this.randomFrom(index, index + 3) % 4]}`;
      return classStr;
    },
    // 点击图标跳转接口，参数为当前菜单信息
    goApplyLists(menu) {
      this.$emit('goApplyLists', menu);
    },
    removeRectApp(item) { // 事件属于本组件 h3-card-grid
      this.$emit('removeRectApp', item);
    },
    addToRecent(item) {
      if (item.appState === 2) {
        return;
      }
      if (item.appState === 0) {
        this.$emit('removeRectApp', item);
      } else {
        this.$emit('addToRecent', item);
      }
    },
  },
  computed: {
    cardCls() {
      return cx(this.prefixCls, {
        [`${this.prefixCls}-multi`]: this.hasMultiApps,
      });
    },
  },
  watch: {
  },
};
</script>
<style lang="less">
@import '../../styles/themes/default';
@import '../../styles/mixins';

@prefixCls: h3-card-grid;

.@{prefixCls} {
  &.@{prefixCls}-multi {
    .h3-card-header-content {
      div {
        color: #666;
      }
      color: #666;
    }
  }
  .h3-card-header-content {
    .px2rem(font-size,28);
    .h3-card-grid-highlight {
      .px2rem(font-size,28);
      // font-size:14px;
    }
    div {
      .px2rem(font-size,28);
      color: #666;
    }
  }
  .h3-grid-item-content-opacity{
    opacity: .5;
  }
  .h3-card-body {
    padding-top:0;
  }
  .h3-card-grid-highlight {
    color:#1890FF;
  }
  .h3-grid-text {
    color:#333333;
    .px2rem(width,160);
    white-space: nowrap;
    //text-overflow: ellipsis;
    overflow: hidden;
    .px2rem(font-size,24) !important;
    .h3-card-grid-highlight {
      .px2rem(font-size,24) !important;
    }
  }
  .h3-grid-item {
    .iconwrap {
      .font-icon {
        // color: #fff;
        // font-size:27px;
        .px2rem(font-size,56);
      }
    }
    .icon-back2 {
      color: #1890FF;
    }
  }
  .h3-grid-appstate-icon{
    .px2rem(width,32);
    .px2rem(height,32);
    position: absolute;
    .px2rem(top,16);
    .px2rem(right,16);
    .icon {
      position: absolute;
      .px2rem(width, 32);
      .px2rem(height, 32);
      left: 0;
      height: 0;
    }
  }
  .h3-grid-null-item{
    background: #fff;
  }
}


.add {
  animation: appear 1s;
}

@keyframes appear {
  from {
    transform: scale(0, 0);
  }
  to {
    transform: scale(1, 1);
  }
}

.restore {
  animation: restore 1s;
}
@keyframes restore {
  from {
    opacity: 0.3;
  }
  to {
    opacity: 0.8;
  }
}


.app-sort-enter,
.app-sort-leave-active {
  opacity: 0;
  height: 0px;
  margin-top: 0px;
  padding: 0px;
  border: solid 0px;
  color: red;
}
.app-sort-sortable-chosen,
.app-sort-sortable-ghost {
  opacity: 0;
  height: 0px;
  margin-top: 0px;
  padding: 0px;
  border: solid 0px;
}

.list-complete-item {
  transition: all .5s;
}

.list-complete-enter, .list-complete-leave-to{
  opacity: 0;
  transform: scale(0.3);
}
.list-complete-leave-active {
  position: absolute;
}
</style>


