<template>
  <div class="field-order">
    <h3-popup
      v-model="visible"
      class="field-order-model"
      :class="{'field-order-top': !isDingtalk}"
      maskClosable
      :autoUp="false"
      popupDirection="right"
      popupWidth="78.4%"
      @toggle="toggle"
    >
      <div class="contianer">
        <div ref="orderHeader" class="order-header" :class="{'content-bottom': sortedColumns.length > 0}">
          <div
            v-for="(item,index) in sortedColumns"
            ref="orderList"
            :key="item.FieldCode + index"
            class="order-item"
          >
            <!-- <div class="delete" @click="removeItem(index,item)">
              <i class="h3yun_All minus-o"></i>
            </div> -->
            <i class="h3yun_All minus-circle delete-color" @click="removeItem(index,item)"></i>
            <div class="name">
              {{ item.DisplayName || '--' }}
            </div>
            <div class="operation" @click="ascChange(item)">
              <div class="up-down">
                <i class="h3yun_All sort-left-o" :class="{'active': !item.Asc}"></i>
                <i class="h3yun_All sort-right-o" :class="{'active': item.Asc}"></i>
              </div>
              <div class="mode">
                {{ `${item.Asc ? '升序' : '降序'}` }}
              </div>
            </div>
          </div>
        </div>
        <div class="order-content" :class="'scroll' + (sortedColumns.length > 6 ? 6 : sortedColumns.length)">
          <div class="text">
            请从下方选择排序字段
          </div>
          <div class="content-scroll">
            <div
              v-for="(item,index) in sortControlSource"
              :key="item.FieldCode + index"
              class="order-item"
              @click="addSortColumn(index,item)"
            >
              <!-- <div class="add">
                <i class="h3yun_All plus-o "></i>
              </div> -->
              <i class="h3yun_All plus-circle add-color"></i>
              <div class="name">
                {{ item.DisplayName || '--' }}
              </div>
            </div>
          </div>
        </div>
        <div class="order-footer">
          <h3-button
            size="small"
            :class="{'add-border': sortedColumns.length > 0}"
            :disabled="sortedColumns.length === 0"
            @click="resetSort"
          >
            重置
          </h3-button>
          <h3-button type="primary" size="small" @click="saveSort">
            保存
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
import { namespace } from 'vuex-class';
// import { GroupColumnItem } from '../../typings';
import { FormControlType, IconMap } from '../../typings/const';
import { H3Popup, H3Button } from '@h3/thinking-ui';
import { H3Scroll } from 'h3-mobile-vue';
import { isDingtalk, isiOS } from '@/config/common';
import { BoardMutationType } from '../../store/types';
import { Board } from '../../typings/board';
import cloneDeep from 'lodash/cloneDeep';

const LightBoardModule = namespace('LightBoard');

// 排序不支持的控件类型
const NoFieldOrderTypes = [
  FormControlType.FormPhoto, // 图片
  FormControlType.FormAttachment, // 附件
  FormControlType.FormGridView, // 子表
  FormControlType.FormMultiUser, // 人员多选
  FormControlType.FormMultiDepartment, // 部门多选
  FormControlType.FormCheckboxList, // 复选框
  FormControlType.FormAreaSelect, // 地址
  FormControlType.FormMap, // 位置
];

@Component({
  name: 'field-order',
  components: {
    H3Scroll,
    H3Button,
    H3Popup,
  },
})

export default class GroupFieldSearch extends Vue {
  @LightBoardModule.State('board') board!: Board;

  @LightBoardModule.Mutation(BoardMutationType.SortColumnsChange) sortColumnsChange;

  visible = false;

  showModel = false;

  sortControlSource = [];

  sortedColumns = [];

  get isDingtalk () {
    return isDingtalk;
  }

  /**
   * 获取过滤之后的 已经选择的排序
  */
  get filterSortedColumns () {
    const ret: any = [];
    for (const col of this.board.sortColumns) {
      const ctrl = cloneDeep(this.board.controls).find(item => item.FieldCode === col.FieldCode);
      if (ctrl) { // 有可能列字段被删除，但是排序字段未被删除
        this.$set(ctrl, 'Asc', col.Asc);
        ret.push(ctrl);
      }
    }
    return ret;
  }

  /**
   * 选中的code集合
  */
  get selectedMap () {
    const ret: any = [];
    this.filterSortedColumns.forEach((col) => {
      ret.push(col.FieldCode);
    });
    return ret;
  }

  /**
   * 获取排序字段数据源
   */
  getSortControl () {
    const ctrls = cloneDeep(this.board.controls).filter(control => !NoFieldOrderTypes.includes(control.Type) &&
    control.FieldCode.indexOf('.') < 0 && this.selectedMap.indexOf(control.FieldCode) < 0);
    return ctrls;
  }

  @Watch('showModel')
  showModelChange (val) {
    if (val) {
      this.visible = true;
    } else {
      this.visible = false;
    }
  }

  created () {
    this.showModel = true;
    this.sortControlSource = this.getSortControl();
    this.sortedColumns = this.filterSortedColumns;
  }

  /**
   * 排序方式
  */
  ascChange (item) {
    this.$set(item, 'Asc', !item.Asc);
  }

  /**
   * 新增排序字段
  */
  addSortColumn (index, item) {
    this.sortedColumns.push({
      FieldCode: item.FieldCode,
      DisplayName: item.DisplayName,
      Asc: true,
    });
    this.sortControlSource.splice(index, 1);
    this.scrollTo();
  }

  /**
   * 删除排序
  */
  removeItem (index, item) {
    this.sortedColumns.splice(index, 1);
    this.sortControlSource.push(item);
  }

  /**
   * 重置排序
  */
  resetSort () {
    this.sortedColumns = [];
    this.sortControlSource = this.getSortControl();
    this.sortColumnsChange(this.sortedColumns);
    this.$emit('sort-column-update');
  }

  /**
   * 保存排序
  */
  saveSort () {
    this.sortColumnsChange(this.sortedColumns);
    this.$emit('sort-column-update', this.sortedColumns);
  }

  /**
   * 滚动到新增的字段
  */
  scrollTo () {
    const panel = this.$refs.orderHeader as any;
    const panelChild = this.$refs.orderList as any;
    if (panelChild && panelChild.length > 0) {
      const len = panelChild.length;
      const oneOnly = panelChild[0];
      this.$nextTick(() => {
        const height = len * (oneOnly as any).scrollHeight;
        (panel as any).scrollTop = height;
      });
    }
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
.field-order-top {
  top: 1.30666667rem !important;
}
.field-order-model {
  // top: 1.30666667rem !important;
  /deep/ .h3think-popup-wrap{
    .px2rem(border-top-left-radius, 24);
    .px2rem(border-bottom-left-radius, 24);
    background:#F5F7F9;
    overflow: hidden;
  }
  .contianer{
    height: 100%;
  }
  .order-header {
    .px2rem(max-height, 516);
    overflow-x: hidden;
    overflow-y:auto;
    -webkit-overflow-scrolling: touch;
    background:#fff;
    .title{
      box-sizing: border-box;
      .px2rem(height, 86);
      .px2rem(line-height, 86);
      .px2rem(padding-left, 30);
      .px2rem(border-bottom-width, 1);
      border-bottom-style: solid;
      border-bottom-color: #EBEDF2;
    }

    .delete{
      .px2rem(width, 30);
      .px2rem(height, 30);
      border-radius: 50%;
      background: #FF4384;
      display: flex;
      align-items: center;
      justify-content: center;
      i{
        .px2rem(font-size, 20);
        color: #fff;
      }
    }
    .delete-color{
      color:#FF4384;
      .px2rem(font-size,30);
    }
    .name{
      .px2rem(margin-left, 24);
      width: calc(100% - 156/ @baseFontSize * 1rem);
      .px2rem(font-size, 30);
      color:#333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .operation{
      margin-left: auto;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      .up-down{
        display: flex;
        overflow: hidden;
        i{
          .px2rem(font-size, 24);
          color:#ccc;
        }
        .active{
          color:#107FFF;
        }
      }
    }
    .mode{
      color:#999;
      .px2rem(font-size, 26)
    }
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
    .add-border{
       .px2rem(border-width, 1);
        border-style: solid;
        border-color: #999;
    }
    button{
      .px2rem(border-radius, 30);
      .px2rem(font-size, 24);
      font-weight: 500;
      &:first-child{
        font-weight: 500;
        .px2rem(margin-right, 8);
      }
      &:last-child{
        font-weight: 500;
        .px2rem(margin-left, 8);
      }
    }
  }
  .order-content {
    background: #fff;
    .text{
      .px2rem(height, 86);
      .px2rem(line-height, 86);
      .px2rem(padding-left, 30);
      .px2rem(font-size, 24);
      color:#999;
      background: #fff;
      box-sizing: border-box;
      .px2rem(border-bottom-width, 1);
      border-bottom-style: solid;
      border-bottom-color: #EBEDF2;
    }
    .add{
      .px2rem(width, 30);
      .px2rem(height, 30);
      border-radius: 50%;
      background: #0091FF;
      display: flex;
      align-items: center;
      justify-content: center;
      i{
        .px2rem(font-size, 20);
        color: #fff;
      }
    }
    .add-color{
      color:#0091FF;
      .px2rem(font-size, 30);
    }
    .name{
      width: calc(100% - 60/ @baseFontSize * 1rem);
      .px2rem(margin-left, 24);
      .px2rem(font-size, 30);
      color:#333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
  // .content-top{
  //   .px2rem(padding-top, 20);
  //   background: #F5F7F9;
  // }
  .content-bottom{
    .px2rem(margin-bottom, 20);
    // background: #F5F7F9;
  }
  .scroll0{
    height : calc(100% - 110 / @baseFontSize * 1rem);
  }
  .scroll1{
    height : calc(100% - 216 / @baseFontSize * 1rem);
  }
  .scroll2{
    height : calc(100% - 302 / @baseFontSize * 1rem);
  }
  .scroll3{
    height : calc(100% - 388 / @baseFontSize * 1rem);
  }
  .scroll4{
    height : calc(100% - 474 / @baseFontSize * 1rem);
  }
  .scroll5{
    height : calc(100% - 560 / @baseFontSize * 1rem);
  }
  .scroll6{
    height : calc(100% - 646 / @baseFontSize * 1rem);
  }
}
</style>
