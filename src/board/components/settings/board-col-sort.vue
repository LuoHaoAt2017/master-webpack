<template>
  <div class="board-col-sort">
    <h3-popup
      v-model="visible"
      class="board-col-sort-model"
      :class="{'board-col-sort-top': !isDingtalk}"
      maskClosable
      :autoUp="false"
      popupDirection="right"
      popupWidth="78.4%"
      @toggle="toggle"
    >
      <div class="contianer">
        <div class="order-header">
          <div class="text">
            看板列·{{ boardColumnName }}
          </div>
          <draggable
            ref="orderHeader"
            :list="sortColumns"
            :options="actionListOpt"
            class="content-scroll"
            element="div"
            @end="dragSortEnd"
          >
            <!-- <div class="content-scroll"> -->
            <div
              v-for="(item,index) in sortColumns"
              ref="sortList"
              :key="item.ColumnValue + index"
              class="order-list"
            >
              <div class="order-item">
                <h3-radio :control="true" :checked="item.checked" @change="select(item)">
                  <div class="title">
                    {{ item.DisplayName || '--' }}
                  </div>
                </h3-radio>
                <div class="drag-icon drag-action">
                  <i class="h3yun_All drag "></i>
                </div>
              </div>
            </div>
            <!-- </div> -->
          </draggable>
        </div>
        <div class="order-footer">
          <h3-button size="small" @click="cancelSort">
            取消
          </h3-button>
          <h3-button type="primary" size="small" @click="saveSort">
            完成
          </h3-button>
        </div>
      </div>
    </h3-popup>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import {
  State, Getter, Mutation, Action, namespace,
} from 'vuex-class';
import { UnclassifiedField } from '../../typings';
import { H3Popup, H3Button, H3Radio } from '@h3/thinking-ui';
import { H3Scroll } from 'h3-mobile-vue';
import { isDingtalk, isiOS } from '@/config/common';
import { BoardMutationType, BoardActionType } from '../../store/types';
import { Board } from '../../typings/board';
import draggable from '../vuedraggable';
import cloneDeep from 'lodash/cloneDeep';

const LightBoardModule = namespace('LightBoard');

@Component({
  name: 'board-col-sort',
  components: {
    H3Scroll,
    H3Button,
    H3Popup,
    H3Radio,
    draggable,
  },
})

export default class GroupFieldSearch extends Vue {
  @LightBoardModule.State('board') board!: Board;

  @LightBoardModule.Getter('boardColumnName') boardColumnName;

  @LightBoardModule.State('boardColumnRecords') boardColumnRecords;

  @LightBoardModule.Mutation(BoardMutationType.SortColumnsChange) sortColumnsChange;

  @LightBoardModule.Action(BoardActionType.SortStack) sortStack;

  visible = false;

  showModel = false;

  sortColumns = [];

  uncategory = {}; // 未分类

  actionListOpt: any = {
    animation: 200,
    handle: '.drag-action',
    dragClass: 'sort-list-drag',
    chosenClass: 'sort-list-chosen',
    ghostClass: 'sort-list-ghost',
    forceFallback: true,
    fallbackClass: 'rule-list-float',
  };

  get isDingtalk () {
    return isDingtalk;
  }

  @Watch('showModel')
  sortModelChange (val) {
    if (val) {
      this.visible = true;
    } else {
      this.visible = false;
    }
  }

  created () {
    this.showModel = true;
    const dataSource = cloneDeep(this.board.stacks);
    const dataFilter = [];
    dataSource.forEach((it, index) => {
      if (it.ColumnValue === UnclassifiedField) {
        this.uncategory = it;
      } else {
        this.board.index === index ? it.checked = true : it.checked = false;
        dataFilter.push(it);
      }
    });
    this.sortColumns = dataFilter;
  }

  select (item) {
    // this.$set(item, 'active', !item.active);
    this.sortColumns.forEach(it => {
      this.$set(it, 'checked', it.ColumnValue === item.ColumnValue);
    });
  }

  sortChange () {

  }

  dragSortEnd () {

  }

  /**
   * 取消排序
  */
  cancelSort () {
    this.$emit('closeModel');
  }

  /**
   * 保存排序
  */
  async saveSort () {
    const index = this.sortColumns.findIndex(it => it.checked);
    this.sortColumns.forEach((it) => { delete it.checked; });
    await this.sortStack(this.sortColumns);// 注意 未分类不能传给后台
    this.sortColumns.unshift(this.uncategory);
    this.board.stacks = this.sortColumns;
    if (index > -1) {
      // this.board.changeIndex(index + 1);
      this.board.fastPosition(index + 1, this.boardColumnRecords);
    }
    this.$emit('closeModel');
  }

  toggle (val) {
    if (!val) {
      this.$emit('closeModel');
    }
  }
}

</script>
<style lang='less' scoped>
@import '~@/styles/light-app.less';
.board-col-sort-top {
  top: 1.30666667rem !important;
}
.board-col-sort-model {
  // top: 1.30666667rem !important;
  /deep/ .h3think-popup-wrap{
    .px2rem(border-top-left-radius, 24);
    .px2rem(border-bottom-left-radius, 24);
    overflow: hidden;
  }
  .contianer{
    height: 100%;
  }
  .order-header {
     height:calc(100% - 110/ @baseFontSize * 1rem);
    .text{
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .px2rem(height, 86);
      .px2rem(line-height, 86);
      .px2rem(padding-left, 30);
      .px2rem(padding-right, 30);
      .px2rem(font-size, 24);
      color:#999;
      background: #fff;
      box-sizing: border-box;
      .px2rem(border-bottom-width, 1);
      border-bottom-style: solid;
      border-bottom-color: #EBEDF2;
    }
  }
  .order-header-list{
    // height:calc(100% - 86/ @baseFontSize * 1rem);
  }
  .content-scroll{
    height:calc(100% - 86/ @baseFontSize * 1rem);
    .px2rem(padding-bottom,26);
    overflow-x: hidden;
    overflow-y:auto;
    -webkit-overflow-scrolling: touch;
    background:#fff;
    .h3think-radio{
      width:calc(100% - 60/ @baseFontSize * 1rem);
    }
    .title{
      .px2rem(font-size, 30);
      color:#333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .drag-icon {
       margin-left: auto;
      .px2rem(width, 50);
      text-align: center;
      cursor: grabbing;
      i {
        color: #999;
        .px2rem(font-size,30);
      }
    }
    .mode{
      color:#999;
      .px2rem(font-size, 26)
    }
  }

  .order-list{
    width:100%;
    background: #fff;
    opacity: 1;
  }

  .order-item{
    box-sizing: border-box;
    width: calc(100% - 30/ @baseFontSize * 1rem);
    .px2rem(height, 86);
    .px2rem(line-height, 86);
    .px2rem(margin-left, 30);
    .px2rem(padding-right, 30);

    display: flex;
    flex-flow:row nowrap;
    justify-content:flex-start;
    align-items: center;
    .px2rem(border-bottom-width, 1);
    border-bottom-style: solid;
    border-bottom-color: #EBEDF2;
  }
  .order-footer {
    .px2rem(padding-left,30);
    .px2rem(padding-right,30);
    .px2rem(height, 110);
    .px2rem(line-height, 110);
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #fff;
    button{
      .px2rem(border-radius, 30);
      .px2rem(font-size, 24);
      &:first-child{
        .px2rem(margin-right, 8);
        .px2rem(border-width, 1);
        border-style: solid;
        border-color: #999;
        font-weight: 500;
      }
      &:last-child{
        .px2rem(margin-left, 8);
        font-weight: 500;
      }
    }
  }
  .content-scroll{
    position: relative;
    background: #fff;
    max-height : calc(100% - 86/ @baseFontSize * 1rem);
    overflow-x: hidden;
    overflow-y:auto;
    -webkit-overflow-scrolling: touch;
  }

  .content-bottom{
    .px2rem(margin-bottom, 20);
    // background: #F5F7F9;
  }

  .sort-list-ghost {
    opacity: 1;
    width: 100%;
    .px2rem(height,86);
    // background: #F0F7FF;
    background: #F7F7F7;
    .h3think-radio, .drag-icon {
      visibility: hidden;
    }
  }
  .sort-list-drag{
    box-shadow:0px 1px 4px 0px rgba(56,56,56,0.5);
  }
}
</style>
