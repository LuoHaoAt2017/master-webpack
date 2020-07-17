<template>
  <div class="app-select" :class="{hasTop:!$store.state.corpId}">
    <div class="app-select-header">
        <span class="title-bold">常用表单</span>
    </div>
    <div>
      <!-- <draggable :list="curItems" :options="draggableOptions" @start="onStart" @end="onEnd"> -->
        <transition-group tag="div" name="comForm" class="app-select-body" :class="rowClass"
         @before-enter="beforeAdd" @after-enter="afterAdd" @after-leave="afterRemove" @before-leave="beforeRemove">
          <div class="app-select-item active" :class="`pos-${index+1}`" v-for="(item,index) in curItems"
          :key="item.SchemaCode">
            <div class="app-select-item-body" @click="remove(item, index)">
              <div class="app-select-item-icon">
                <span :class="item.appIconClass"></span>
              </div>
              <div class="app-select-item-name">
                {{item.DisplayName}}
              </div>
              <div class="app-select-icon-remove">
                <span class="aufont icon-base-minus-circle" ></span>
              </div>
            </div>
          </div>
          <div class="app-select-item empty adding" key="NullValue" ref="empty" v-show="showEmptyForm" >
            <div class="empty-box"></div>
          </div>
        </transition-group>
      <!-- </draggable> -->
    </div>
    <h3-white-space :h3style="{backgroundColor: '#f8f8f8', height: '12px'}"></h3-white-space>
  </div>
</template>

<script>
// h3 widgets
import H3WhiteSpace from '../../../packages/components/h3-white-space';

let singleRowHeight = 0;
let doubleRowHeight = 0;
const iconColorsMap = ['#FF4384', '#7457FF', '#FF7527', '#05DB9B', '#FFCA00']; // 其实只取长度
const iconColorsLimit = 3;

export default {
  name: 'app-select',
  components: {
    H3WhiteSpace,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      curItems: [],
      showEmptyForm: true,
      colors: ['#FF6851', '#FFA228', '#19A7FB', '#1CC972'],
      rowClass: '',
      transition: false,
      // draggableOptions: {
      //   animation: 150,
      //   delay: 50,
      //   ghostClass: 'app-sort-ghost',
      //   chosenClass: 'app-sort-chosen',
      //   dragClass: 'app-sort-dragging',
      //   fallbackClass: 'app-sort-fallback',
      //   forceFallback: true,
      //   fallbackOnBody: true,
      //   filter: '.empty',
      // },
    };
  },
  created() {
    this.curItems = this.items;
    this.curItems.forEach((item, index) => {
      const formItem = item;
      formItem.appIconClass = this.getAppIconClass(item);
    });
    this.rowClass = this.curItems.length < 4 ? 'one-row' : 'two-row';
    // this.showEmptyForm = this.curItems.length < 8;
  },
  mounted() {
    if (this.curItems.length === 8) {
      this.toggleEmptyClass('empty-hide', true);
    }
    const itemHeight = this.$el.querySelector('.app-select-item').offsetHeight;
    const originHeight = this.$el.offsetHeight;
    const isSingleLine = this.curItems.length < 4;
    singleRowHeight = isSingleLine ? originHeight : originHeight - itemHeight;
    doubleRowHeight = isSingleLine ? originHeight + itemHeight : originHeight;
    this.$emit('appsRowBreak', originHeight);
  },
  methods: {
    remove(item, index) {
      if (this.transition) {
        return;
      }
      console.time('remove-form');
      this.curItems.splice(index, 1);
      this.$emit('remove', item);
    },
    beforeAdd(el) {
      if (!el.classList.contains('empty')) {
        // this.showEmptyForm = this.curItems.length < 8;
        if (this.curItems.length === 4) {
          this.rowClass = 'two-row';
          this.$emit('appsRowBreak', doubleRowHeight);
        }
        this.toggleEmptyClass('adding', true);
        if (this.curItems.length === 8) {
          this.toggleEmptyClass('empty-hide', true);
        }
      }
    },
    afterAdd(el) {
      if (!el.classList.contains('empty')) {
        console.timeEnd('add-form');
      }
    },
    beforeRemove(el) {
      if (!el.classList.contains('empty')) {
        this.toggleEmptyClass('adding', false);
        this.transition = true;
      }
    },
    afterRemove(el) {
      if (!el.classList.contains('empty')) {
        console.timeEnd('remove-form');
        setTimeout(() => {
          if (this.curItems.length < 8) {
            this.toggleEmptyClass('empty-hide', false);
            this.transition = false;
          }
          if (this.curItems.length === 3) {
            this.rowClass = 'one-row';
            this.$emit('appsRowBreak', singleRowHeight);
          }
        }, 300);
      }
    },
    toggleEmptyClass(className, toggle) {
      const empty = this.$refs.empty;
      if (toggle) {
        empty.classList.add(className);
      } else {
        empty.classList.remove(className);
      }
    },
    getAppIconClass(item) {
      let classStr = `font-icon ${item.IconCss}`;
      let left;
      if (item.ObjectId) {
        const substr = item.ObjectId.substr(-iconColorsLimit);
        let long = 0;
        for (let i = 0; i < substr.length; i++) {
          const s = substr[i];
          const l = s.charCodeAt(0);
          long += l;
        }
        left = long % iconColorsMap.length;
      } else {
        left = Math.floor(Math.random() * iconColorsMap.length);
      }
      classStr = `${classStr} app-icon-color-${left + 1}`;
      return classStr;
    },
    // onStart() {
    //   this.showEmptyForm = false;
    // },
    // onEnd() {
    //   this.showEmptyForm = this.curItems.length < 8;
    // },
  },
  watch: {
    // rowClass(val) {
    // },
  },
};
</script>

<style lang="less" scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.comFormLoop(@formCount)when (@formCount>0) and (@formCount<5){
  .pos-@{formCount}{
    .px2rem(top,9);
    left: (9 / @baseFontSize * 1rem) + (@formCount - 1) * (182/@baseFontSize * 1rem);
  }
  .comFormLoop(@formCount - 1)
}
.comFormLoop(@formCount)when(@formCount > 4){
  .pos-@{formCount}{
    .px2rem(bottom,9);
    left: (9 / @baseFontSize * 1rem) + (@formCount - 5) * (182 / @baseFontSize * 1rem);
  }
  .comFormLoop(@formCount - 1);
}
@prefixName: app-select;
@itemHeight: 186;
.@{prefixName} {
  background: #fff;
  position: relative;
  width: 100%;
  padding: 0;
  margin: 0;
  z-index: 20;
  &-body {
    background-color: #fff;
    position: relative;
    display: flex;
    flex-flow: wrap;
    align-items: stretch;
    .px2rem(padding,9);
    overflow: hidden;
    justify-content: flex-start;
    box-sizing: border-box;
    transition: all 300ms;
    .comFormLoop(8);
  }
  &-header {
    color: #333;
    font-size: 0;
    background-color: #fff;
    .px2rem(padding-top,24);
    .px2rem(margin-bottom,2);
    .px2rem(padding-left,30);
    .px2rem(line-height,45);
    .px2rem(height,45);
    .title-bold{
      display: inline-block;
      vertical-align: baseline;
      .px2rem(margin-right,18);
    }
  }
  &-body.one-row{
    .px2rem(height,@itemHeight+9*2+8*2);
  }
  &-body.two-row{
    .px2rem(height,(@itemHeight+8*2)*2+9*2);
  }
  .title-bold{
    font-weight: 500;
    .px2rem(font-size,32);
  }
}

.@{prefixName}-item {
  .px2rem(height, @itemHeight);
  .px2rem(padding,8);
  .px2rem(width, 166);
  overflow:hidden;
  &-body{
    background-color: #f2f3f5;
    .px2rem(height,@itemHeight);
    .px2rem(padding,18);
    box-sizing: border-box;
    position: relative;
  }
  &.empty {
    .empty-box{
      .px2rem(width, 162);
      .px2rem(height, @itemHeight);
      box-sizing: border-box;
      border: 1px dashed #999;
      background-color: #fff;
    }
  }
  .@{prefixName}-icon-remove{
    position: absolute;
    .px2rem(top,8);
    .px2rem(right,8);
    z-index: 99;
    span.aufont{
      .px2rem(font-size,32);
      color: red;
    }
  }
  &-icon {
    width: 100%;
    text-align: center;
    span {
      .px2rem(font-size,54);
      z-index: 99;
    }
  }
  &-name {
    text-align: center;
    color: #333;
    .px2rem(font-size, 26);
    .px2rem(margin-top, 20);
    .px2rem(line-height,37);
    width: 100%;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    word-break: break-all;
  }
  // 缩放进出动画
  &.active.comForm-enter, &.active.comForm-leave-to{
    transform: scale(0);
  }
  &.active.comForm-enter-active{
    transition: all 300ms;
    pointer-events: none;
  }
  // &.active.comForm-enter-active.pos-4{
  //   position:absolute;
  // }
  &.active.comForm-leave-active{
    transition: all 300ms;
    transition-delay: 0ms;
    position:absolute;
    pointer-events: none;
  }
  &.comForm-move{
    transition: all 300ms;
    transition-delay: 300ms;
    pointer-events: none;
  }
  &.empty.empty-hide{
    opacity: 0;
    position: absolute;
    z-index: -1;
    .px2rem(left, 555);
    .px2rem(top, 191);
  }
  &.empty.adding.comForm-move{
    transition-delay: 0ms;
  }
}
</style>
