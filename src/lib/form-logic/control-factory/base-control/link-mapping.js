import { pairsForIn } from '../../utils';
import { debugMappingRule, debugQueryAssign } from '../../utils/debug';

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
    if (assignResult instanceof Promise) {
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
      formInstance.$errorHandler(`${targetControl.dataField}数据联动填充失败`, err);
    }
    formInstance.$rejectAsync();
  }
}

// ->主/->子
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
      // -> 子
      const gridControl = formInstance[targetControl.parentDataField];
      if (ruleRowId && gridControl[ruleRowId]) {
        targetControl = gridControl[ruleRowId][targetControl.dataField];
      }
    } else {
      // -> 主
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
  queryResult = queryResult || {};
  // mappingRule: { targetField: sourceField }
  // 由sourceField(外部表单字段)填充到targetField(当前表单字段)

  childAssoMainMapping(queryResult, mappingRule, ruleControl);
}

export default setMappingValue;
