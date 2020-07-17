
import { initComputationRule } from './rule';
import { formatDate } from '../../utils';

// 可用控件
const USABLE_CONTROLS = ['FormTextBox', 'FormTextArea', 'FormNumber', 'FormDateTime'];



export function ifControlHasDefaultValueSetting ({ controlkey,IsFormula }) {
  return false;
  return typeof(IsFormula)==='boolean' &&
    USABLE_CONTROLS.includes(controlkey);
}

export function isControlUsingFormula(options) {
  return false;
  const {
    ComputationRule, ComputationRuleFields, IsFormula, DefaultValueRuleType
  } = options;
  return (
    // 首先, 有计算公式的相关配置存在
    ComputationRule && ComputationRuleFields
  ) && (
    // 其次
    // 或: 2.0 和 3.0 中没经过填写设置配置的老数据控件
    typeof (IsFormula) !== 'boolean' ||
    // 或: 经过填写配置, 并且使用认定为计算公式控件的
    IsFormula ||
    // 或: 非计算公式控件, 但制定了使用计算公式的
    DefaultValueRuleType === 1
  );
}
// @@

export function initDefaultValue(value) {
  return value;
}

export function initDefaultDateValue(format, value) {
  const today = new Date();
  const dates = today.getDate();
  today.setDate(value === 'yesterday' ? dates - 1 : value === 'tomorrow' ? dates + 1 : dates);
  format = format.replace('yyyy-mm', 'yyyy-MM');
  return formatDate(+today, format);
}

export function initDefaultComputationValue(control, rule, fields) {
  const isNumber = control.$valueType === Number;
  return control.$form.$calculator.getComputationRuleResult(
    rule,
    fields,
    control,
    isNumber
  );
}


// 通用的默认值设置
export function commonDefaultValueSetter(value) {
  const { options } = this;
  let action = 0;

  console.log('_______ init default start', options.controlkey, options.DisplayName, value, this);

  if ( this.$$rules && this.$$rules.computationRule ) {
    action = 1;
    const { rule, fields } = this.$$rules.computationRule;
    if ( rule && fields ) {
      // value = initDefaultComputationValue( this,rule,fields );
      value = initComputationRule(this,rule,fields);
    }
    // 碰到计算公式没设置, 但偏要使用的情况, 只能无情置空; 否则 value 会默认等于 defaultValue
    else {
      value = null;
    }
  }
  // 默认值-固定文本
  else if (options.DefaultValueRuleType === 3) {
    action = 2;
    // 因为某些设置可能会影响默认值; 比如设置了日期默认值 '2010-10-10', 后面改了格式 'yyyy-MM'; 这时候 value 会被改成'2010-10', 而DateDefaultValue 还是'2010-10-10'
    if (options.Type === 5) value = initDefaultValue(value || options.DateDefaultValue);
    else value = initDefaultValue(options.DefaultValue);
  }
  // 默认值-限定范围: 仅日期, ['today', 'yesterday', 'tomorrow'];
  else if (options.Type === 5 && options.DefaultValueRuleType === 4) {
    action = 3;
    value = initDefaultDateValue(options.datetimemode, options.DateDefaultValue);
  }

  console.log('_______ init default end', action, value);

  return value;
}
