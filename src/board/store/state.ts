import {
  IBoardSortColumn, IBoardFilterColumn, IBoardControl, IBoardDisplayColumn,
  IBoardRecordModal, IBoardColumnInfo, FieldPermission,
} from '../typings';
import { Board } from '../typings/board';

const board = Board.getInstance();

export default board;
// export default class BoardState {

  // SchemaCode = '';

  // HasBoardSetting: boolean = false; // 是否启用了看板

  // BoardId: string = ''; // 看板id

  // SortColumns : IBoardSortColumn[] = []; // 排序字段

  // FilterColumns: IBoardFilterColumn[] = []; // 筛选字段

  // DisplayColumns: IBoardDisplayColumn[] = []; // 显示字段

  // GroupColumn: string = ''; // 分组字段

  // GroupDefaultValue: string = ''; // 分组默认值

  // BoardColumnInfos: IBoardColumnInfo[] = []; // 看板列配置

  // BoardColumnField: string = ''; // 分组字段

  // Controls: IBoardControl[] = []; // 表单数组

  // Permission: FieldPermission = FieldPermission.Editable; // 权限

  // SheetAction: {[key: string]: boolean}= {}; // 表单操作权限

  // EnableWorkflow: boolean = false; // 是否启用流程

  // ShowTitle: boolean = true; // 是否显示标题

  // CoverColumn: string = ''; // 封面字段

  // BoardColumnRecords: IBoardRecordModal = {}; // 分列数据

  // IsFixedSide: boolean = false; // 分组是否固定侧边栏

  // PageSize = 10; // 分页size

  // ResetFlag = false; // 重置标识

  // IsFixedDefault = false; // 是否是点击了固定侧栏，此时不用固定侧栏宽度就是默认，而不是去取缓存宽度

  // ColorSetting = []; // 看板颜色设置

// };
