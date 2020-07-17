<template>
  <div class="group-field">
    <group-field-editor
      :title="editorTitle"
      :showModel="groupEditorModel"
      :controls="groupCtrols"
      :value="groupColumn"
      @closeModel="closeEditorModel"
      @editorOk="editorOk"
    />
    <group-field-search
      ref="groupFildSearch"
      :showModel="grouplistModel"
      :options="fieldSoure"
      :searchOptions="searchFieldSoure"
      :fieldItem="fieldItem"
      :total="total"
      :searchTotal="searchTotal"
      :pageIndex="pageIndex"
      @showEditor="showEditor"
      @search="groupSearch"
      @select="selectChange"
      @updateData="updateData"
      @formatChange="formatChange"
      @modeChange="modeChange"
      @closeModel="closeListModel"
    />
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import {
  State, Getter, Mutation, Action, namespace,
} from 'vuex-class';
import { BoardMutationType } from '../../store/types';
import {
  IconMap, FormControlType, boardEvent, BoardGroupDateFormat, BoardGroupAllValue,
} from '../../typings/const';
import { IBoardControl, GroupColumnItem } from '../../typings';
import GroupFieldEditor from './group-field-editor.vue';
import GroupFieldSearch from './group-field-search.vue';

import HandleNumber from '../../utils/handle-number';
import { isDingtalk, isiOS } from '@/config/common';
import { Board } from '../../typings/board';
import { getGroupColumn } from '../../apis';
import cloneDeep from 'lodash/cloneDeep';

const LightBoardModule = namespace('LightBoard');
// import { getControlValue } from '../../utils/board-utils';

// 分组支持的控件类型
const GroupFieldTypes = [
  FormControlType.FormTextBox, // 单行文本
  FormControlType.FormDropDownList, // 下拉框
  FormControlType.FormDateTime, // 日期
  FormControlType.FormNumber, // 数字
  FormControlType.FormUser, // 人员单选
  FormControlType.FormDepartment, // 部门单选
  FormControlType.FormOwner, // 拥有者
  FormControlType.FormCreater, // 创建人
  FormControlType.FormOwnerDepartment, // 所属部门
  // FormControlType.FormAreaSelect, // 地址
  FormControlType.FormQuery, // 关联表单
];

const DateFormatMap = {
  'yyyy-mm-dd': [BoardGroupDateFormat.Year, BoardGroupDateFormat.Month, BoardGroupDateFormat.Day],
  'yyyy-mm': [BoardGroupDateFormat.Year, BoardGroupDateFormat.Month],
  'yyyy-mm-dd hh:mm': [BoardGroupDateFormat.Year, BoardGroupDateFormat.Month, BoardGroupDateFormat.Day],
};

const YearMonth = 'yyyy-mm';

@Component({
  name: 'group-field',
  components: {
    GroupFieldEditor,
    GroupFieldSearch,
  },

})
export default class GroupField extends Vue {
  @State('UserInfo') userInfo ;

  @LightBoardModule.State('board') board!: Board;

  @LightBoardModule.Mutation(BoardMutationType.GroupColumnChange) groupColumnChange;

  @LightBoardModule.Mutation(BoardMutationType.BoardGroupConfigChange) boardGroupConfigChange;

  fieldSoure: GroupColumnItem[] = []; // 每个字段对应下的数据

  searchFieldSoure: GroupColumnItem[] = []; // 搜索模式对应数据

  total: number = 0; // 分组字段的 下数据总的条数

  searchTotal:number = 0;

  pageIndex: number = 0; // 分页，默认是0

  searchPageIndex :number = 0; // 搜索模式分页 ,默认是 0

  editorGroupStatus = false;

  groupEditorModel = false;

  grouplistModel = false;// 分组值弹窗

  editorTitle ='请选择一个字段进行分组';

  get schemaCode () {
    return this.board.schemaCode;
  }

  get groupColumn () {
    return this.board.groupColumn;
  }

  /**
   * 是否管理员
   */
  get isAdministrator () {
    const appCode: any = this.$route.query.appCode;
    const appAdministrator = this.userInfo.adminAppCodes !== null &&
    this.userInfo.adminAppCodes.indexOf(appCode.toLowerCase()) > -1;
    return this.userInfo.isAdministrator || appAdministrator;
  }

  /**
   * 分组需要过滤字段
  */
  get filterField () {
    return this.board.boardColumnField;
  }

  get isDingtalk () {
    return isDingtalk;
  }

  /**
   * 获取分组字段数据源
   */
  get groupCtrols () {
    if (!this.board.controls) {
      return [];
    }
    const controls = [];
    cloneDeep(this.board.controls).map((col) => {
      if (GroupFieldTypes.indexOf(col.Type) > -1 && col.FieldCode !== this.filterField) {
        if (col.Type === FormControlType.FormDateTime && col.Options.DateTimeMode === 'hh:mm') {
          return;
        }
        col.Icon = IconMap[FormControlType[col.Type]];
        controls.push(col);
      }
    });
    return controls;
  }

  /**
   * 获取当前选中选中的控件项
  */
  get fieldItem () {
    const item = this.groupCtrols.find(opt => opt.FieldCode === this.groupColumn);
    return item;
  }

  /**
  * 获取当前控件的类型
 */
  get fieldType () {
    if (this.fieldItem) {
      return this.fieldItem.Type;
    }
    return FormControlType.FormTextBox;
  }

  @Watch('groupEditorModel')
  groupEditorModelChange (newVal) {
    if (!newVal) {
      this.colseGroupModel();
    }
  }

  @Watch('grouplistModel')
  grouplistModelChange (newVal) {
    if (!newVal) {
      this.colseGroupModel();
    }
  }

  created () {
    setTimeout(async () => {
      this.groupConfigChange();
      if (this.groupColumn) {
        this.grouplistModel = true;
        await this.getFiedldSource(this.groupColumn, this.pageIndex);
        this.$nextTick(() => {
          (this.$refs.groupFildSearch as any).searchKey = '';
          (this.$refs.groupFildSearch as any).doRefresh();
          (this.$refs.groupFildSearch as any).scrollToTarget();
        });
      } else {
        this.$modal.alert({
          title: '提示',
          content: `${this.isAdministrator ? '请前往电脑端设置分组' : '管理员暂未设置分组'}`,
          onConfirm: () => {
            this.$emit('closeFieldModel');
          },
        });
        // if (this.isAdministrator) {
        //   this.groupEditorModel = true;
        // } else {
        //   this.$modal.alert({
        //     title: '提示',
        //     content: '管理员暂未设置分组',
        //     onConfirm: () => {
        //       this.$emit('closeFieldModel');
        //     },
        //   });
        // }
      }
    }, 0);
  }

  mounted () {
  }

  /**
   *  分组字段选择事件
  */
  async editorOk (item) {
    this.pageIndex = 0; // 切换了分组字段，页码变0
    this.grouplistModel = true;
    if (this.groupColumn !== item.FieldCode) { // 选中的分组字段
      this.groupColumnChange(item.FieldCode);
      this.setDefalutGroup();
      this.$emit('update-group-field', item.FieldCode);
      await this.getFiedldSource(this.groupColumn, this.pageIndex);
      this.$nextTick(() => {
        (this.$refs.groupFildSearch as any).searchKey = '';
        (this.$refs.groupFildSearch as any).doRefresh();
        (this.$refs.groupFildSearch as any).groupScrollReset();
      });
    }
  }

  /**
   * 初始未选中，前端分组值处理 和 更改控件类型 比如日期控件更改类型
  */
  groupConfigChange () {
    const item = this.groupCtrols.find(col => col.FieldCode === this.groupColumn);
    if (item) {
      if (!this.board.groupConfig) { // 用户初始分组,未配置
        this.setDefalutGroup();
      } else {
        const boardGroupConfig = this.board.groupConfig;
        // 旧数据 boardGroupConfig.ControlType, ColumnCode 存在为  null情况
        if (boardGroupConfig.ControlType && boardGroupConfig.ColumnCode &&
        (boardGroupConfig.ControlType !== this.fieldType || boardGroupConfig.ColumnCode !== this.groupColumn)) {
          this.setDefalutGroup(); // 假如 分组配置 类型 或者 code 与 返回 不同 即 重置
        } else {
          this.isResetGroup(item);
        }
      }
    } else {
      this.boardGroupConfigChange({ columnCode: '', controlType: '', defaultValue: BoardGroupAllValue, dateTimeFormat: BoardGroupDateFormat.Unspecified });
      this.groupColumnChange('');
    }
  }

  /**
   * 设置默认分组值
  */
  setDefalutGroup () {
    if (this.fieldType === FormControlType.FormDateTime) { // 切换字段到日期
      if (this.fieldItem.Options.DateTimeMode === YearMonth) {
        this.boardGroupConfigChange({ columnCode: this.groupColumn, controlType: this.fieldType, defaultValue: BoardGroupAllValue, dateTimeFormat: BoardGroupDateFormat.Month });// 默认 月
      } else {
        this.boardGroupConfigChange({ columnCode: this.groupColumn, controlType: this.fieldType, defaultValue: BoardGroupAllValue, dateTimeFormat: BoardGroupDateFormat.Day }); // 默认 日
      }
    } else {
      this.boardGroupConfigChange({
        columnCode: this.groupColumn,
        controlType: this.fieldType,
        defaultValue: BoardGroupAllValue,
        dateTimeFormat: BoardGroupDateFormat.Unspecified, // 日期格式
      });
    }
  }

  isResetGroup (item) { // 分组字段 是在 控件中存在;如果不在，分组需要 重置
    if (this.fieldType === FormControlType.FormDateTime) { // 存在日期 更改
      if (DateFormatMap[item.Options.DateTimeMode].indexOf(this.board.groupConfig.DateTimeFormat) < 0) { // 格式不同
        if (item.Options.DateTimeMode === YearMonth) {
          this.boardGroupConfigChange({ columnCode: this.groupColumn, controlType: this.fieldType, defaultValue: BoardGroupAllValue, dateTimeFormat: BoardGroupDateFormat.Month });// 默认 月
        } else {
          this.boardGroupConfigChange({ columnCode: this.groupColumn, controlType: this.fieldType, defaultValue: BoardGroupAllValue, dateTimeFormat: BoardGroupDateFormat.Day }); // 默认 日
        }
      }
    } else { // 不是日期控件
      if (this.board.groupConfig.DateTimeFormat !== BoardGroupDateFormat.Unspecified) {
        this.boardGroupConfigChange({ columnCode: this.groupColumn, controlType: this.fieldType, defaultValue: BoardGroupAllValue, dateTimeFormat: BoardGroupDateFormat.Unspecified });
      } // 旧数据 存在 columnCode：null controlType:0
    }
  }

  /**
   * 请求当前分组字段下的数据
  */
  async getFiedldSource (fieldCode, pageIndex, searchKey = '') {
    const data = {
      pageIndex: pageIndex,
      PageSize: 50,
      ColumnCode: fieldCode,
      SchemaCode: this.schemaCode,
      DateTimeFormat: this.board.groupConfig.DateTimeFormat,
      HasTotalCount: true,
      SearchKey: searchKey,
    };
    const ret = await getGroupColumn(data);
    if (ret.success && ret.returnData && ret.returnData.Datas) {
      searchKey ? this.searchTotal = ret.returnData.Count : this.total = ret.returnData.Count;
      const fieldSoure = ret.returnData.Datas; // .filter(it => it.value);
      const groupDefaultValue = ret.returnData.GroupDefaultValue;
      if (this.fieldType === FormControlType.FormNumber) { // 数字
        if (this.fieldItem && this.fieldItem.Options) {
          const decimalPlaces = this.fieldItem.Options.DecimalPlaces;
          const showMode = this.fieldItem.Options.ShowMode;
          fieldSoure.forEach((it) => {
            if (it.name) {
              it.name = HandleNumber(it.name, decimalPlaces, -1, showMode);
            }
          });
        }
      }
      if (pageIndex === 0) {
        searchKey ? this.searchFieldSoure = fieldSoure : this.fieldSoure = fieldSoure;
      } else {
        searchKey ? this.searchFieldSoure = this.searchFieldSoure.concat(fieldSoure) : this.fieldSoure = this.fieldSoure.concat(fieldSoure);
      }
      if (!searchKey && pageIndex === 0) { // 第一页添加所有记录这项
        const value = groupDefaultValue.value;
        if (!this.board.groupConfig.DefaultValue) {
          this.fieldSoure.unshift({ name: '', value: '' }); // 加上空的
        }
        if (value && value !== BoardGroupAllValue && value === this.board.groupConfig.DefaultValue) {
          const list = this.fieldSoure.find(it => it.value === value);
          if (!list) { // 不存在 并且不是切换分组字段
            this.fieldSoure.unshift(groupDefaultValue);
          }
        }
        this.fieldSoure.unshift({ name: '所有记录', value: BoardGroupAllValue });
      }
      // 存在之前数据添加，需要去重，注意去重前面保留后面。
      if (!searchKey) {
        this.removeRepeat(this.fieldSoure);
      }
      return ret;
    }
  }

  /**
   * 编辑按钮点击
  */
  showEditor () {
    this.editorTitle = '修改分组字段';
    this.groupEditorModel = true;
  }

  groupSearch (searchKey) {
    this.searchPageIndex = 0;
    this.searchTotal = 0;
    this.searchFieldSoure = [];
    this.getFiedldSource(this.groupColumn, this.searchPageIndex, searchKey);
  }

  /**
  *数据列表选择
 */
  selectChange (item, model) {
    if (this.board.groupConfig.DefaultValue !== item.value) { // 和传进来相同则不处理
      this.boardGroupConfigChange({ columnCode: this.groupColumn, controlType: this.fieldType, defaultValue: item.value, dateTimeFormat: this.board.groupConfig.DateTimeFormat });
      this.$emit('update-group-value');
      if (!model) { // 非搜索模式
        this.grouplistModel = false;
      }
    }
  }

  /**
   * 分页更新数据
  */
  updateData (num, searchKey) {
    if (searchKey) { // 搜索模式
      this.searchPageIndex = num - 1;
      this.getFiedldSource(this.groupColumn, this.searchPageIndex, searchKey);
    } else {
      this.pageIndex = num - 1;
      this.getFiedldSource(this.groupColumn, this.pageIndex);
    }
  }

  /**
   * 年、月、日 切换
  */
  async formatChange (val) {
    this.boardGroupConfigChange({ columnCode: this.groupColumn, controlType: this.fieldType, defaultValue: BoardGroupAllValue, dateTimeFormat: val });
    this.$emit('update-group-value');
    this.pageIndex = 0;
    await this.getFiedldSource(this.groupColumn, this.pageIndex);
    this.$nextTick(() => {
      (this.$refs.groupFildSearch as any).searchKey = '';
      (this.$refs.groupFildSearch as any).doRefresh();
      (this.$refs.groupFildSearch as any).groupScrollReset();
    });
  }

  modeChange () {

  }

  /**
   * 关闭分组model
  */
  closeEditorModel () {
    this.groupEditorModel = false;
  }

  /**
   * 关闭分组值弹窗
  */
  closeListModel () {
    this.grouplistModel = false;
  }

  removeRepeat (data) {
    const obj = {};
    const newData = data.reduce((cur, next) => {
      const index = cur.findIndex(it => it.value === next.value);
      obj[next.value] ? cur.splice(index, 1) && cur.push(next) : obj[next.value] = true && cur.push(next);
      return cur;
    }, []);
    this.fieldSoure = newData;
  }

  colseGroupModel () {
    if (!this.groupEditorModel && !this.grouplistModel) {
      this.$emit('closeFieldModel');
    }
  }

  beforeDestroy () {
    this.$modal.hide();
  }
}
</script>

<style lang='less' scoped>
@import '~@/styles/light-app.less';
.lightlist-set-modal {
  top: 1.30666667rem !important;
}
.group-field {

}

.group-panel{
   height:100%;
}

</style>
