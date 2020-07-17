import { ActionTree } from 'vuex';
import { IBoardState } from '../typings/board';
import {
  IBoardSortColumn, IBoardFilterColumn, UnclassifiedField, IBoardSingleDataRequest,
} from '../typings';
import { FormControlType } from '../typings/const';
import { BoardActionType, BoardMutationType } from './types';
import {
  initData, updateFormValue, getNewForm, changeDisplayMode,
  getBoardData, boardColumnSort, deleteColumn, addColumn as addBoardColumn,
} from '../apis';

const actions: ActionTree<IBoardState, any> = {
  async [BoardActionType.InitData] ({ commit, dispatch }, SchemaCode) {
    const ret = await initData(SchemaCode);
    if (ret.success) {
      const {
        HasBoardSetting, Data, Controls, Permission, SheetAction, IsWorkflow, Filter, GroupConfig, SortConfig,
      } = ret.returnData;
      commit(BoardMutationType.InitData, {
        SchemaCode,
        HasBoardSetting,
        Data,
        Controls,
        Permission,
        SheetAction,
        IsWorkflow,
        Filter,
        GroupConfig,
        SortConfig,
        dispatch,
      });
    }
    return ret;
  },
  async [BoardActionType.GetBoardColumnDatas] ({ commit, state }, params: {columnValues: string[];
     pageIndex: number; isLoadMore: boolean;}) {
    const data: { SchemaCode: string; ColumnCode: string; ColumnValue: string[];
        SortColumns:IBoardSortColumn[];
        GroupColumn:string;FilterItems:IBoardFilterColumn[];
        GroupConfig:any; PageIndex: number; PageSize: number;} = {
          SchemaCode: state.board.schemaCode,
          ColumnCode: state.board.boardColumnField,
          ColumnValue: params.columnValues,
          SortColumns: state.board.sortColumns,
          GroupColumn: state.board.groupColumn,
          PageIndex: params.pageIndex,
          PageSize: 10,
          FilterItems: state.board.filterColumns,
          GroupConfig: state.board.groupConfig,
        };
    const ret = await getBoardData(data);
    if (ret.success) {
      commit(BoardMutationType.SetBoardColumnDatas, {
        columnValues: params.columnValues,
        isLoadMore: params.isLoadMore,
        BoardDatas: ret.returnData.BoardDatas,
      });
    }
    return ret;
  },

  async [BoardActionType.SortCard] ({ state }, params: {stackValue: string;
    id: string; prevObjectId:string; nextObjectId:string;}) {
    const { objectId, schemaCode, boardColumnField } = state.board;
    const data: {BoardId: string; ColumnCode: string; SchemaCode: string;
    BizObjectId: string; TargetColumnValue: string; TargetPrevBizObjectId: string; TargetNextBizObjectId: string;} = {
      BoardId: objectId,
      ColumnCode: boardColumnField,
      SchemaCode: schemaCode,
      BizObjectId: params.id,
      TargetColumnValue: params.stackValue === UnclassifiedField ? '' : params.stackValue,
      TargetPrevBizObjectId: params.prevObjectId,
      TargetNextBizObjectId: params.nextObjectId,
    };
    await updateFormValue(data);
  },

  async [BoardActionType.SortStack] ({ state }, sortedColumns) {
    boardColumnSort(state.board.objectId, sortedColumns);
  },

  async [BoardActionType.GetNewForm] ({ state }, req: IBoardSingleDataRequest) {
    const ret = await getNewForm(req);
    return ret;
  },

  [BoardActionType.EditCard] ({ commit, state }, payload: {newColumnValue: string; columnValue: string; bizObjectId: string; form: any }) {
    const {
      newColumnValue, columnValue, bizObjectId, form,
    } = payload;
    // 判断分类列类型
    if (columnValue) {
      // 编辑更新
      // 先判断分类列值是否改变，如果没有改变，就替换，有改变，就删除
      if (columnValue === newColumnValue) {
        const columnRecordModel = state.boardColumnRecords[columnValue || UnclassifiedField];
        if (columnRecordModel) {
          const index = columnRecordModel.Datas.findIndex(card => card.Code === bizObjectId);
          if (index > -1) {
            columnRecordModel.Datas.splice(index, 1, form);
          }
        }
      } else {
        commit('RemoveStackData', { columnValue, bizObjectId });
        commit('AddStackData', { columnValue: newColumnValue, form });
      }
    } else {
      commit('AddStackData', { columnValue: newColumnValue, form });
    }
  },

  // async [BoardActionType.ReplaceForm] ({ state }, params : { stackValue: string; req: IBoardSingleDataRequest }) {
  //   const { stackValue, req } = params;
  //   const ret = await getNewForm(req);
  //   if (ret.success) {
  //     const columnRecordModel = state.BoardColumnRecords[stackValue || UnclassifiedField];
  //     if (columnRecordModel) {
  //       const index = columnRecordModel.Datas.findIndex(record => record.Code === req.BizObjectId);
  //       if (index > -1) {
  //         const { Data } = ret.returnData;
  //         if (Data) {
  //           columnRecordModel.Datas.splice(index, 1, Data);
  //         } else {
  //           columnRecordModel.Count -= 1;
  //           columnRecordModel.Datas.splice(index, 1);
  //         }
  //       }
  //     }
  //   }
  // },

  async [BoardActionType.UpdateCard] ({ state, commit }, params: {id: string;
    targetColumnValue: string; targetPrevBizObjectId: string; targetNextBizObjectId: string;
    element: any; bolumnColumnType: FormControlType; avatar: string; name: string;}) {
    const {
      id, targetColumnValue, targetPrevBizObjectId, targetNextBizObjectId, element, bolumnColumnType, avatar, name,
    } = params;
    commit(BoardMutationType.UpdateCard, {
      type: bolumnColumnType,
      columnValue: targetColumnValue,
      element,
      avatar,
      name,
    });
    const { objectId, schemaCode, boardColumnField } = state.board;
    const data: {BoardId: string; ColumnCode: string; SchemaCode: string;
      BizObjectId: string; TargetColumnValue: string; TargetPrevBizObjectId: string; TargetNextBizObjectId: string;} = {
        BoardId: objectId,
        ColumnCode: boardColumnField,
        SchemaCode: schemaCode,
        BizObjectId: id,
        TargetColumnValue: targetColumnValue || UnclassifiedField,
        TargetPrevBizObjectId: targetPrevBizObjectId,
        TargetNextBizObjectId: targetNextBizObjectId,
      };
    const ret = await updateFormValue(data);
    return ret;
  },
  async [BoardActionType.ChangeDisplayMode] ({ state, commit }, params: {sheetCode: any; defaultDisplayMode: number}) {
    const ret = await changeDisplayMode(params);
    return ret;
  },
};

export default actions;
