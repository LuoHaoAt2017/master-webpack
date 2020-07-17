import { MutationTree } from 'vuex';
import { IBoardState, Board } from '../typings/board';
import { BoardMutationType } from './types';
import { IGuid } from '../utils';
import {
  IBoardSettingDataModel,
  IBoardFilterColumn,
  IBoardControl,
  IGroupConfig,
  // IBoardColumnInfo,
  IBoardSortColumn,
  UnclassifiedField,
  FieldPermission,
  // IBoardDisplayColumn,
  // IBoardColumnRecord,
  // IBoardColorSetting,
} from '../typings';
import { FormControlType } from '../typings/const';
const unclassifiedStackId = IGuid();

const mutations: MutationTree<IBoardState> = {
  [BoardMutationType.InitData] (state, payload: { 
    SchemaCode: string;
    HasBoardSetting: boolean; 
    Data:IBoardSettingDataModel; 
    Controls: IBoardControl[];
    Permission: FieldPermission; 
    SheetAction: {[key:string]: boolean};
    IsWorkflow: boolean; 
    Filter: IBoardFilterColumn[]; 
    GroupConfig:IGroupConfig; 
    SortConfig:IBoardSortColumn[]; 
    dispatch: any; 
  }) {
    let {
      ObjectId, BoardColumn, BoardColumnInfos, GroupColumn,
      CoverColumn, IsShowTitle, IsFixedSide, DisplayColumns, Colors,
    } = payload.Data;
      // const { DefaultValue, DateTimeFormat } = payload.GroupConfig;
    const { dispatch } = payload;
    const unclassifiedStack = {
      ObjectId: unclassifiedStackId,
      DisplayName: '未分类',
      SortKey: 0,
      IsNewColumn: false,
      ImgUrl: null,
      IsCollapsed: false,
      ColumnValue: UnclassifiedField,
    };
    if (!BoardColumnInfos) {
      BoardColumnInfos = [];
    }
    BoardColumnInfos.unshift(unclassifiedStack);
    const boardSetting: IBoardSettingDataModel = {
      ObjectId: ObjectId || '',
      SchemaCode: payload.SchemaCode,
      BoardColumn: BoardColumn,
      Controls: payload.Controls,
      SortColumns: payload.SortConfig || [],
      DisplayColumns: DisplayColumns || [],
      FilterColumns: payload.Filter || [],
      CoverColumn,
      IsShowTitle,
      BoardColumnInfos: BoardColumnInfos || [],
      Permission: payload.Permission,
      SheetAction: payload.SheetAction,
      IsFixedSide,
      Colors: Colors || [],
      IsWorkflow: payload.IsWorkflow,
      GroupColumn,
      // GroupDefaultValue: DefaultValue,
      GroupConfig: payload.GroupConfig,
    };
    const board = Board.getInstance();
    board.init(boardSetting, dispatch);
    state.board = board;
    state.boardColumnRecords = {};
  },

  [BoardMutationType.SetBoardColumnDatas] (state, payload: {columnValues: string[];
    isLoadMore: boolean; BoardDatas: {[key: string]: any};}) {
    const { columnValues, isLoadMore, BoardDatas } = payload;
    if (!isLoadMore) {
      // 非加载更多模式下，如果返回的BoardDatas下键值不存在，则说明没有数据，数据重置为空
      columnValues.forEach(column => {
        if (!BoardDatas[column]) {
          BoardDatas[column] = { Count: 0, Datas: [], PageIndex: 0 };
        } else {
          BoardDatas[column].PageIndex = 0;
        }
      });
      const data = Object.assign({}, state.boardColumnRecords, BoardDatas);
      state.boardColumnRecords = data;
    } else {
      // 加载更多模式下， 如果返回的BoardDatas下键值不存在，则说明没有更多的数据了，不做处理
      columnValues.forEach(column => {
        const record = BoardDatas[column];
        if (record) {
          const columnRecordModel = state.boardColumnRecords[column];
          if (columnRecordModel) {
            columnRecordModel.Count = record.Count;
            columnRecordModel.Datas = columnRecordModel.Datas.concat(record.Datas);
            columnRecordModel.PageIndex += 1;
          }
        }
      });
    }
  },

  [BoardMutationType.InitColumnDatas] (state, columns) {
    columns.forEach(col => {
      state.boardColumnRecords[col] = { Count: 0, Datas: [], PageIndex: 0 };
    });
  },

  [BoardMutationType.GroupColumnChange] (state, val:string) {
    state.board.groupColumn = val;
  },

  [BoardMutationType.SortColumnsChange] (state, val:IBoardSortColumn[]) {
    state.board.sortColumns = val;
  },

  [BoardMutationType.ResetFilterSetting] (state, payload) {
    state.board.filterColumns = payload;
  },

  [BoardMutationType.BoardGroupConfigChange] (state, 
    payload: {
      columnCode: string | null ; 
      controlType: number; 
      defaultValue: string; 
      dateTimeFormat: number 
    }) {
    
      state.board.groupConfig = {
      ColumnCode: payload.columnCode,
      ControlType: payload.controlType,
      DefaultValue: payload.defaultValue,
      DateTimeFormat: payload.dateTimeFormat, // 日期格式
    };
  },

  // [BoardMutationType.AddField] (state, column: IBoardControl) {
  //   state.Controls.push(column);
  //   state.BoardColumnField = column.FieldCode;
  // },

  // [BoardMutationType.BoardColumnFieldChange] (state, boardColumnField:string) {
  //   state.BoardColumnField = boardColumnField;
  // },

  // [BoardMutationType.InitDisplayColumn] (state, initDisplay) {
  //   const column = initDisplay();
  //   if (column) {
  //     state.DisplayColumns = column;
  //   }
  // },

  // [BoardMutationType.AddColumn] (state, column: IBoardColumnInfo) {
  //   state.BoardColumnInfos.push(column);
  //   const newData: IBoardColumnRecord = {
  //     Count: 0,
  //     Datas: [],
  //   };
  //   state.BoardColumnRecords = Object.assign({}, state.BoardColumnRecords, { columnValue: newData });
  // },

  // [BoardMutationType.SetCardTargetValue] (state, payload: { stackValue: string; index: number }) {
  //   const columnValue = payload.stackValue || UnclassifiedField;
  //   const columnRecordModel = state.BoardColumnRecords[columnValue];
  //   if (columnRecordModel) {
  //     columnRecordModel.Datas.splice(payload.index, 1);
  //     columnRecordModel.Count -= 1;
  //   }
  // },

  [BoardMutationType.RemoveForm] (state, payload: { stackValue: string; id: string }) {
    const columnValue = payload.stackValue || UnclassifiedField;
    const columnRecordModel = state.boardColumnRecords[columnValue];
    if (columnRecordModel) {
      const index = columnRecordModel.Datas.findIndex(card => card.Code === payload.id);
      if (index > -1) {
        columnRecordModel.Datas.splice(index, 1);
        columnRecordModel.Count -= 1;
      } else {
        columnRecordModel.Count -= 1;
      }
    }
  },

  // // [BoardMutationType.ToggleCollapseAll] (state, collapsed) {
  // //   state.BoardColumnInfos.forEach(column => column.IsCollapsed === !collapsed);
  // // },
  // [BoardMutationType.GroupColumnChange] (state, val:string) {
  //   state.GroupColumn = val;
  // },

  // [BoardMutationType.GroupDefaultValueChange] (state, val:string) {
  //   state.GroupDefaultValue = val;
  // },

  // [BoardMutationType.IsFixedDefaultChange] (state, val:boolean) {
  //   state.IsFixedDefault = val;
  // },

  // [BoardMutationType.SortColumnsChange] (state, val:IBoardSortColumn[]) {
  //   state.SortColumns = val;
  // },

  // [BoardMutationType.DisplayOrder] (state, list:IBoardDisplayColumn[]) {
  //   state.DisplayColumns = list;
  // },

  // [BoardMutationType.ResetColorSetting] (state, setting:IBoardColorSetting[]) {
  //   state.ColorSetting = setting;
  // },
  [BoardMutationType.RemoveStackData] (state, payload: {columnValue: string; bizObjectId: string}) {
    const { columnValue, bizObjectId } = payload;
    const columnRecordModel = state.boardColumnRecords[columnValue || UnclassifiedField];
    if (columnRecordModel) {
      const index = columnRecordModel.Datas.findIndex(card => card.Code === bizObjectId);
      if (index > -1) {
        columnRecordModel.Datas.splice(index, 1);
        columnRecordModel.Count -= 1;
      } else {
        columnRecordModel.Count -= 1;
      }
    }
  },
  [BoardMutationType.AddStackData] (state, payload: {columnValue: string; form: any}) {
    const { columnValue, form } = payload;
    const columnRecordModel = state.boardColumnRecords[columnValue || UnclassifiedField];
    if (columnRecordModel) {
      columnRecordModel.Datas.unshift(form);
      columnRecordModel.Count += 1;
    }
  },

  [BoardMutationType.UpdateCard] (state, payload: {type: FormControlType; columnValue: string;
     element: any; avatar: string; name: string;}) {
    const {
      type, columnValue, element, avatar, name,
    } = payload;
    const { boardColumnField } = state.board;
    const columnRecordModel = state.boardColumnRecords[columnValue || UnclassifiedField];
    if (type !== FormControlType.FormDropDownList) {
      if (!columnValue || columnValue === UnclassifiedField) {
        element.cellValues[boardColumnField] = [];
      } else {
        element.cellValues[boardColumnField] = [{
          Avatar: avatar,
          Name: name,
          UnitId: columnValue,
        }];
      }
    } else {
      element.cellValues[boardColumnField] = columnValue;
    }
    columnRecordModel.Count += 1;
  },

  [BoardMutationType.ResetBoard] (state, payload) {
    state.board = {};
    state.boardColumnRecords = [];
  },
  [BoardMutationType.CorrectFilterColumns] (state, payload) {
    state.board.filterColumns = payload;
  },
  [BoardMutationType.SetFormEditingInfo] (state, stackValue: string) {
    state.editingStackValue = stackValue;
  },
};

export default mutations;
