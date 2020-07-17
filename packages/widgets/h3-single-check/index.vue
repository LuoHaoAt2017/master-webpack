<template>
  <div>
    
    <div class="h3-multiple-check-wrapper">
      <h3-single-check-item v-for="(item, index) in formDataLists" :key="index" :is-editing="isEditing" @tigger-multiple-chcek = "triggerMultipleCheck" @select-item="selectItem(item)" :selected="item.selected"></h3-single-check-item>
    </div>
    
    <H3ActionGroup v-show="isEditing" 
      :showTitle="true"
      :showButton="true"
      @onCancel="onCancel"
      >
      <div slot="action-group" class="slot-wrapper">
        <div class="h3-action-wrapper" @click="showActionSheet">
          <div class="h3-action-inner-wrapper">
            <p class="action-icon-wrapper"><i class="icon aufont icon-base-delete action-icon"></i></p>
            <p class="action-name">tab1</p>
          </div>
        </div>

        <div class="h3-action-wrapper" @click="showActionSheet">
          <div class="h3-action-inner-wrapper">
            <p class="action-icon-wrapper"><i class="icon aufont icon-base-delete action-icon"></i></p>
            <p class="action-name">tab1</p>
          </div>
        </div>

        <div class="h3-action-wrapper" @click="showActionSheet">
          <div class="h3-action-inner-wrapper">
            <p class="action-icon-wrapper"><i class="icon aufont icon-base-delete action-icon"></i></p>
            <p class="action-name">tab2</p>
          </div>
        </div>

        <div class="h3-action-wrapper" @click="showActionSheet">
          <div class="h3-action-inner-wrapper">
            <p class="action-icon-wrapper"><i class="icon aufont icon-base-delete action-icon"></i></p>
            <p class="action-name">tab3</p>
          </div>
        </div>

        <div class="h3-action-wrapper" @click="showActionSheet">
          <div class="h3-action-inner-wrapper">
            <p class="action-icon-wrapper"><i class="icon aufont icon-base-sharealt action-icon"></i></p>
            <p class="action-name">tab4</p>
          </div>
        </div>

        <div class="h3-action-wrapper" @click="showActionSheet">
          <div class="h3-action-inner-wrapper">
            <p class="action-icon-wrapper"><i class="icon aufont icon-base-delete action-icon"></i></p>
            <p class="action-name">tab5</p>
          </div>
        </div>

        <div class="h3-action-wrapper" @click="showActionSheet">
          <div class="h3-action-inner-wrapper">
            <p class="action-icon-wrapper"><i class="icon aufont icon-base-sharealt action-icon"></i></p>
            <p class="action-name">tab6</p>
          </div>
        </div>

        <div class="h3-action-wrapper" @click="showActionSheet">
          <div class="h3-action-inner-wrapper">
            <p class="action-icon-wrapper"><i class="icon aufont icon-base-delete action-icon"></i></p>
            <p class="action-name">tab7</p>
          </div>
        </div>
      </div>
    </H3ActionGroup>


    <h3-action-sheet
      :menus="menus" 
      :message="'此条数据删除后不可恢复'" 
      show-cancel 
      @on-click-menu="onClickMenu" 
      v-model="actionsheetShow"
    ></h3-action-sheet>

  </div>
</template>

<script>
import H3SingleCheckItem from './h3-single-check-item';
import H3ActionSheet from '../../components/h3-actionsheet/index';
// import H3ActionGroup from '../h3-action-group/index.vue';
import { H3ActionGroup } from '../h3-action-group/index';


export default{
  name: 'h3-single-check',
  components: {
    H3SingleCheckItem,
    H3ActionSheet,
    H3ActionGroup,
  },
  props: {
  },
  data() {
    return {
      formDataLists: [
        {
          title: '111',
          brief: '111',
        },
        {
          title: '222',
          brief: '222',
        },
        {
          title: '333',
          brief: '333',
        },
      ],
      isEditing: false,
      menus: [
        {
          type: 'error',
          label: '删除',
        },
      ],
      actionsheetShow: false,
    };
  },
  mounted() {

  },
  methods: {
    triggerMultipleCheck() {
      this.isEditing = true;
    },
    selectItem(item) {
      this.$set(item, 'selected', !item.selected);
      if (this.selectedCount > 0) {
        this.actionsheetShow = true;
      }
    },
    onClickMenu() {

    },
    showActionSheet() {
      this.actionsheetShow = true;
    },
    onCancel() {
      this.isEditing = false;
    },
  },
  computed: {
    selectedCount() {
      const itemsArray = this.formDataLists;
      let count = 0;
      for (let i = 0; i < itemsArray.length; i += 1) {
        const item = itemsArray[i];
        if (item.selected) {
          count += 1;
        }
      }
      return count;
    },
  },
};
</script>
<style lang="less">
@import '../../styles/mixins';
.h3-multiple-check-wrapper{
  // .px2rem(height, 1334);
  .px2rem(margin-top, 88);
}
.h3-action-wrapper{
  .px2rem(width, 134);
  .px2rem(height, 100);
  
  .h3-action-inner-wrapper{
    .action-icon-wrapper{
      text-align: center;
      .px2rem(margin-top, 13);
    }
  }
  .action-icon {
    .px2rem(width, 48);
    .px2rem(height, 48);
  }
  .action-name{
    text-align: center;
    .px2rem(margin-top, 4);
    .px2rem(font-size, 20);
    color: #666666;
    .px2rem(line-height, 20);
  }
}
.slot-wrapper{
  width: 100%;
  .px2rem(height, 100);
  .hairline('top', #e4e4e4);
  .hairline('bottom', #e4e4e4);
  position: relative;
  // overflow: hidden;
  display: flex;
  // flex-wrap: nowrap;
  .h3-action-wrapper{
    float: left;
  }
}
</style>

