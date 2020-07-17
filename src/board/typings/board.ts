import { IBoardColumnRecord, IBoardSettingDataModel,IBoardColumnInfo, UnclassifiedField } from './index';
import { BoardActionType, BoardMutationType } from '../store/types';
import { deleteColumn, addColumn } from '../apis';
import { IGuid } from '../utils';

interface IBoardData {
  prev: IBoardColumnRecord,
  current: IBoardColumnRecord,
  next: IBoardColumnRecord
}

export interface IBoardState {
  board: Board | any;
  boardColumnRecords: any;
  editingStackValue: string; // 编辑的表单编码
};


let boardInstance = null;
/**
 * 看板实例
 */
export class Board {
  // private static instance = null; // 单例对象
  objectId = '';
  schemaCode = '';
  totalSize = 0; 
  index = 0;
  stacks: any[] = [];
  cards: IBoardData = null;
  boardColumnField = '';
  sortColumns = null;
  filterColumns= null;
  displayColumns = null;
  groupColumn = '';
  // groupDefaultValue = '';
  groupConfig = null;
  // dateTimeFormat = 0;
  colors = null;
  controls= null;
  isFixedSide = false;
  isColumnExceed = false; // 是否超过列数
  coverColumn = ''; // 卡片封面字段
  isShowTitle = true; // 卡片是否显示控件标题
  isWorkflow = false;
  permission = 0;
  sheetAction = null;
  dispatch = null; // vuex dispatch 对象
  scrollLeft = 0;
  private pageIndex = 0;// 列按需加载分页
  // private boardLayout = null; // 看板列容器
  private gutter = (1 / window.devicePixelRatio) * 30;
  private stackWidth = window.screen.availWidth - this.gutter * 4;

  private constructor() {

  }

  /**
   * 添加看板列
   * @param id 
   * @param columnValue 
   * @param title 
   * @param imageUrl 
   */
  async addStack (columnValue: string, displayName = '', ImgUrl = '', index = -1) {
    const sortKey = index > -1 ? index + 1 : this.stacks.length + 1;
    const newStack: IBoardColumnInfo = {
      SchemaCode: this.schemaCode,
      BoardColumn: this.boardColumnField,
      ObjectId: IGuid(), // 唯一id，guid类型
      SortKey: sortKey, // 排序码
      ColumnValue: columnValue, // 列值
      DisplayName: displayName,
      IsCollapsed: false,
      IsNewColumn: false, // 是否是新增的，如果是新增的，可以编辑标题
      ImgUrl: ImgUrl
    };
    if (index > -1) {
      this.stacks.splice(index+1, 0, newStack);
    } else {
      this.stacks.push(newStack);
    }
    const ret = await addColumn(this.objectId, newStack);
    if (ret.success) {
      this.getColumnDatas([UnclassifiedField, columnValue]);
    }
    return ret;
  }
  /**
   * 删除看板列
   */
  async removeStack(id: string) {
    const ret = await deleteColumn(id);
    if (ret.success) {
      const index = this.stacks.findIndex(stack => stack.ObjectId === id);
      if (index > -1) {
        this.stacks.splice(index, 1);
        // 更新未分类列数据
        this.getColumnDatas([UnclassifiedField]);
      }
    }
    return ret;
    
  }
  updateSortSetting() {

  }
  updateGroupSetting() {

  }
  updateFilterSetting() {

  }
  fastPosition(index, boardColumnRecords) {
    this.changeIndex(index);
    // 判断数据是否已经加载完毕
    const columnValue = this.stacks[index].ColumnValue;
    const columnRecords = boardColumnRecords[columnValue];
    if (columnRecords && columnRecords.Count === 0) {
      this.getColumnDatas([columnValue]);
    }
  }
  prevStack() {
    this.index -= 1;
  }
  nextStack() {
    this.index += 1;
  }
  loadMore() {

  }

  /**
   * 获取首屏的数据
   */
  getFirstPageDatas() {
    const columnValues = this.stacks.slice(0, 3).map(col => col.ColumnValue);
    this.getColumnDatas(columnValues);
  }

  /**
   * 配置变更后刷新所有数据
   */
  refreshDatas (isFirst = false) {
    // 除加载首屏数据外， 其它列数据分批加载
    if (isFirst) {
      if (this.stacks.length > 1) {
        this.changeIndex(1);
      } else {
        this.changeIndex(0);
      }
    }
    this.getFirstPageDatas();
    const len = this.stacks.length;
    const total = Math.ceil(len / 3);
    for (let i = 1; i < total; i++) {
      setTimeout(async () => {
        const startIndex = i * 3;
        const cols = this.stacks.slice(startIndex, startIndex + 3);
        this.getColumnDatas(cols.map(col => col.ColumnValue));
      }, i * 1000);
    }
    // for (let i = 0; i < len; i++) {
    //   setTimeout(async () => {
    //     const columnValue = this.stacks[i + 3].ColumnValue;
    //     this.getColumnDatas([columnValue]);
    //   }, (i+1) * 1000);
    // }
  }

  /**
   * 跳转到对应卡片列
   * @param index 
   */
  changeIndex(index: number) {
    if (index === this.index) return;
    const boardLayout = document.querySelector('.board-layout');
    const { offsetLeft } = boardLayout.children[index] as any;
    const scrollOptions: ScrollToOptions = {
      left: offsetLeft- 30 - boardLayout.scrollLeft,
      top: 0,
      behavior: 'smooth',
    };
    boardLayout.scrollBy(scrollOptions);
    this.scrollLeft = offsetLeft - 30;
    this.index = index;
  }

  fastChange(index: number) {
    // if (index === this.index) return;
    const boardLayout = document.querySelector('.board-layout');
    const { offsetLeft } = boardLayout.children[index] as any;
    const scrollOptions: ScrollToOptions = {
      left: offsetLeft- 30 - boardLayout.scrollLeft,
      top: 0,
    };
    boardLayout.scrollBy(scrollOptions);
    this.scrollLeft = offsetLeft - 30;
    this.index = index;
  }

  /**
   * 获取看班列数据
   */
  private getColumnDatas (columnValues) {
    this.dispatch(BoardActionType.GetBoardColumnDatas, {
      columnValues,
      pageIndex: 0,
      isLoadMore: false,
    });
  }

  /**
   * 初始化方法
  */
  init(options: IBoardSettingDataModel, dispatch: any) {
    this.objectId = options.ObjectId;
    this.schemaCode = options.SchemaCode;
    this.groupColumn = options.GroupColumn || '';
    this.groupConfig = options.GroupConfig || null;
    // this.groupDefaultValue = options.GroupDefaultValue || '';
    this.isFixedSide = options.IsFixedSide;
    // this.dateTimeFormat = options.DateTimeFormat;
    this.index = 0;
    this.boardColumnField = options.BoardColumn;
    this.sortColumns = options.SortColumns;
    this.displayColumns = options.DisplayColumns;
    this.filterColumns = options.FilterColumns;
    this.isShowTitle = options.IsShowTitle;
    this.isWorkflow = options.IsWorkflow;
    this.coverColumn = options.CoverColumn;
    this.stacks = options.BoardColumnInfos;
    this.colors = options.Colors;
    this.controls = options.Controls;
    this.sheetAction = options.SheetAction;
    this.permission = options.Permission;
    this.dispatch = dispatch;
  }

  /**
   * 获取单例对象
  */
  static getInstance () {
    if (!boardInstance) {
      boardInstance= new Board();
    }
    return boardInstance;
  }
}