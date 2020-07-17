<template>
  <div ref="layout" class="board-layout">
    <board-stack
      :id="stack.ObjectId"
      v-for="(stack, index) in stacks"
      :key="stack.ObjectId"
      :index="index"
      :title="stack.DisplayName"
      :stackValue="stack.ColumnValue"
      :stackUrl="stack.ImgUrl"
      :stackWidth="stackWidth"
      :total="stacks.length"
      :stackHeight="docHeight"
      :stackBodyHeight="stackBodyHeight"
      :stackField="boardColumnField"
      :stackFieldType="boardColumnType"
      :displayFields="displayFields"
      :sortFields="sortFields"
      :showTitle="showTitle"
      :cover="cover"
      :isAdministrator="isAdministrator"
      :controlOptions="controlOptions"
      :editable="editable"
      :enableWorkflow="isWorkflow"
      :required="required"
      :enableCreate="enableCreate"
      :allColumnValues="allColumnValues"
      :gutter="gutter"
      :menuVisible="isAdministrator && stackMenus.length > 0"
      :menus="stackMenus"
      @sort-start="sortStart"
      @sort-end="sortEnd"
      @add-stack="addStackAfter"
    />
    <div
      v-if="isAdministrator && stacks.length <= 50"
      :style="stackAddStyle"
      class="board-layout__stack-add board-stack"
    >
      <div @click="addStack">
        <i class="h3yun_All plus-o"></i>
        <span>添加新列</span>
      </div>
    </div>
    <div class="board-layout__stack-placeholder" :style="placeholderStyle"></div>
    <h3-modal
      v-model="stackAddModalVisible"
      class="board-layout__modal-add"
      title="添加新列"
      @confirm="stackAddConfirm"
      @cancel="stackAddCancel"
    >
      <h3-input
        ref="input"
        v-model="newStackValue"
        type="text"
        placeholder="请输入列名"
        :maxlength="50"
        :wait="0"
        @change="stackAddInputValidate"
      />
    </h3-modal>
    <board-org
      v-if="mode"
      v-model="stackAddOrgVisible"
      :mode="mode"
      :unitSelectionRange="unitSelectionRange"
      :excludes="excludes"
      @confirm="addOrgStack"
      @cancel="addOrgCancel"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import { H3Modal, H3Input } from '@h3/thinking-ui';
import { IBoardColumnInfo, FieldPermission } from '../../typings/index';
import { FormControlType } from '../../typings/const';
import { BoardActionType } from '../../store/types';
import { Board } from '../../typings/board';
import BoardStack from './board-stack.vue';
import { parentsUtil } from '../../utils/dom';
import BoardOrg from '../organization/index.vue';
// import 'hammerjs';
import '../../lib/hammerjs';
const lightBoardModule = namespace('LightBoard');

const gutter = (1 / window.devicePixelRatio) * 30;
// const margin = 30;
const Hammer = window.Hammer;

@Component({
  components: {
    BoardStack,
    H3Modal,
    H3Input,
    BoardOrg,
  },
})
export default class BoardLayout extends Vue {
  @Prop() stacks!: IBoardColumnInfo[];

  @State('UserInfo') userInfo ;

  @lightBoardModule.State('board') board!: Board;

  @lightBoardModule.Getter('controlOptions') controlOptions;

  @lightBoardModule.State('boardColumnRecords') boardColumnRecords;

  @lightBoardModule.Action(BoardActionType.GetBoardColumnDatas) getColumnDatas;

  stackWidth = 0;

  stackHeight = 0;

  stackBodyHeight = 0;

  docHeight = 0;

  docWidth = 0;

  isSorting = false;

  slideWrapper = null;

  gutter = gutter;

  newStackValue = '';

  stackAddModalVisible = false;

  stackAddOrgVisible = false;

  addColumnIndex = -1;

  /**
   * 获取人员选择模式
  */
  get mode () {
    if (this.boardColumnType === FormControlType.FormUser ||
      this.boardColumnType === FormControlType.FormCreater ||
      this.boardColumnType === FormControlType.FormOwner) {
      return 'user';
    } else if (this.boardColumnType === FormControlType.FormDepartment ||
      this.boardColumnType === FormControlType.FormOwnerDepartment
    ) {
      return 'org';
    }
    return '';
  }

  get controls () {
    return this.board.controls;
  }

  /**
   * 是否管理员
   */
  get isAdministrator () {
    const appCode: any = this.$route.query.appCode || window.GlobalConfig.appCode;
    const appAdministrator = this.userInfo.adminAppCodes !== null &&
    this.userInfo.adminAppCodes.indexOf(appCode.toLowerCase()) > -1;
    return this.userInfo.isAdministrator || appAdministrator;
  }

  get containerWidth () {
    if (this.isSorting) {
      return `${gutter * 4 + (this.stackWidth + gutter) * this.stacks.length}px`;
    }
    return 'auto';
  }

  get placeholderStyle () {
    if (this.isAdministrator && this.stacks.length < 50) {
      return {
        left: `${(this.stackWidth + gutter) * (this.stacks.length + 1) + gutter * 2}px`,
        width: `${gutter * 2}px`,
      };
    }
    return {
      left: `${(this.stackWidth + gutter) * this.stacks.length + gutter * 2}px`,
      width: `${gutter * 2}px`,
    };
  }

  get stackAddStyle () {
    return {
      left: `${(this.stackWidth + gutter) * this.stacks.length + gutter * 2}px`,
      width: `${this.stackWidth}px`,
    };
  }

  get isWorkflow () {
    return this.board.isWorkflow;
  }

  get showTitle () {
    return this.board.isShowTitle;
  }

  /**
   * 是否必填
   */
  get required () {
    return this.board.permission === FieldPermission.Required;
  }

  /**
   * 是否可编辑
   */
  get editable () {
    return this.board.permission === FieldPermission.Editable || this.board.permission === FieldPermission.Required;
  }

  get enableCreate () {
    return this.board.sheetAction && this.board.sheetAction.add;
  }

  /**
   * 获取看板分类字段
   */
  get boardColumn () {
    return this.controls.find(ctrl => ctrl.FieldCode === this.board.boardColumnField);
  }

  get boardColumnField () {
    return this.board.boardColumnField;
  }

  get cover () {
    return this.board.coverColumn;
  }

  /**
   * 获取分类控件类型
   */
  get boardColumnType () {
    if (this.boardColumn) {
      return this.boardColumn.Type;
    }
    return FormControlType.FormDropDownList;
  }

  /**
   * 获取所有的列值
   */
  get allColumnValues () {
    const ret: string[] = [];
    this.board.stacks.forEach(col => {
      if (!col.IsNewColumn) {
        ret.push(col.ColumnValue);
      }
    });
    return ret;
  }

  /**
   * 获取人员部门控件选择范围
   */
  get unitSelectionRange () {
    if (this.boardColumn && this.boardColumnType !== FormControlType.FormDropDownList) {
      return this.boardColumn.Options.UnitSelectionRange;
    }
    return '';
  }

  get displayFields () {
    return this.board.displayColumns || [];
  }

  get sortFields () {
    return this.board.sortColumns || [];
  }

  get stackMenus () {
    const ret: Array<{ type: string; label: string; code: string}> = [];
    if (this.isAdministrator) {
      if (this.stacks.length < 51) {
        ret.push({
          label: '在此列后添加新列',
          code: 'add',
          type: 'default',
        });
      }
      ret.push({
        label: '删除',
        code: 'remove',
        type: 'default',
      });
    }
    return ret;
  }

  get excludes () {
    if (this.boardColumnType !== FormControlType.FormDropDownList) {
      return this.stacks.map(stack => stack.ColumnValue);
    }
    return [];
  }

  stackAddInputValidate (e) {
    let val = e;
    // 剔除表情符
    val = val.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, '');
    // 剔除空字符
    val = val.replace(/(^\s*)|(\s*$)/g, '');
    // 长度不能超过50
    val = val.substr(0, 50);
    this.newStackValue = val;
  }

  addErrorHandler (ret, index) {
    const sortKey = index > -1 ? index + 1 : this.board.stacks.length - 1;
    this.board.stacks.splice(sortKey, 1);
    this.$toast.show({
      text: ret.ErrorMsg,
    });
  }

  async stackAddConfirm () {
    if (this.newStackValue) {
      // 校验下拉框重复
      if (!this.validateNewColumnValue(this.newStackValue)) {
        this.$toast.show({
          text: '当前输入框值与已有看板列值重复，请确认',
        });
        return;
      }
      this.stackAddModalVisible = false;
      const ret = await this.board.addStack(this.newStackValue, this.newStackValue, '', this.addColumnIndex);
      if (!ret.success) {
        this.addErrorHandler(ret, this.addColumnIndex);
      }
    } else {
      this.$toast.show({
        text: '输入框值不能为空',
      });
    }
    this.addColumnIndex = -1;
  }

  /**
   * 校验新增下拉框列是否重复
   */
  validateNewColumnValue (columnValue) {
    const index = this.stacks.findIndex(stack => stack.ColumnValue === columnValue);
    if (index > -1) {
      return false;
    }
    return true;
  }

  /**
   * 新增人员部门看板列
  */
  async addOrgStack (node: any) {
    const ret = await this.board.addStack(node.id, node.name, node.avatar, this.addColumnIndex);
    if (!ret.success) {
      this.addErrorHandler(ret, this.addColumnIndex);
    } else {
      this.closeOrgStackAddModal();
    }
  }

  addOrgCancel () {
    this.closeOrgStackAddModal();
    this.addColumnIndex = -1;
  }

  stackAddCancel () {
    this.newStackValue = '';
    this.stackAddModalVisible = false;
    this.addColumnIndex = -1;
  }

  sortStatusChange (status: boolean) {
    this.isSorting = status;
  }

  sortStart () {
    this.isSorting = true;
  }

  sortEnd (sortOptions: { from: number; to: number }) {
    this.isSorting = false;
    // 定位到最后排序列
    this.$nextTick(() => {
      const { from, to } = sortOptions;
      if (from !== to) {
        this.board.fastChange(to);
      }
    });
  }

  created () {
    this.docWidth = window.screen.availWidth;
    this.docHeight = window.screen.availHeight;
    this.stackWidth = this.docWidth - gutter * 4;
  }

  mounted () {
    this.slideWrapper = this.$refs.layout;
    this.toggleStack();
  }

  /**
   * 获取新建列名字中的最大数字索引
   */
  getMaxNumberOfIndex (columnValues: string[]) {
    let max = 0;
    columnValues.forEach(val => {
      const num = parseInt(val.substr(val.lastIndexOf('-') + 1));
      if (num > max) {
        max = num;
      }
    });
    return max;
  }

  /**
   * 获取分类列为下拉框时新增列的默认值
  */
  getNewColumnValue () {
    if (this.boardColumnType === FormControlType.FormDropDownList) {
      const regex = /^未命名的列-\d{1,3}$/;
      const ret: string[] = [];
      this.board.stacks.forEach(stack => {
        if (regex.test(stack.ColumnValue)) {
          ret.push(stack.ColumnValue);
        }
      });
      if (ret.length > 0) {
        return `未命名的列-${this.getMaxNumberOfIndex(ret) + 1}`;
      }
      return '未命名的列-1';
    }
  }

  addStack () {
    if (this.boardColumnType === FormControlType.FormDropDownList) {
      // 获取默认名称
      this.newStackValue = this.getNewColumnValue();
      this.stackAddModalVisible = true;
    } else {
      // 人员部门单选
      this.backStack.push(this.closeOrgStackAddModal);
      this.stackAddOrgVisible = true;
    }
  }

  closeOrgStackAddModal () {
    this.stackAddOrgVisible = false;
    this.backStack.pop();
  }

  addStackAfter (index) {
    this.addColumnIndex = index;
    this.addStack();
  }

  isLastColumn () {
    if (!this.isAdministrator && this.board.index === this.stacks.length - 1) {
      return true;
    }
    if (this.isAdministrator && (
      (this.stacks.length < 51 && this.board.index === this.stacks.length) ||
      (this.stacks.length >= 51 && this.board.index === this.stacks.length - 1)
    )) {
      return true;
    }
    return false;
  }

  SmoothHorizontalScrolling (e, time, amount, start) {
    var eAmt = amount / 100;
    var curTime = 0;
    var scrollCounter = 0;
    while (curTime <= time) {
      window.setTimeout(this.SHS_B, curTime, e, scrollCounter, eAmt, start);
      curTime += time / 100;
      scrollCounter++;
    }
  }

  SHS_B (e, sc, eAmt, start) {
    e.scrollLeft = (eAmt * sc) + start;
  }

  /**
   * 水平方向评议
   */
  panHorizontal (ev) {
    if (this.isSorting) {
      return;
    }
    if (Math.abs(ev.deltaX) > 170) {
      return;
    }
    if (ev.type === 'panleft') {
      // 是否达到最大的滚动距离
      const left = this.board.scrollLeft - ev.deltaX;
      const diff = left + this.stackWidth + this.gutter - this.slideWrapper.scrollWidth;
      if (diff > 0 && diff < 60) {
        this.slideWrapper.style.transform = `translateX(${-diff}px)`;
      } else {
        this.slideWrapper.scrollLeft = left;
      }
    } else if (ev.type === 'panright') {
      // 如果已经拉到头了，就用transform 模拟弹性效果
      if (this.board.scrollLeft === 0 && ev.deltaX < 60) {
        this.slideWrapper.style.transform = `translateX(${ev.deltaX}px)`;
      } else {
        const left = this.board.scrollLeft - ev.deltaX;
        this.slideWrapper.scrollLeft = left;
      }
    }
  }

  /**
   * 切换看板列
  */
  toggleStack () {
    const vm = this;
    const manager = new Hammer.Manager(this.slideWrapper);
    // let { scrollLeft } = this.slideWrapper;
    manager.add(new Hammer.Pan({ event: 'pan' }));
    // manager.on('panleft panright', throttle(this.panHorizontal, 100));
    manager.on('panleft panright', (ev: any) => {
      this.panHorizontal(ev);
    });
    manager.on('panend', (ev: any) => {
      if (vm.isSorting) {
        return;
      }
      // let { scrollLeft } = this.slideWrapper;
      const direction = ev.deltaX < 0 ? 'left' : 'right';
      switch (direction) {
        case 'left':
          // 最后一列禁止继续向左滑动
          vm.slideWrapper.style.transform = 'translateX(0px)';
          if (this.isLastColumn()) {
            vm.slideWrapper.scrollLeft = this.board.scrollLeft;
            return;
          }
          if (Math.abs(ev.deltaX) < 100) {
            vm.slideWrapper.scrollLeft = this.board.scrollLeft;
          } else {
            let next;
            if (ev.target.classList.contains('board-stack')) {
              next = ev.target.nextElementSibling;
            } else {
              const parents = parentsUtil(ev.target, '.board-stack', null);
              if (parents.length === 0) {
                next = vm.slideWrapper.children[vm.board.index + 1];
              } else {
                const target = parents[parents.length - 1];
                if (target.tagName === 'HTML') {
                  // 获取当前活动列
                  next = vm.slideWrapper.children[vm.board.index + 1];
                } else {
                  next = parents[parents.length - 1].parentElement.nextElementSibling;
                }
              }
            }
            if (!next) {
              return;
            }
            // slideWrapper.scrollLeft = next.offsetLeft - 30;
            // 分成三段运行
            // const offset = 30 + vm.slideWrapper.scrollLeft;
            // let lastOffset = next.offsetLeft;
            // let left;
            // for (let i = 0; i < 3; i++) {
            //   left = lastOffset - (offset / 3);
            //   lastOffset = left;
            //   const scrollOptions: ScrollToOptions = {
            //     left: left,
            //     top: 0,
            //     behavior: 'smooth',
            //   };
            //   vm.slideWrapper.scrollBy(scrollOptions);
            // }
            // const scrollOptions: ScrollToOptions = {
            //   left: next.offsetLeft - 30 - vm.slideWrapper.scrollLeft,
            //   top: 0,
            //   behavior: 'smooth',
            // };
            // vm.slideWrapper.scrollBy(scrollOptions);
            const amount = next.offsetLeft - 30 - vm.slideWrapper.scrollLeft;
            vm.SmoothHorizontalScrolling(vm.slideWrapper, 150, amount, vm.slideWrapper.scrollLeft);
            vm.board.scrollLeft = next.offsetLeft - 30;
            vm.board.nextStack();
          }
          break;
        case 'right':
          vm.slideWrapper.style.transform = 'translateX(0px)';
          if (Math.abs(ev.deltaX) < 100) {
            vm.slideWrapper.scrollLeft = this.board.scrollLeft;
          } else {
            let prev;
            if (ev.target.classList.contains('board-stack')) {
              prev = ev.target.previousElementSibling;
            } else {
              const parents = parentsUtil(ev.target, '.board-stack', null);
              if (parents.length === 0) {
                prev = vm.slideWrapper.children[vm.board.index - 1];
              } else {
                const target = parents[parents.length - 1];
                if (target.tagName === 'HTML') {
                  // 获取当前活动列
                  prev = vm.slideWrapper.children[vm.board.index - 1];
                } else {
                  prev = parents[parents.length - 1].parentElement.previousElementSibling;
                }
              }
            }
            if (!prev) {
              return;
            }
            // const scrollOptions: ScrollToOptions = {
            //   left: prev.offsetLeft - 30 - vm.slideWrapper.scrollLeft,
            //   top: 0,
            //   behavior: 'smooth',
            // };
            // vm.slideWrapper.scrollBy(scrollOptions);
            const amount = prev.offsetLeft - 30 - vm.slideWrapper.scrollLeft;
            vm.SmoothHorizontalScrolling(vm.slideWrapper, 150, amount, vm.slideWrapper.scrollLeft);
            this.board.scrollLeft = prev.offsetLeft - 30;
            vm.board.prevStack();
          }
          break;
        default:
          break;
      }
    });
  }
}

</script>
<style lang='less' scoped>
@import '~@/styles/light-app.less';
.board-layout {
  position: absolute;
  left: 0;
  right: 0;
  .px2rem(bottom, 44);
  .px2rem(top, 84);
  overflow-x: auto;
  overflow-y: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
  * {
    user-select: none;
  }
  &__stack-placeholder {
    position: absolute;
    height: 100%;
  }
  &__stack-add {
    position: absolute;
    & > div {
      display: flex;
      align-items: center;
      justify-content: center;
      .px2rem(height, 88);
      .px2rem(border-radius, 44);
      background:rgba(235,237,242,1);
      border:1px solid rgba(235,237,242,1);
      color: #333;
      i {
        .px2rem(margin-right, 16);
      }
      span {
        .px2rem(font-size, 30);
      }
    }
  }
}
</style>
<style lang="less">
.board-layout__modal-add {
  /deep/ .h3think-input--border {
    &::before {
      border: 1px solid#ddd !important;
    }
  }
}
</style>
