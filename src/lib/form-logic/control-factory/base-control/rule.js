import setMappingValue from './rule-mapping';
import setLinkMappingValue from './link-mapping';
import { getFormatBizObject, getMultiFormUser, getDataLinkData } from '../../utils/http';
import { formLogicService } from '@/lib/form-logic';
import { isEmptyObject, isObject, isString, jsonParse, formatDate } from '../../utils';
import { Mark } from '../../utils/constants';
import { debugComputationRule, debugDisplayRule } from '../../utils/debug';

function executeMappingRule (control, message) {
  const formInstance = control.$form;
  const mappingRule = {};
  const { mappingcontrols, mappingproperties } = control.$$rules.mappingRule;
  if (message.isLoadingData) {
    Object.assign(mappingRule, mappingproperties);
  } else {
    Object.assign(mappingRule, mappingcontrols, mappingproperties);
  }
  if (isEmptyObject(mappingRule)) {
    return;
  }
  let queryVal = null;
  if (control.isIngrid) {
    if (message.mark !== Mark.NOGRID) {
      queryVal = control.value;
    }
  } else {
    queryVal = control.value;
  }
  let itemObjectId = '';
  if (control.controlKey === 'FormQuery') {
    // 关联表单当初始化时, 且查询值未空时不予执行填充处理
    if (!queryVal && formInstance.$stateMachine.state === 'init') {
      return;
    }
    if (!queryVal) {
      // 获取到的数据为空，直接清空相关联的填充值
      setMappingValue.call(formInstance, undefined, mappingRule, control);
      return;
    }
    itemObjectId = queryVal;
  } else {
  // 人员控件
    const received = queryVal && queryVal[0] ? queryVal[0] : '';
    if (received.length === 0 || received === '') {
      setMappingValue.call(formInstance, {}, mappingRule, control);
    }
    itemObjectId = received;
  }
  if (!itemObjectId) {
    // 获取到的数据为空，直接清空相关联的填充值
    setMappingValue.call(formInstance, undefined, mappingRule, control);
    return;
  }
  // 获取填充数据缓存
  const queryItem = formInstance.$getQueryCache(itemObjectId);
  if (queryItem) {
    setMappingValue.call(formInstance, queryItem, mappingRule, control);
  } else {
    if (control.controlKey === 'FormUser') {
      const par = [itemObjectId];
      const asyncId = formInstance.$hangupAsync();
      getMultiFormUser(par).then((response) => {
        if (response.Successful) {
          const data = response.ReturnData.UnitItems[0];
          if (data && data.Gender && data.Gender === '未知') {
            data.Gender = '';
          }
          setMappingValue.call(formInstance, data, mappingRule, control);
        }
        formInstance.$resolveAsync(asyncId);
      }).catch((error) => {
        if (formInstance.$$debugMode) {
          formInstance.$errorHandler(`${control.dataField}人员填充失败`, error);
        }
        formInstance.$rejectAsync();
      });
    }
    if (control.controlKey === 'FormQuery' && typeof itemObjectId === 'string') {
      const asyncId = formInstance.$hangupAsync();
      getFormatBizObject(
        control.options.boschemacode,
        itemObjectId,
      ).then((response) => {
        if (response.ReturnData && response.ReturnData.ListViewData &&
          response.ReturnData.ListViewData.length > 0) {
          // todo:判断子表
          const queryResult = response.ReturnData.ListViewData[0];
          setMappingValue.call(formInstance, queryResult, mappingRule, control);
        }
        formInstance.$resolveAsync(asyncId);
      }).catch((error) => {
        if (formInstance.$$debugMode) {
          formInstance.$errorHandler(`${control.dataField}获取关联值失败`, error);
        }
        formInstance.$rejectAsync();
      });
    }
  }
}

function executeLinkMappingRule (control, message) {
  const formInstance = control.$form;
  const { mappingcondition, mappingcontrol } = control.$$rules.linkMappingRule;
  const mappingRule = {};
  Object.assign(mappingRule, mappingcontrol);
  if (isEmptyObject(mappingRule)) {
    return;
  }

  // 当控件不可写\不可见时，不执行联动填充
  // if (!control.options.Editable || !control.visible) {
  //   return
  // }

  let conditions = {};
  for (let i = 0; i < mappingcondition.length; i++) {
    const condition = mappingcondition[i];
    let conditionControl = null;
    if (condition.CurField.indexOf('.') !== -1) {
      // 条件为子表字段
      conditionControl = formInstance[condition.CurField.split('.')[0]][control.rowId][condition.CurField];
    } else {
      conditionControl = formInstance[condition.CurField];
    }

    if (!conditionControl) {
      conditions = {};
      break;
    } else if (conditionControl.controlKey === 'FormQuery' && conditionControl.$$hasMapping) {
      const conditionMappingcontrols = conditionControl.$$rules.mappingRule.mappingcontrols || {};
      if (conditionMappingcontrols[control.dataField]) {
        // 与关联填充冲突，数据联动处理失效
        conditions = {};
        break;
      }
    }

    let value = conditionControl.value;
    if (value === undefined || value === null) {
      value = '';
    }

    if (conditionControl.dataField === 'CreatedBy' ||
      conditionControl.dataField === 'OwnerDeptId' ||
      conditionControl.dataField === 'OwnerId' ||
      conditionControl.controlKey === 'FormUser' ||
      conditionControl.controlKey === 'FormMultiUser') {
      if (value.length === 0) {
        value = '';
      } else if (isObject(value[0])) {
        value = value[0].UnitID || value[0].UnitId;
      } else {
        value = value[0];
      }
    } else if (conditionControl.controlKey === 'FormTextBox') {
      value = value.trim();
    }

    if (value === '') {
      conditions = {};
      break;
    }

    // 当条件所对应目标表单重复，且值不相等时，不继续执行
    if (conditions[condition.RelationField] && conditions[condition.RelationField] !== value) {
      conditions = {};
      break;
    } else {
      conditions[condition.RelationField] = value;
    }
  }

  // 当条件有空值情况下，清空所要填充字段
  if (Object.keys(conditions).length === 0) {
    if (control.linkDataClearable) {
      setLinkMappingValue.call(formInstance, null, mappingRule, control);
    }
    return;
  }
  // 通过条件查询填充表单数据
  const conditionsStr = JSON.stringify([conditions]);
  const schemacode = control.options.datalinkschemacode;
  const asyncId = formInstance.$hangupAsync();
  getDataLinkData(schemacode, conditionsStr).then(
    response => {
      if (
        response.ReturnData &&
        response.ReturnData.Data) {
        const queryResult = response.ReturnData.Data[0] || [];
        if (isEmptyObject(queryResult)) {
          if (control.linkDataClearable) {
            setLinkMappingValue.call(formInstance, null, mappingRule, control);
          }
          delete control.linkDataClearable;
        } else {
          control.linkDataClearable = true;
          setLinkMappingValue.call(formInstance, queryResult, mappingRule, control);
        }
      }
      formInstance.$resolveAsync(asyncId);
    },
  ).catch((error) => {
    if (formInstance.$$debugMode) {
      formInstance.$errorHandler(`${control.dataField}数据联动失败`, error);
    }
    formInstance.$rejectAsync();
  });
}

function executeDisplayRule (control) {
  const { rule, fields } = control.$$rules.displayRule;
  if (fields.length > 0) {
    const newVisible = !control.$form.$calculator.getDisplayRuleResult(
      rule,
      fields,
      control,
    );
    control.visible = newVisible;
    debugDisplayRule(control, rule, newVisible);
  }
}

function executeComputationRule (control) {
  const { rule, fields } = control.$$rules.computationRule;
  if (fields.length > 0) {
    const isNumber = control.$valueType === Number;
    const newVal = control.$form.$calculator.getComputationRuleResult(
      rule,
      fields,
      control,
      isNumber,
    );
    control.value = newVal;
    debugComputationRule(control, rule, newVal);
  }
}

function executeRule (control, message) {
  if (!control.$$rules) {
    return;
  }
  const { isLoadingData, isMapping } = message;
  const {
    displayRule, computationRule, mappingRule, linkMappingRule,
  } = control.$$rules;
  if (isMapping) {
    // 对于子表关联表单，无默认值，且值为空，不执行填充规则
    if (!isLoadingData &&
      control.rowId &&
      control.options.controlkey === 'FormQuery' &&
      !control.originalValue &&
      !control.oldValue &&
      !control.value) {
      return;
    }
    if (mappingRule) {
      executeMappingRule(control, message);
    }
  } else {
    if (displayRule) {
      // 一定要先执行隐藏规则，再执行计算规则和填充规则
      executeDisplayRule(control);
    }

    if (linkMappingRule && !isLoadingData) {
      executeLinkMappingRule(control, message);
    } else if (computationRule && (!isLoadingData || control.controlKey === 'FormFormula')) {
      executeComputationRule(control);
    }
  }
}

export function initMappingRule (ruleControl, mappingRule) {
  if (ruleControl.$$rules) {
    ruleControl.$$rules.mappingRule = mappingRule;
  } else {
    ruleControl.$$rules = { mappingRule };
  }
  ruleControl.$form.$dispatcher.watch(ruleControl.dataField);
}

export function initLinkMappingRule (ruleControl, datalinkresult, datalinkcondition) {
  if (datalinkresult && datalinkcondition) {
    const mappingcondition = isString(datalinkcondition) ? (jsonParse(datalinkcondition, false) || []) : datalinkcondition;
    const fields = mappingcondition.map(condition => condition.CurField);
    const isLoadingData = !ruleControl.$form.$responseContext.IsCreateMode;
    const linkMappingRule = {
      mappingcondition,
      mappingcontrol: {
        [ruleControl.dataField]: datalinkresult,
      },
    };

    if (isLoadingData) {
      ruleControl.linkDataClearable = true;
    }

    if (ruleControl.$$rules) {
      ruleControl.$$rules.linkMappingRule = linkMappingRule;
    } else {
      ruleControl.$$rules = { linkMappingRule };
    }
    if (fields.length > 0) {
      ruleControl.$subscribe(fields);
      ruleControl.$$hasSubs = true;
    }
  }
}

export function initDisplayRule (ruleControl, rule, fields) {
  if (rule && fields) {
    // control.visible = control.$calculator.getRuleResult(rule, fields);
    const displayRule = {
      rule,
      fields,
    };
    if (ruleControl.$$rules) {
      ruleControl.$$rules.displayRule = displayRule;
    } else {
      ruleControl.$$rules = { displayRule };
    }
    if (fields.length > 0) {
      ruleControl.$subscribe(fields);
      ruleControl.$$hasSubs = true;
    } else {
      const newVisible = !ruleControl.$form.$calculator.getDisplayRuleResult(
        rule,
        fields,
        ruleControl,
      );
      ruleControl.visible = newVisible;
    }
  }
}

export function initDefaultValue (ruleControl, value) {
  ruleControl.value = value;
}

export function initDateDefaultValue (ruleControl, format, value) {
  const today = new Date();
  const dates = today.getDate();
  today.setDate(value === 'yesterday' ? dates - 1 : value === 'tomorrow' ? dates + 1 : dates);
  format = format.replace('yyyy-mm', 'yyyy-MM');
  ruleControl.value = formatDate(+today, format);
}

export function initComputationRule (ruleControl, rule, fields) {
  if (rule && fields) {
    const computationRule = {
      rule,
      fields,
    };
    if (ruleControl.$$rules) {
      ruleControl.$$rules.computationRule = computationRule;
    } else {
      ruleControl.$$rules = { computationRule };
    }
    if (fields.length > 0) {
      ruleControl.$subscribe(fields);
      ruleControl.$$hasSubs = true;
    } else {
      if (ruleControl.isIngrid) {
        ruleControl.$$hasDefault = true;
      }
      if (
        ruleControl.$form.$responseContext.IsCreateMode ||
        ruleControl.controlKey === 'FormFormula'
      ) {
        const isNumber = ruleControl.$valueType === Number;
        const newVal = ruleControl.$form.$calculator.getComputationRuleResult(
          rule,
          fields,
          ruleControl,
          isNumber,
        );
        return ruleControl.value = newVal;
      }
    }
  }
}

export function ruleMixin (ruleControl) {
  ruleControl.prototype.$handleMsg = function handleMsg (message) {
    executeRule(this, message);
  };
}
