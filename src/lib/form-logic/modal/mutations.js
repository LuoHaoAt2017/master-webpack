import { pairsForIn } from '../utils';
import { Mutation } from './types';
import Vue from 'vue';

export default {
  // 控件层级
  // 逻辑层修改控件的值（主表控件）
  [Mutation.SET] (state, { dataField, value }) {
    state[dataField].value = value;
    state.$dirtyChanged = true;
  },
  // 逻辑层修改控件的值（子表控件）
  [Mutation.SETINGRID] (state, { namespace, value }) {
    const [parentDataField, rowId, childDataField] = namespace;
    const target = state[parentDataField][rowId][childDataField];
    const noticeMap = state[parentDataField].noticeMap;
    noticeMap[childDataField] = !noticeMap[childDataField];
    target.value = value;
    state.$dirtyChanged = true;
  },
  // 逻辑层校验主表控件(必填校验，自定义校验)
  [Mutation.VALID] (state, { dataField, valid }) {
    state[dataField].valid = valid;
  },
  // 逻辑层校验主表控件(必填校验，自定义校验)
  [Mutation.VALIDINGRID] (state, { namespace, valid }) {
    const [parentDataField, rowId, childDataField] = namespace;
    const gridControl = state[parentDataField];
    const row = gridControl[rowId];
    const target = row[childDataField];
    // state[childDataField].notice = !state[childDataField].notice;
    target.valid = valid;
    // 更新映射表
    const noticeMap = gridControl.noticeMap;
    noticeMap[childDataField] = !noticeMap[childDataField];
    // gridControl.notice = !gridControl.notice;
    // 行校验映射表
    const rowValidEmptyMap = gridControl.rowValidEmptyMap;
    if (rowValidEmptyMap && rowValidEmptyMap[rowId]) {
      rowValidEmptyMap[rowId] = gridControl.controls.some(field => row[field.dataField] &&
        row[field.dataField].valid.empty);
    }
  },
  [Mutation.VALIDROW] (state, { dataField, rowValidEmptyMap }) {
    // rowValidEmptyMap: { [dataField: string]: boolean }
    const gridControl = state[dataField];
    gridControl.rowValidEmptyMap = rowValidEmptyMap;
  },
  // 逻辑层设置主表的显示隐藏
  [Mutation.SETVISIBLE] (state, { dataField, visible }) {
    state[dataField].visible = visible;
  },
  // 逻辑层设置子表显示隐藏
  [Mutation.SETVISIBLEINGRID] (state, { namespace, visible }) {
    const [parentDataField, rowId, childDataField] = namespace;
    const gridControl = state[parentDataField];
    const row = gridControl[rowId];
    row[childDataField].visible = visible;
    // row.titleControl = gridControl.controls[0].dataField;
    const noticeMap = gridControl.noticeMap;
    noticeMap[childDataField] = !noticeMap[childDataField];
  },
  // 重置表单脏值修改判断
  [Mutation.RESETDIRTY] (state) {
    state.$dirtyChanged = false;
  },
  // 插入子表行（新增、更新、复制）
  [Mutation.ADDROW] (state, {
    dataField,
    rowId,
    rowData,
  }) {
    const target = state[dataField];
    // 修复多次执行导致value值重复
    target.value.push(rowId);
    // rowData.titleControl = target.controls.length ? target.controls[0].dataField : '';
    target[rowId] = rowData;
    target.valid = {};
    state.$dirtyChanged = true;
  },
  [Mutation.UPDATEROW] (state, {
    dataField,
    rowId,
    rowData,
  }) {
    const targetRowData = state[dataField][rowId];
    pairsForIn(rowData, (gridDataField, value) => {
      targetRowData[gridDataField].value = value;
      state[dataField].noticeMap[gridDataField] = !state[dataField].noticeMap[gridDataField];
    });
    state.$dirtyChanged = true;
  },
  // 子表复制行
  [Mutation.COPYROW] (state, {
    dataField,
    rowId,
    rowData,
    sourceIndex,
  }) {
    const target = state[dataField];
    target.value.splice(sourceIndex + 1, 0, rowId);
    // rowData.titleControl = target.controls[0].dataField;
    target[rowId] = rowData;
    state.$dirtyChanged = true;
  },
  // 删除子表行
  [Mutation.DELETEROW] (state, { dataField, rowId }) {
    const target = state[dataField];
    const delIndex = target.value.indexOf(rowId);
    if (delIndex > -1) {
      target.value.splice(delIndex, 1);
    }
    delete target[rowId];
    state.$dirtyChanged = true;
  },
  // 清空子表所有行
  [Mutation.CLEARROWS] (state, { dataField }) {
    const target = state[dataField];
    for (const rowId of target.value) {
      delete target[rowId];
    }
    target.value = [];
    state.$dirtyChanged = true;
  },
  // 绑定自定义点击事件
  [Mutation.BINDCLICKEVT] (state, { dataField, rowId }) {
    let target = state[dataField];
    if (rowId) {
      const mainField = dataField.split('.')[0];
      const gridControl = state[mainField];
      target = gridControl[rowId][dataField];
      target.hasBindClick = true;
      const noticeMap = gridControl.noticeMap;
      noticeMap[dataField] = !noticeMap[dataField];
    } else {
      target.hasBindClick = true;
    }
  },
};
