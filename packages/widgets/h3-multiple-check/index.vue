<template>
  <div>

    <div class="h3-multiple-check-wrapper">
      <h3-multiple-check-item 
      v-for="(item, index) in formDataLists" 
      :key="index" 
      :is-editing="isEditing" 
      @tigger-multiple-chcek = "triggerMultipleCheck" 
      @select-item="selectItem(item)" 
      :selected="item.selected"
      :is-single-check="true"
      @triggerSingleCheck="triggerSingleCheck"
      >

      </h3-multiple-check-item>
      <!-- <h3-single-check-item v-for="(item, index) in formDataLists" :key="index"  @tigger-multiple-chcek = "triggerMultipleCheck" @select-item="selectItem(item)" :selected="item.selected"></h3-multiple-check-item> -->
    </div>
    
    <H3ActionGroup v-show="isEditing" 
      :showTitle="false"
      :showButton="false">
      <div slot="action-group" class="slot-wrapper">
        <!-- <div class="h3-action-wrapper" @click="showActionSheet">
          <div class="h3-action-inner-wrapper">
            <p class="action-icon-wrapper"><i class="icon aufont icon-base-delete action-icon"></i></p>
            <p class="action-name">tab1</p>
          </div>
        </div> -->

        <h3-action-group-item v-for="(item,index) in actionGroup" :key="index" :iconType="item.iconType" :actionName="item.iconName" @showActionSheet="showActionSheet"></h3-action-group-item>
       
      </div>
    </H3ActionGroup>
    <h3-batching-action-sheet
      v-show="isEditing" 
      :isAll="isSelectedAll" 
      :selectedNum="selectedCount" 
      :tip="'已选'" 
      @selectAll="selectAll"
      :two-contents="false"
      :direction="'top'"
    ></h3-batching-action-sheet>
    <h3-action-sheet
      :menus="menus" 
      :message="`已选${selectedCount}条数据，删除后不可恢复`" 
      show-cancel 
      @on-click-menu="onClickMenu" 
      v-model="actionsheetShow"
    ></h3-action-sheet>

  </div>
</template>

<script>
import H3MultipleCheckItem from './h3-multiple-check-item.vue';
import H3SingleCheckItem from '../h3-single-check/h3-single-check-item.vue';
import H3ActionSheet from 'packages/components/h3-actionsheet/index.vue';
import H3ActionGroup from '../h3-action-group/index.vue';
import H3ActionGroupItem from '../h3-action-group/h3-action-group-item';
import H3BatchingActionSheet from '../h3-filter/h3-batch-action-sheet.vue';

export default{
  name: 'h3-multiple-check',
  components: {
    H3MultipleCheckItem,
    H3ActionSheet,
    H3ActionGroup,
    H3BatchingActionSheet,
    H3ActionGroupItem,
    H3SingleCheckItem,
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
      actionGroup: [
        { iconType: 'delete', actionName: 'tab1' },
        { iconType: 'delete', actionName: 'tab2' },
        { iconType: 'sharealt', actionName: 'tab3' },
        { iconType: 'delete', actionName: 'tab4' },
        { iconType: 'delete', actionName: 'tab5' },
        { iconType: 'delete', actionName: 'tab6' },
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
    },
    onClickMenu() {

    },
    showActionSheet() {
      this.actionsheetShow = true;
    },
    selectAll() {

    },
    triggerSingleCheck() {
      this.isEditing = true;
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
    isSelectedAll() {
      if (this.selectedCount === this.formDataLists.length) {
        return true;
      }
      return false;
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

