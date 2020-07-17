import { pairsForIn, jsonParse, isPromise } from '../../utils';
import { debugMappingRule, debugQueryAssign } from '../../utils/debug';
import { getChildSheetData } from '../../utils/http';

// 填充赋值
async function queryAssignValue (targetControl, setting) {
  const formInstance = targetControl.$form;
  if (!formInstance) {
    // 当填充对象为拥有者填充到所属部门时，而创建部门没渲染，则无$form
    // 此时不进行填充值
    return;
  }
  const { queryResult, sourceField } = setting;
  const assignResult = targetControl.$queryAssign(queryResult[sourceField], setting);
  try {
    if (isPromise(assignResult)) {
      const asyncId = formInstance.$hangupAsync();
      const assignVal = await assignResult;
      targetControl.value = assignVal;
      formInstance.$resolveAsync(asyncId);
      debugQueryAssign(targetControl, assignVal);
    } else {
      targetControl.value = assignResult;
      debugQueryAssign(targetControl, assignResult);
    }
  } catch (err) {
    if (formInstance.$$debugMode) {
      formInstance.$errorHandler(`${targetControl.dataField}关联填充失败`, err);
    }
    formInstance.$rejectAsync();
  }
}

// 主表关联主表的填充
// 主->主 / 主->子 / 子->子
function mainAssoMainMapping (queryResult, mappingRule, ruleControl) {
  // mappingRule: { targetField: sourceField }
  const formInstance = ruleControl.$form;
  const childFieldMapping = {}; // 子 -> 子
  const boschemacode = ruleControl.options.boschemacode;
  pairsForIn(mappingRule, async (targetField, sourceField) => {
    if (targetField.indexOf('.') > -1 && sourceField.indexOf('.') > -1) {
      childFieldMapping[targetField] = sourceField;
    } else {
      const targetControl = formInstance[targetField];
      if (!targetControl) {
        return;
      }
      if (targetControl.isIngrid) {
        // 主 -> 子
        const gridControl = formInstance[targetControl.parentDataField];
        if (gridControl.rows.length === 0 && formInstance.$responseContext.IsCreateMode) {
          gridControl.$addRow(null, null);
        }
        for (const rowId of gridControl.rows) {
          const row = gridControl[rowId];
          if (row[targetControl.dataField]) {
            queryAssignValue(row[targetControl.dataField], {
              queryResult,
              sourceField,
              boschemacode,
            });
          }
        }
      } else {
        // 主 -> 主 最简单的情况 主表填充主表
        queryAssignValue(targetControl, {
          queryResult,
          sourceField,
          boschemacode,
        });
      }
    }
  });
  // 处理子表填充子表
  const childSchemaMap = {};
  pairsForIn(childFieldMapping, (targetField, sourceField) => {
    const [parentTargetField] = targetField.split('.');
    const [parentSourceField] = sourceField.split('.');
    if (!childSchemaMap[parentTargetField]) {
      childSchemaMap[parentTargetField] = parentSourceField;
    }
  });
  const state = formInstance.$stateMachine.state;
  pairsForIn(childSchemaMap, (targetChildSchema, sourceChildSchema) => {
    if (!queryResult.ObjectId) {
      const gridControl = formInstance[targetChildSchema];
      if (state !== 'init') {
        gridControl.$clearRows(true);
      }
      return;
    }
    const actionResult = getChildSheetData(
      targetChildSchema,
      boschemacode,
      queryResult.ObjectId,
      sourceChildSchema,
    );
    const gridControl = formInstance[targetChildSchema];
    if (!gridControl) {
      // 未定义时，表示填充目标控件被删除,不再执行填充操作
      return;
    }
    const requestAsyncId = formInstance.$hangupAsync();
    actionResult.then((response) => {
      const returnData = response.ReturnData;
      if (returnData.ListViewData && returnData.ListViewData.length > 0) {
        const sourceRowsData = returnData.ListViewData;
        const oldGridRowsData = gridControl.value;
        gridControl.$clearRows(true);
        let resultLength = 0;
        if (state === 'init') {
          resultLength = Math.max(sourceRowsData.length, oldGridRowsData.length);
        } else {
          resultLength = sourceRowsData.length;
        }
        const rowsResult = [];
        for (let i = 0; i < resultLength; i += 1) {
          const newRow = state === 'init' && oldGridRowsData[i]
            ? oldGridRowsData[i] : {};
          const sourceRow = sourceRowsData[i];
          if (sourceRow) {
            pairsForIn(childFieldMapping, async (targetField, sourceField) => {
              const tmplControl = formInstance[targetField];
              const [, childTargetField] = targetField.split('.');
              // 将获取到的子表行数据(source)，对应的填充到当前子表中(target)
              // 如果source的字段数据为空，也会填充到target中
              if (sourceRow[sourceField] === undefined) {
                return;
              }
              const assignResult = tmplControl.$queryAssign(sourceRow[sourceField], {
                queryResult: sourceRow,
                sourceField,
                boschemacode,
              });
              let assignVal = null;
              // if (assignResult instanceof Promise) {
              if (isPromise(assignResult)) {
                const asyncId = formInstance.$hangupAsync();
                try {
                  assignVal = await assignResult;
                  const curRowId = gridControl.rows[i];
                  if (curRowId && gridControl[curRowId][targetField]) {
                    gridControl[curRowId][targetField].value = assignVal;
                  }
                  formInstance.$resolveAsync(asyncId);
                } catch (error) {
                  formInstance.$rejectAsync();
                }
              } else {
                assignVal = assignResult;
                newRow[childTargetField] = assignVal;
              }
              debugQueryAssign(tmplControl, assignVal);
            });
          }
          rowsResult.push(newRow);
        }
        gridControl.$batchAddRows(rowsResult);
      } else {
        gridControl.$clearRows(true);
      }
      formInstance.$resolveAsync(requestAsyncId);
    }).catch((error) => {
      if (formInstance.$$debugMode) {
        formInstance.$errorHandler(`${gridControl.dataField}子表填充子表失败`, error);
      }
      formInstance.$rejectAsync();
    });
  });
}

// 主表关联子表的填充
// 子->主/子->子
function mainAssoChildMapping (queryResult, mappingRule, ruleControl) {
  const formInstance = ruleControl.$form;
  const boschemacode = ruleControl.options.boschemacode;
  pairsForIn(mappingRule, async (targetField, sourceField) => {
    const targetControl = formInstance[targetField];
    if (!targetControl) {
      return;
    }
    if (targetControl.isIngrid) {
      // 子 -> 子
      const gridControl = formInstance[targetControl.parentDataField];
      if (gridControl.rows.length === 0 && formInstance.$responseContext.IsCreateMode) {
        gridControl.$addRow(null, null);
      }
      for (const rowId of gridControl.rows) {
        const row = gridControl[rowId];
        if (row[targetControl.dataField]) {
          queryAssignValue(row[targetControl.dataField], {
            queryResult,
            sourceField,
            boschemacode,
          });
        }
      }
    } else {
      // 子 -> 主
      queryAssignValue(targetControl, {
        queryResult,
        sourceField,
        boschemacode,
      });
    }
  });
}

// 子表关联主表的填充
// 主->主/主->子
function childAssoMainMapping (queryResult, mappingRule, ruleControl) {
  const formInstance = ruleControl.$form;
  const boschemacode = ruleControl.options.boschemacode;
  const ruleRowId = ruleControl.rowId;
  pairsForIn(mappingRule, async (targetField, sourceField) => {
    let targetControl = formInstance[targetField];
    if (!targetControl) {
      return;
    }
    if (targetControl.isIngrid) {
      // 主 -> 子
      const gridControl = formInstance[targetControl.parentDataField];
      if (ruleRowId && gridControl[ruleRowId]) {
        targetControl = gridControl[ruleRowId][targetControl.dataField];
      }
    } else {
      // 主 -> 主
    }
    queryAssignValue(targetControl, {
      queryResult,
      sourceField,
      boschemacode,
    });
  });
}

// 子表关联子表
// 子->主/子->子
function childAssoChildMapping (queryResult, mappingRule, ruleControl) {
  const formInstance = ruleControl.$form;
  const boschemacode = ruleControl.options.boschemacode;
  const ruleRowId = ruleControl.rowId;
  pairsForIn(mappingRule, async (targetField, sourceField) => {
    let targetControl = formInstance[targetField];
    if (!targetControl) {
      return;
    }
    if (targetControl.isIngrid) {
      // 子 -> 子
      const gridControl = formInstance[targetControl.parentDataField];
      if (ruleRowId && gridControl[ruleRowId]) {
        targetControl = gridControl[ruleRowId][targetControl.dataField];
      }
    } else {
      // 子 -> 主
    }
    queryAssignValue(targetControl, {
      queryResult,
      sourceField,
      boschemacode,
    });
  });
}

function setMappingValue (queryResult, mappingRule, ruleControl) {
  debugMappingRule(ruleControl);
  // 判断关联请求来的数据 是主表数据还是子表数据
  queryResult = queryResult || {};
  let isAssociateChild = false;
  if (ruleControl.controlKey === 'FormQuery') {
    if (ruleControl.options.boschemainfo) {
      const boschemainfo = jsonParse(ruleControl.options.boschemainfo);
      isAssociateChild = !!boschemainfo.IsChildSchema;
    } else {
      isAssociateChild = Object.keys(queryResult).some(queryField => queryField.indexOf('.') > -1);
    }
  }
  // mappingRule: { targetField: sourceField }
  // 由sourceField(外部表单字段)填充到targetField(当前表单字段)
  if (!ruleControl.isIngrid && !isAssociateChild) {
    // 主表 : 主表
    mainAssoMainMapping(queryResult, mappingRule, ruleControl);
  } else if (!ruleControl.isIngrid && isAssociateChild) {
    // 主表 : 子表
    mainAssoChildMapping(queryResult, mappingRule, ruleControl);
  } else if (ruleControl.isIngrid && !isAssociateChild) {
    // 子表 : 主表
    childAssoMainMapping(queryResult, mappingRule, ruleControl);
  } else if (ruleControl.isIngrid && isAssociateChild) {
    // 子表 : 子表
    childAssoChildMapping(queryResult, mappingRule, ruleControl);
  }
}

export default setMappingValue;
