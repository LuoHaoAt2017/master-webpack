import { calcExpression, calculateFn } from '../../base/global/caculator/parser';
import fn from './function';
// import { isNumeric } from '../../util';

function parseValue (fieldVal, val) {
  // const val = [];
  if (typeof fieldVal === 'number' || (typeof fieldVal === 'boolean')) {
    val.push(fieldVal);
  } else if (Object.prototype.toString.call(fieldVal).indexOf('Array') > -1) {
    fieldVal.forEach((item) => {
      val.push(`"${item}"`);
    });
  } else if (Object.prototype.toString.call(fieldVal).indexOf('Object') > -1) {
    val.push(`'${JSON.stringify(fieldVal)}'`);
  } else {
    // val.push(`"${fieldVal}"`);
    val.push(`"${fieldVal.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`); // 解决输入英文的双引号及单斜杠的问题
  }
  return val;
}

function parseRule (formInstance, rule, fields, targetControl) {
  if (!rule || !fields) {
    return null;
  }
  let calcRule = rule;
  if (fields.length === 0) {
    return calcRule;
  }
  const instance = formInstance;
  // 例如A = B + C , 则A是targetControl, B和C是sourceControl
  for (let j = 0, len = fields.length; j < len; j += 1) {
    // 需要考虑字段是子表情况
    const ctrlField = fields[j];
    const sourceControl = instance[ctrlField];
    const val = [];
    if (sourceControl.isIngrid) {
      // 子表外部聚合函数计算规则
      if (!targetControl.isIngrid) {
        const mainField = sourceControl.parentDataField;
        // 此处需要获取到子表所有的该字段控件
        const gridRows = instance[mainField].rows;
        for (const rowId of gridRows) {
          const subControl = instance[mainField][rowId][ctrlField];
          const subValue = subControl.value;
          const fieldVal = subControl.$getRuleValue(subValue);
          parseValue(fieldVal, val);
        }
      } else {
        const targetParentGrid = targetControl.parentDataField; // 当前子表
        const sourceParentGrid = sourceControl.parentDataField; // 规则字段子表
        if (targetParentGrid === sourceParentGrid) {
          // 同一个子表，取与当前字段在同一行的字段
          const rowId = targetControl.rowId;
          const sourceRow = instance[sourceParentGrid][rowId];
          // 判断消息来源行还在不在，因为可能消息是在删除行时候发出的
          if (sourceRow) {
            const subControl = sourceRow[ctrlField];
            const subValue = subControl.value;
            const fieldVal = subControl.$getRuleValue(subValue);
            parseValue(fieldVal, val);
          }
        } else {
          const gridRows = instance[sourceParentGrid].rows;
          for (const objectId of gridRows) {
            const subControl = instance[sourceParentGrid][objectId][ctrlField];
            const subValue = subControl.value;
            const fieldVal = subControl.$getRuleValue(subValue);
            parseValue(fieldVal, val);
          }
        }
      }
    } else {
      // 非子表字段
      const control = instance[ctrlField];
      const fieldVal = control.$getRuleValue(control.value);
      parseValue(fieldVal, val);
    }
    const replaceField = `{${ctrlField}}`;
    const reg = new RegExp(replaceField, 'g');
    calcRule = calcRule.replace(reg, val);
  }
  return calcRule;
}

function getRuleResult (calcRule) {
  let resRule = `${calcRule}`.replace(/\$\.fn/g, 'this.fn');
  // 需要处理 0/0 这类情况
  const divideZeroReg = /\d+[\s]*\/[\s]*0[^\.0-9]?/g; // eslint-disable-line
  resRule = resRule.replace(divideZeroReg, 0);
  const context = { fn };
  try {
    const ruleFn = new Function(`return ${resRule}`);
    return ruleFn.call(context);
  } catch (err) {
    if (typeof resRule === 'string') {
      resRule = resRule.replace(/"/g, '');
    }
    return `"${resRule}"`;
  }
}

class Calculator {
  constructor (formInstance) {
    this.$form = formInstance;
  }

  getComputationRuleResult (
    rule,
    fields,
    targetControl,
    isNumber,
  ) {
    const formInstance = this.$form;
    const calcRule = parseRule(formInstance, rule, fields, targetControl);
    if (isNumber && fields.length > 0) {
      let expression = calculateFn(calcRule);
      expression = expression.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ');
      // 需要处理 0/0 这类情况
      const ret = calcExpression(expression);
      return getRuleResult(ret);
    }
    const val = getRuleResult(calcRule);
    // 此处 targetControl 可能为 null, 所以要先进行判断
    if (!!targetControl && targetControl.options.Type === 5) {
      // 日期类型，此处考虑用枚举
      return val.replace(/T/g, ' ').replace(/-/g, '/');
    }
    return val;
  }

  getDisplayRuleResult (rule, fields, targetControl) {
    const formInstance = this.$form;
    const calcRule = parseRule(formInstance, rule, fields, targetControl);
    return getRuleResult(calcRule);
  }
}

export default Calculator;
