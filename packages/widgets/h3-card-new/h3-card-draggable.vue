<template>
  <div class="h3-card-draggable" :class="{hasTop:!$store.state.corpId}">
    <div class="h3-card-draggable-header">
        <slot name="title" >
          常用表单（按住拖动可排序，最多添加8个）
        </slot>
    </div>
    <div class="h3-card-draggable-body">
      <!-- <draggable v-model="curItems"  :options="draggableOptions" @start="onStart">
        
      </draggable> -->
      <transition-group tag="span" name="sort">
          <div class="h3-card-draggable-item" :class="[item ?'':'empty', item.newAdded?'add':'']" v-for="(item,index) in curItems"   @click="remove(item, index)" 
          :key="item.SchemaCode">
            <template v-if="item">
              <div class="h3-card-draggable-item-icon " >
                  <span :class="item.IconCss" :style="{color: colors[index%5]}"></span>
              </div>
              <div class="h3-card-draggable-item-name" >
                  {{item.DisplayName}}
              </div>
              <span class="h3-card-draggable-icon-remove aufont icon-base-minus-circle" ></span>
            </template>
            <div class="h3-card-draggable-item-icon "  v-if="!item" > 
            </div>
          </div>
          <div class="h3-card-draggable-item empty" key="NullValue" v-if="curItems.length < 8" >
          </div>
        </transition-group>
    </div>
  </div>
</template>

<script>
// import '../../libs/Sortable';
import draggable from 'vuedraggable';
import dom from '../../utils/dom';
// import draggable from '../h3-draggable/draggable';

// const prefixCls = 'h3-card-draggable';


export default {
  name: 'h3-card-draggable',
  components: {
    draggable,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    addCls: {
      type: String,
      default: 'h3-add',
    },

  },
  data() {
    return {
      curItems: [],
      colors: ['#F57C68', '#F7B55D', '#7EA6EA', '#2DCFA4', '#3AD1DF'],
      draggableOptions: {
        forceFallback: true,
        fallbackOnBody: true,
        filter: '.empty',
      },
    };
  },
  created() {
    this.curItems = this.items;
  },
  methods: {
    remove(item, index) {
      this.curItems.splice(index, 1);
      this.$emit('remove', item);
    },
    // onStart(evt) {
    //   const items = evt.item.parentNode.childNodes;
    //   for (let i = 0, len = items.length; i < len; i += 1) {
    //     dom.removeClass(items[i], 'add');
    //   }
    // },
  },
};
</script>

<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}


.h3-card-draggable {
  position: relative;
  width: 100%;
  padding: 0;
  margin: 0;
  z-index: 20;
   .px2rem(margin-bottom, 16);
  &-body {
    display: flex;
    flex-flow: wrap;
    align-items: flex-start;
    .px2rem(padding-left,18);
    .px2rem(padding-right,18);
    justify-content: flex-start;
    & > span {
      display: flex;
      flex-flow: wrap;
      align-items: flex-start;
    }
    .h3-card-draggable-item {
      position: relative;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      .px2rem(width, 166);
      .px2rem(height, 140);
      justify-content: center;
      align-items: center;
      .px2rem(margin-right,16);
      .px2rem(margin-top,16);
      background-color: #f2f3f5;
      &:nth-child(4n) {
        margin-right: 0;
      }
      &.active{
          opacity: 0.5;
      }
      .h3-card-draggable-icon-remove{
        position: absolute;
        .px2rem(font-size,32);
        color: red;
        .px2rem(top,8);
        .px2rem(right,8);
      }
      &-icon {
        width: 100%;
        text-align: center;
        .px2rem(margin-bottom,16);
        span {
          .px2rem(font-size,54);
        }
      }
      &-name {
        text-align: center;
        font-size: 12px;
        color: #666;
        .px2rem(margin-top, 7);
        // display: -webkit-box;
        // -webkit-box-orient: vertical;
        // -webkit-line-clamp: 2;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  &-header {
    color: #666;
    font-size: 12px;
    .px2rem(height,60);
    .px2rem(line-height,60);
    .px2rem(padding-left,24);
  }
  &-body > div > span {
    display: flex;
    flex-flow: wrap;
    align-items: flex-start;
  }
  
  div.empty {
    border: 1px dashed #999;
    background-color: #fff;
  }
  
  .sort-enter,
  .sort-leave-active {
    opacity: 0;
    margin-top: 0px;
    padding: 0px;
    border: solid 0px;
    color: red;
  }
  
  .sortable-ghost {
    opacity: 0;
    margin-top: 0px;
    padding: 0px;
    border: solid 0px;
  }
  .sortable-drag,
  .move-target {
    transform: scale(1.1);
  }
}

</style>


