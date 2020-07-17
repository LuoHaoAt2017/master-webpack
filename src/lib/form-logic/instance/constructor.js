import IControlFactory from '../control-factory';
import Dispatcher from './dispatcher';
import Calculator from './calculator';
import CustomApi from './custom-api';
import { LifeState } from '../base/global/lifestate';
import { Mutation } from '../modal/types';
import H3PluginDeveloper from '../../h3-plugins-developer';

function initFormLogic (options) {
  try {
    const {
      version, bizObjectId, returnData, formData, Javascript, CarryOverMapping, updateView,
    } = options;
    this.$bizObjectId = bizObjectId;
    // 初始化分发器和计算器
    this.$dispatcher = new Dispatcher(this);
    this.$calculator = new Calculator(this);
    // 业务层 更新 渲染层
    this.$responseContext = formData.$responseContext;
    this.$carryOverMapping = CarryOverMapping || [];
    this.$isCreateMode = formData.$responseContext.IsCreateMode;
    this.$version = version;
    const ImplControl = IControlFactory(this, updateView);
    this.$renderFields = []; // 需要渲染的控件字段
    for (const field in returnData) {
      if (Object.prototype.hasOwnProperty.call(returnData, field) &&
        formData[field]) {
        const controlOptions = returnData[field];
        controlOptions.dataField = field;
        if (controlOptions.controlkey) {
          this.$renderFields.push(field);
        }
        this[field] = new ImplControl(controlOptions, formData[field]);
      }
    }
    // 初始化自定义代码
    this.$customApi = new CustomApi(this, Javascript);
  } catch (error) {
    if (this.$$debugMode) {
      this.$errorHandler('表单逻辑层初始化失败',error);  // eslint-disable-line
    }
  }
}

function initRuleResult (formInstance) {
  let curDataField = '';
  let curDisplayName = '';
  try {
    // 初始化时为控件推送消息，执行规则
    const isLoadingData = !formInstance.$responseContext.IsCreateMode;
    formInstance.$batchAllField((dataField, control) => {
      curDataField = dataField;
      curDisplayName = control.options.DisplayName;
      // 控件有订阅，（控件有计算规则或隐藏规则）
      if (control.$$hasSubs || control.$$hasMapping) {
        if (control.isIngrid) {
          const gridControl = formInstance[control.parentDataField];
          for (const rowId of gridControl.rows) {
            formInstance.$dispatcher.pushMsg(
              control,
              isLoadingData,
              [control.parentDataField, rowId, dataField],
            );
          }
        } else {
          formInstance.$dispatcher.pushMsg(control, isLoadingData);
        }
      }
    });
    formInstance.$dispatcher.flushMsg();
  } catch (error) {
    if (formInstance.$$debugMode) {
      const errorMsg = `${curDataField}-${curDisplayName}控件初始化规则失败`;
      formInstance.$errorHandler(errorMsg, error);
    }
  }
}

export default function init (formInstance, options) {
  // 首先，创建状态机，利用钩子函数生命表单每个阶段该做的事
  formInstance.$stateMachine = new LifeState(formInstance, {
    // 表单实例正在构建
    onCreate () {
      // 进行表单创始化，创建控件、分发器、计算器、自定义代码接口
      initFormLogic.call(this, options);
    },
    // 表单正在初始化
    onInit () {
      // 开放消息队列，此时规则才能生效
      this.$dispatcher.messageQueue.unblockQueue();
      // 隐藏加载的菊花图提示
      H3PluginDeveloper.IHidePreLoader();
      // 执行初始渲染，此时会开始执行计算、隐藏、填充规则
      initRuleResult(this);
    },
    // 表单进入就绪状态
    onReady () {
      // 执行自定义代码的OnLoad
      this.$customApi.OnLoad();
      this.$customApi.OnLoadActions(this.$customApi.Actions);
      // 重置表单的脏值检测
      options.updateView(Mutation.RESETDIRTY);
    },
    // 表单发生更新，用户输入
    onUpdate () {
      // 发生更新后，遍历消息队列，依次递归执行规则
      this.$dispatcher.flushMsg();
    },
  });
  formInstance.$stateMachine.stateCirculate();
}
