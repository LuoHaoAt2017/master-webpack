import { isFalsy } from '../../utils';
import pubsubMixin from '../../base/control/pub-sub';
import { proxyMixin, initProxy } from '../../base/control/proxy';
import {
  initDisplayRule, initComputationRule, initLinkMappingRule, initDefaultValue,initDateDefaultValue, ruleMixin
} from './rule';
import { ifControlHasDefaultValueSetting, isControlUsingFormula } from './default-value'
import customEventMixin from './custom-event';

function BaseControl(options, $data) {
  this.controlKey = options.controlkey;
  this.dataField = options.dataField;
  // 是否设置默认值; 跟2个条件相关: 是否创建模式、是否有默认值设置; 如果涉及计算公式, 先做记录, 然后放到 initDefaultValue 里处理；
  this.$$shouldInitDefaultValue = this.$form.$responseContext.IsCreateMode &&
    ifControlHasDefaultValueSetting(options);
  this.$$computationBackup = isControlUsingFormula(options)?
    { computationRule: {rule:options.ComputationRule, fields:options.ComputationRuleFields} }:
    null;

  Object.defineProperty(this, 'options', {
    value: $data.options,
    writable: false,
    enumerable: true,
    configurable: false,
  });
  if (options.parentDataField) {
    // 子表
    this.isIngrid = true;
    this.parentDataField = options.parentDataField;
    delete options.parentDataField;
    this.visible = true;
    this.value = isFalsy(options.Value) ? this.$clearValue() : options.Value;
  } else {
    initProxy(this, $data);
  }
  if (options.controlkey === 'FormButton') {
    this.visible = true;
  } else if (options.Visible) {
    // // 默认隐藏
    // if ( options.AlwaysHiding ) this.visible = false;
    // // 动态隐藏
    // else
    initDisplayRule(this, options.DisplayRule, options.DisplayRuleFields);
  } else {
    // options中visible: false表示权限控制不可见
    this.visible = false;
  }

  // 数据联动、计算规则互斥，不存在两个都同时出现问题
  initLinkMappingRule(this, options.datalinkresult, options.datalinkcondition);
  // 计算公式不能全部控件无条件执行, 因为内里会设置了计算公式但不使用的控件还做订阅的话事情就诡异了, 所有带默认值设置的控件走自己的 $initDefaultValue
  // 仅2种情况下支持触发计算公式绑定: 2.0老数据, 3.0未经过默认值设置的老数据
  if ( !this.$$shouldInitDefaultValue ) {
    initComputationRule(this, options.ComputationRule, options.ComputationRuleFields);
  }

}

pubsubMixin(BaseControl);
proxyMixin(BaseControl);
ruleMixin(BaseControl);
customEventMixin(BaseControl);

export default BaseControl;
