import {
  IGuid, isFalsy, isFunction, pairsForIn, deepCopy,
} from '../../utils';
import { State } from '../../utils/constants';
import GridProxy from './grid-proxy';
import { Mutation } from '../../modal/types';

// 在逻辑层创建row
function newRow (rowId, row) {
  this[rowId] = {};
  // gridDataField 是带点的
  const tmplConstructor = this.tmplConstructor;
  for (const gridDataField of this.controlFields) {
    const controlData = row[gridDataField];
    const ImplGridControl = tmplConstructor[gridDataField];
    this[rowId][gridDataField] = new ImplGridControl(rowId, controlData);
  }
  return row;
}

// 向子表外发布消息（触发子表外 即主表的规则）
function publishOutGridMsg (gridControl) {
  gridControl.$publish();
  const form = gridControl.$form;
  for (const field of gridControl.controlFields) {
    form[field].$publish(field, true); // 传true表示，这里不触发子表内本身的规则
  }
}

// 向子表内推送消息（触发子表行内的规则）
function pushInGridMsg (gridControl, rowId) {
  const formInstance = gridControl.$form;
  const rowNamespace = [gridControl.dataField, rowId];
  const isLoadingData = formInstance.$stateMachine.state === State.INIT &&
    !formInstance.$responseContext.IsCreateMode;
  for (const field of gridControl.controlFields) {
    const namespace = [...rowNamespace, field];
    if (gridControl[rowId]) {
      const control = gridControl[rowId][field];
      formInstance.$dispatcher.pushMsg(
        control,
        isLoadingData,
        namespace,
      );
      // 这里需要触发事件，并且同时触发在子表上的事件
      control.$triggerEvt();
    }
  }
}

function FormGridView (options, $data) {
  // this.controlFields = $data.controls.map(c => c.dataField);
  const rowValues = $data.value;
  const controlTmpls = options.Value.T;
  const ImplControlFactory = options.implControlFactory;
  // 创建子表控件的逻辑模板控件
  const tmplConstructor = {};
  const controlFields = [];
  pairsForIn(controlTmpls, (gridDataField, controlOptions) => {
    controlOptions.parentDataField = options.dataField;
    controlOptions.dataField = gridDataField;
    const excludeProp = ['Value', 'Visible', 'DisplayRule', 'DisplayRuleFields',
      'ComputationRule', 'ComputationRuleFields',
      'controlKey', 'dataField'];
    const tmplOptions = {};
    for (const prop in controlOptions) {
      if (!excludeProp.includes(prop)) {
        tmplOptions[prop] = controlOptions[prop];
      }
    }
    if (controlOptions.controlkey) {
      controlFields.push(gridDataField);
    }
    const tmplControl = new ImplControlFactory(controlOptions, { options: tmplOptions });
    this.$form[gridDataField] = tmplControl;
    function ImplGridControl (rowId, controlData, needInit = true) {
      GridProxy.call(this, rowId, controlData, needInit);
    }
    ImplGridControl.prototype = tmplControl;
    tmplConstructor[gridDataField] = ImplGridControl;
  });
  this.controlFields = controlFields;
  this.tmplConstructor = tmplConstructor;
  // 创建子表控件的行数据
  if (rowValues && rowValues.length > 0) {
    for (const rowId of rowValues) {
      newRow.call(this, rowId, $data[rowId]);
    }
  }
  Object.defineProperty(this, 'rows', {
    get: function getter () {
      return $data.value;
    },
  });
}

FormGridView.prototype.$clearValue = () => [];

FormGridView.prototype.$valueType = Array;

FormGridView.prototype.$setValue = function setValue (value) {
  if (value instanceof Array) {
    // for (const row of value) {
    //   // 兼容PC端
    //   if (row[`${this.dataField}.ObjectId`] && row[`${this.dataField}.ObjectId`].Value) {
    //     row[`${this.dataField}.ObjectId`] = row[`${this.dataField}.ObjectId`].Value;
    //   } else if (!row[`${this.dataField}.ObjectId`]) {
    //     row[`${this.dataField}.ObjectId`] = IGuid();
    //   }
    // }
    value.forEach((row) => {
      let rowId = '';
      if (row[`${this.dataField}.ObjectId`]) {
        rowId = row[`${this.dataField}.ObjectId`];
      } else {
        rowId = row[`${this.dataField}.ObjectId`] = IGuid();
      }
      this.$addRow(rowId, row);
    });
  }
  return this.viewData;
};

/**
 * 子表校验
 * 氚云迭代39需求：氚云3.0逻辑；
 * 明细表<不允许提交空行>和行内控件<必填>的校验权重
 * 前者true, 后者 false时, 仅校验前者
 * 前者true, 后者 true时, 都做校验, 但前者优先, 前者的错误提示也优先
 * 前者true, 后者 true时, 都做校验, 但前者优先, 前者的错误提示也优先
 * 前者false, 后者false时, 不做任何校验
* 前者false, 后者true时,  1: 整行留空可以跳过控件必填校验; 2: 行内任意列不为空, 则必须校验控件必填
    另, 所有空行数据在前后端都需要保留和展示
 */
FormGridView.prototype.$validate = function validate () {
  // TODO 这里要改成校验通过子表内的控件，取visible自动取到prototype上的template的visible，来判断校验
  const version = this.$form.$version;
  let gridChildErr = false; // 子表内的任一控件值不合法，校验不通过
  let gridHasEmptyRow = false; // 子表内存在空行，对应氚云3.0的不允许提交空行
  let invalidRowId = '';
  let rowValidEmptyMap = {};
  this.rows.forEach(rowId => {
    const row = this[rowId];
    let rowChildErr = false; // 子表内控件有错误
    let isEmptyRow = true; // 当前行是否是空行，整行子表所有值都是空
    // 两次遍历，第一次遍历行内，所有值是否非空
    // 只有氚云3.0需要校验这个逻辑
    if (version === 3) {
      this.controlFields.forEach(field => {
        const childControl = row[field];
        if (
          childControl &&
          childControl.visible
        ) {
          if (!childControl.$isEmpty(childControl.value)) {
            isEmptyRow = false; // 任一控件有值，此行非空
            // gridChildValueEmpty = false; // 任一控件有值，此子表不为空
          }
        }
      });
      gridHasEmptyRow = gridHasEmptyRow || isEmptyRow; // 子表内存在空行
    } else {
      // 氚云2.0不做空行校验
      isEmptyRow = false; // 氚云2.0内，不需要校验子表行为空
    }
    // 两次遍历，第二次遍历行内，当行内控件值任一非空；再开始做值合法校验
    // 在氚云2.0 会直接执行这段逻辑
    if (!isEmptyRow) {
      this.controlFields.forEach(field => {
        const childControl = row[field];
        if (
          childControl &&
          childControl.visible
        ) {
          if (!childControl.$validate(childControl.value)) {
            rowChildErr = true;
            gridChildErr = true;
          }
        }
      });
    }
    if (isEmptyRow || rowChildErr) {
      rowValidEmptyMap[rowId] = true;
      if (!invalidRowId) {
        invalidRowId = rowId;
      }
    }
  });
  if (this.options.Required) {
    // 在氚云2.0中，子表空的条件就是子表的行数为0
    // 在氚云3.0中，子表空的条件是子表中存在空行，允许子表行数为0
    const emptyError = version === 2 ? this.rows.length === 0 : gridHasEmptyRow;
    // 如果子表没有添加行或者子表内的所有值都为空，则判定子表必填校验不通过
    if (emptyError) {
      const shortDisplayName = this.options.DisplayName && this.options.DisplayName.length > 6 ? `${this.options.DisplayName.substr(0, 6)}...` : this.options.DisplayName;
      const message = version === 3 ? `明细表[${shortDisplayName}]不允许提交空行` : '';
      this.valid = { empty: true, gridChildEmpty: true, invalidRowId, message };
      this.$updateView(Mutation.VALIDROW, {
        dataField: this.dataField,
        rowValidEmptyMap,
      });
      return false;
    }
  }

  if (gridChildErr) {
    this.valid = { empty: true, gridChildErr: true, invalidRowId };
  } else {
    this.valid = {};
    rowValidEmptyMap = {};
  }
  this.$updateView(Mutation.VALIDROW, {
    dataField: this.dataField,
    rowValidEmptyMap,
  });
  return !gridChildErr;
};

FormGridView.prototype.$validateUploaded = function validateUploaded () {
  let hasFileControl = false;
  let fileUploaded = true;
  this.controlFields.forEach((field) => {
    const tmplControl = this.$form[field];
    if (tmplControl.controlKey === 'FormAttachment' || tmplControl.controlKey === 'FormPhoto') {
      hasFileControl = true;
    }
  });
  if (hasFileControl) {
    this.rows.forEach((rowId) => {
      const row = this[rowId];
      this.controlFields.forEach((field) => {
        const childControl = row[field];
        if (childControl.$validateUploaded && !childControl.$validateUploaded()) {
          fileUploaded = false;
        }
      });
    });
  }
  return fileUploaded;
};

FormGridView.prototype.$getValue = function getValue (value) {
  const formInstance = this.$form;
  const rows = value.map((rowId) => {
    const row = this[rowId];
    const rowData = {};
    for (const gridDataField of this.controlFields) {
      const subDataField = gridDataField.split('.')[1];
      const childControl = row[gridDataField];
      if (childControl && childControl.options.controlkey === 'FormFormula' ||
        childControl.options.sourcetype) {
        continue;
      }
      try {
        const getResult = row[gridDataField].value;
        rowData[subDataField] = getResult;
      } catch (error) {
        if (formInstance.$$debugMode) {
          const errorMsg = `子表内控件${childControl.options.DisplayName}-${childControl.dataField} getValue失败`;
          formInstance.$errorHandler(errorMsg, error);
          throw error; // 抛出异常到外层catch
        }
      }
    }
    rowData.ObjectId = rowId;
    return rowData;
  });
  return rows;
};

FormGridView.prototype.$saveDataField = function saveDataField (value) {
  return { [this.dataField]: value };
};

FormGridView.prototype.$addRow = async function addRow (rowId = null, rowData = null) {
  try {
    rowId = rowId || IGuid();
    const newRowData = {};
    this.controlFields.forEach((field) => {
      const subDataField = field.split('.')[1];
      const tmplControl = this.$form[field];
      // AddRow时 需要取默认值，重新执行计算规则
      if ((!rowData || (rowData && (!(field in rowData) || !(subDataField in rowData)))) &&
        tmplControl.$$hasDefault) {
        const isNumber = tmplControl.$valueType === Number;
        const rule = tmplControl.$$rules.computationRule.rule;
        tmplControl.value = this.$form.$calculator.getComputationRuleResult(
          rule,
          [],
          null,
          isNumber,
        );
      }

      // let value = rowData ? (rowData[field] || rowData[subDataField]) : '';
      // 上面的存在 undefined || 0 情况，导致赋值0没有赋值上去 //缺陷 #44845
      let value = rowData ? rowData[subDataField] || rowData[field] : '';
      if (value !== 0 && !value) {
        value = deepCopy(tmplControl.value);
      }
      newRowData[field] = {
        value,
        valid: {},
        visible: true,
        options: deepCopy(tmplControl.options),
      };
    });
    newRowData[`${this.dataField}.ObjectId`] = { value: rowId };
    newRowData[`${this.dataField}.ParentObjectId`] = { value: this.$form.$bizObjectId };
    this.$updateView(Mutation.ADDROW, {
      dataField: this.dataField,
      rowId,
      rowData: newRowData,
    });
    newRow.call(this, rowId, newRowData);
    // await this.$form.$stateMachine.flushAsync();
    this.$form.$nextLoop(() => {
      pushInGridMsg(this, rowId); // 先执行子表行内的规则
      publishOutGridMsg(this); // 再执行子表外的规则
      this.$triggerEvt('add', rowId);
      if (isFunction(this.$customClickEvt)) {
        this.$customClickEvt(this, rowId);
      }
    });
  } catch (err) {
    if (this.$form.$$debugMode) {
      this.$form.$errorHandler('子表添加行失败', err);
    }
  }
};

FormGridView.prototype.$updateRow = async function updateRow (rowId, rowData) {
  const targetControls = [];
  const targetRow = this[rowId];
  const formatRowData = {};
  this.updatingRow = true; // 临时解决方案，标记正在进行updateRow
  // updateRow 同时赋值多个控件，会出现规则执行的先后顺序问题
  // 第一次遍历执行无计算规则无隐藏规则的控件
  for (const field of this.controlFields) {
    const subDataField = field.split('.')[1];
    // const val = rowData[field] || rowData[subDataField];
    if (field in rowData || subDataField in rowData) {
      const control = targetRow[field];
      const value = isFalsy(rowData[field]) ? rowData[subDataField] : rowData[field];
      if (!control.$$rules) {
        control.value = value;
      } else {
        formatRowData[field] = value;
        targetControls.push(control);
      }
    }
  }
  // 第二次遍历执行有计算规则的控件
  if (targetControls.length > 0) {
    const restControls = [];
    for (const ctrl of targetControls) {
      if (ctrl.$$hasSubs) {
        ctrl.value = formatRowData[ctrl.dataField];
      } else {
        restControls.push(ctrl);
      }
    }
    // 第三次遍历执行其他的（关联表单填充）
    if (restControls.length > 0) {
      for (const ctrl of restControls) {
        ctrl.value = formatRowData[ctrl.dataField];
      }
    }
  }
  // 开始update时为true，结束时为false, 来标记过程，
  // 此过程中子表控件自定义事件不触发子表本身的自定义事件
  this.updatingRow = false;
};

FormGridView.prototype.$getCellManager = function getCellManager (objectId, dataField) {
  if (objectId == null || isFalsy(dataField)) return null;
  const targetRow = this.$form[this.dataField][objectId];
  if (targetRow) {
    const childControl = targetRow[dataField];
    return childControl;
  }
  return null;
};

FormGridView.prototype.$copyRow = async function copyRow (sourceId, sourceIndex) {
  const rowId = IGuid();
  const rowData = {};
  this[rowId] = {};
  const sourceRow = this[sourceId];
  const tmplConstructor = this.tmplConstructor;
  this.controlFields.forEach((field) => {
    rowData[field] = {
      // 这里要改，附件的判断不应在这里，违反中心化解藕的原则
      value: (sourceRow[field].controlKey === 'FormAttachment' || sourceRow[field].controlKey === 'FormPhoto') ? [] : deepCopy(sourceRow[field].viewData),
      valid: {},
      visible: sourceRow[field].visible,
      options: deepCopy(sourceRow[field].options),
    };
    const ImplGridControl = tmplConstructor[field];
    this[rowId][field] = new ImplGridControl(rowId, rowData[field], false);
  });
  rowData[`${this.dataField}.ObjectId`] = { value: rowId };
  rowData[`${this.dataField}.ParentObjectId`] = { value: this.$form.$bizObjectId };
  this.$updateView(Mutation.COPYROW, {
    dataField: this.dataField,
    rowId,
    rowData,
    sourceIndex,
    sourceId,
  });
  publishOutGridMsg(this); // 执行子表外的规则
  this.$triggerEvt('copy', rowId);
  if (isFunction(this.$customClickEvt)) {
    this.$customClickEvt(this, rowId);
  }
};

FormGridView.prototype.$deleteRow = function deleteRow (rowId) {
  this.$updateView(Mutation.DELETEROW, {
    dataField: this.dataField,
    rowId,
  });
  publishOutGridMsg(this); // 执行子表外的规则
  this.$triggerEvt('delete', rowId);
  delete this[rowId];
};

FormGridView.prototype.$clearRows = function clearRows (onlyClear) {
  for (const rowId of this.rows) {
    delete this[rowId];
  }
  this.$updateView(Mutation.CLEARROWS, {
    dataField: this.dataField,
  });
  if (!onlyClear) {
    // 如果onlyClear为true，则不会去触发其他的规则；这种场景发生在关联填充需要清空时
    publishOutGridMsg(this);
    this.$triggerEvt('clear');
  }
};

FormGridView.prototype.$batchAddRows = function batchAddRows (rows) {
  rows.forEach((row) => {
    const rowId = row[`${this.dataField}.ObjectId`] || IGuid();
    this.$addRow(rowId, row);
  });
};

export default FormGridView;
