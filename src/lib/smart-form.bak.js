import { isDingtalk } from '../config/common';
import { baseUrl } from '../config/env';
import { closeApp } from '../config/dingtalk-interface';
import H3PluginDeveloper from './h3-plugins-developer';

export default {
  controls: {},
  components: [],
  // foumuser的mappingcontrols的值暂存
  mappingControlsVal: {},
  // 所有事件集合
  Actions: [],
  // 绑定解除事件集合
  ChangeEvents: {},
  // 保存表单标示
  Action_Save: 'Save',
  // 删除表单标示
  Aciton_Remove: 'Remove',
  // 打印表单
  Action_Print: 'Print',
  // 取消流程
  Action_CancelInstance: 'CancelInstance',
  // 驳回
  Action_Reject: 'Reject',
  // 提交
  Action_Submit: 'Submit',
  // 取回流程
  Action_RetrieveInstance: 'RetrieveInstance',
  // 结束流程
  Action_FinishInstance: 'FinishInstance',
  // 查看流程实例
  Action_ViewInstance: 'ViewInstance',
  // 转发
  Action_Forward: 'Forward',
  // 关闭
  Action_Close: 'Close',
  // 提交中
  IsPosting: false,
  IsLoaded: false,
  RequestParameters: {},
  BaseActionName: 'DoAction',
  AjaxUrl: '/Form/OnAction',
  // 表单状态
  SmartFormMode: {
    // 未指定
    Unspecified: -1,
    // 编辑模式
    Edit: 0,
    // 查看模式
    Readonly: 1,
    // 发起流程
    Create: 2,
    // 打印模式
    Print: 3,
  },
  gridControls: [],
  BizObjectStatus: {
    // / 草稿，对于表单来说，用户点保存，表示是草稿状态；对于流程来说，审批完成前，都是草稿状态
    Draft: 0,
    // / 审批通过
    Effective: 1,
    // / 被取消
    Canceled: 3,
    // 进行中
    Running: 2,
  },
  // 绑定数据
  Load(ResponseContext, self) {
    this.IsLoaded = false;
    // let components = self.$children[0].$children[0].$children
    // console.log(self.$children)
    if (self.$store.state.corpId || window.GlobalConfig.isExternalForm || window.GlobalConfig.isExternalShare) {
      this.components = self.$children[0].$children[0].$children;
    } else if (self.$children[0].$children[1]) {
      this.components = self.$children[0].$children[1].$children;
    } else {
      this.components = self.$children[0].$children[0].$children;
    }

    // this.components = self.$children[0].$children;
    for (const ele of this.components) {
      this.controls[ele.keyName] = ele;
      this[ele.keyName] = ele;
      // this[ele.keyName].BindChange = this.BindChange
      // this[ele.keyName].UnBindChange = this.UnBindChange
    }
    this.InitControlsComputationRules();
    this.ResponseContext = ResponseContext;
    // 加载mappingvalue的值
    if (this.ResponseContext.IsCreateMode) {
      this.InitFormUserMapping();
    }
    // 设置从后台加载过来的数据
    this.RequestParameters = ResponseContext.RequestParameters;
    // 移动端处理
    if (this.ResponseContext.IsMobile) {
      if (ResponseContext != null && ResponseContext.Actions !== undefined) {
        // 初始化Action集合
        this.Actions = [];
        for (const action in ResponseContext.Actions) {
          if (Object.prototype.hasOwnProperty.call(ResponseContext.Actions, action)) {
            this.Actions.push(ResponseContext.Actions[action]);
          }
        }
      }
    }
    // 初始化工具栏
    this.InitToolBar();

    // 调用自定义加载事件
    this.initOnLoad();
    this.IsLoaded = true;
  },
  // 初始化所有控件的computationRule
  InitControlsComputationRules() {
    this.gridControls.splice(0, this.gridControls.length);
    for (const dataField in this.controls) {
      if (Object.prototype.hasOwnProperty.call(this.controls, dataField)) {
        const controlManager = this.controls[dataField];
        if (controlManager.formVal.controlkey === 'FormGridView') {
          controlManager.InitHideRule();
          controlManager.InitGridChangeEvent();
          this.gridControls.push(controlManager);
          const gridControlManager = controlManager.$children[0].$children;
          gridControlManager.some((gridRow) => {
            gridRow.$children.some((gridControl) => {
              gridControl.InitHideRule();
              gridControl.InitComputeRule();
              return null;
            });
            return null;
          });
        } else {
          if (!controlManager.formVal.controlkey) continue;
          if (!controlManager.InitComputeRule) continue;
          controlManager.InitHideRule();
          controlManager.InitComputeRule();
        }
      }
    }
    this.gridControls.some((grid) => {
      grid.addEventTemplate();
      return null;
    });
  },
  //
  // 关联携带值处理
  // 加载mappingvalue的值
  InitFormUserMapping() {
    for (const controlKey in this.controls) {
      if (Object.prototype.hasOwnProperty.call(this.controls, controlKey)) {
        for (const mappingKey in this.mappingControlsVal) {
          if (mappingKey.indexOf('.') > -1) {
            const destField = mappingKey.split('.')[0];
            if (controlKey === destField) {
              for (const obj of this.controls[controlKey].$children[0].$children) {
                if (obj.ObjectId === this.mappingControlsVal.ObjectId) {
                  for (const child of obj.$children) {
                    if (child.keyName === mappingKey) {
                      child.SetValue(this.mappingControlsVal[mappingKey]);
                    }
                  }
                }
              }
            }
          } else if (controlKey === mappingKey) {
            this.controls[controlKey].SetValue(this.mappingControlsVal[mappingKey]);
          }
        }
      }
    }
  },
  // 删除数据时清空关联携带的mappingvalue值
  ClearFormUserMapping() {
    for (const controlKey in this.controls) {
      if (Object.prototype.hasOwnProperty.call(this.controls, controlKey)) {
        for (const mappingKey in this.mappingControlsVal) {
          if (Object.prototype.hasOwnProperty.call(this.mappingControlsVal, mappingKey)) {
            if (mappingKey.indexOf('.') > -1) {
              const destField = mappingKey.split('.')[0];
              if (controlKey === destField) {
                for (const obj of this.controls[controlKey].$children[0].$children) {
                  if (obj.ObjectId === this.mappingControlsVal.ObjectId) {
                    for (const child of obj.$children) {
                      if (child.keyName === mappingKey) {
                        child.SetValue('');
                      }
                    }
                  }
                }
              }
            } else if (controlKey === mappingKey) {
              this.controls[controlKey].SetValue('');
            }
          }
        }
      }
    }
  },

  // 初始化工具栏
  InitToolBar() {
    // 添加默认的操作
    if (this.Actions && this.Actions.length === 0) {
      this.AddDefaultActions();
    }

    // 调用自定义按钮
    this.initOnLoadActions(this.Actions);
  },
  // 添加默认的事件
  AddDefaultActions() {
    if (!this.ResponseContext || this.isEmptyObject(this.ResponseContext.Actions)) return;

    for (const key in this.Actions) {
      if (Object.prototype.hasOwnProperty.call(this.Actions, key)) {
      // 新建流程不应该有查看流程按钮
        if (this.ResponseContext.IsCreateMode &&
          this.ResponseContext.Actions[this.Action_Submit]) {
          if (this.ResponseContext.Actions[key].Action === 'ViewInstance') {
            continue;
          }
        }
        this.Actions.push(this.ResponseContext.Actions[key]);
        if (key === this.Action_Submit &&
          this.ResponseContext.IsCreateMode &&
          !this.ResponseContext.IsMobile &&
          H3PluginDeveloper.isEmptyObject(this.ResponseContext.WorkflowCode)) {
          this.Actions.push(this.SubmitAndAddAction);
        }
      }
    }
  },
  // 设置数据项前端控件的值
  // 参数1：数据项名称，参数2：数据项的值
  SetControlValue(datafiled, val) {
    this.controls[datafiled].SetValue(val);
  },
  isEmptyObject(obj) {
    if (typeof (obj) === 'string') {
      if (!obj) {
        return true;
      }
      return false;
    }
    for (const name in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, name)) {
        return false;
      }
    }
    return true;
  },
  // 执行动作: {Action:"方法名称",Datas:[{数据项1},{数据项2}]}
  OnAction(actionControl, self, fromRoute) {
    // 执行动作标示
    const actionName = actionControl.Action;
    // 参数：[{数据项1},{数据项2},...]或["#ID1"，"#ID2",...]或["数据1","数据2"]或混合
    // 可能是自定义代码里面有Datas,如果是，再把注释打开
    const datas = actionControl.Datas;
    if (actionName !== 'Remove') {
      // 自定义按钮由开发者自己校验
      if (!this.initOnValidate(actionControl)) {
        return false;
      }
    }
    // 构造数据项的值
    const CommandParams = {
      Command: actionName,
    };
    let params = [];
    // 可能是自定义代码里面有Datas,如果是，再把注释打开
    if (typeof (actionControl.LoadControlValue) === 'undefined' || actionControl.LoadControlValue) {
      if (datas) {
        for (let i = 0; i < datas.length; i += 1) {
          if (datas[i].toString().indexOf('{') === 0) {
            const key = datas[i].replace('{', '').replace('}', '');
            params.push(H3PluginDeveloper.ControlManager.GetControlValue(key));
          } else if (datas[i].toString().indexOf('#') === 0) {
            params.push(H3PluginDeveloper.ControlManager.GetControlValue(datas[i]));
          } else {
            params.push(datas[i]);
          }
        }
      }
    } else {
      params = datas;
    }
    CommandParams.Param = JSON.stringify(params);
    CommandParams.PostValue = JSON.stringify(this.GetPostValue(actionName));
    const that = this;
    // 提交到后台执行
    this.PostForm(
      actionName,
      CommandParams,
      (data) => {
        // actionControl, data, self, fromRoute
        that.ResultHandler.apply(that, [actionControl, data, self, fromRoute]);
      },
    );
    return null;
  },
  // 获取Mvc表单传给后台的数据
  GetPostValue(actionName, destActivity) {
    const SheetPostValue = {
      Command: actionName,
      DestActivityCode: destActivity,
      InstanceName: '',
      Data: {}, // 当前表单的数据项集合值
      Comment: {},
    };

    if (actionName === this.Aciton_Remove || actionName === this.Action_Forward) {
      return SheetPostValue;
    }
    SheetPostValue.Data = this.SaveSheetData();
    return SheetPostValue;
  },
  // 保存事件，获取所有控件的保存后返回的值
  SaveSheetData() {
    const SheetData = {};
    for (const control in this.controls) {
      if (Object.prototype.hasOwnProperty.call(this.controls, control)) {
        const controlManager = this.controls[control];
        if (controlManager.formVal) {
          // 过滤掉过滤条件中的控件
          if (controlManager.formVal.controlkey === undefined) {
            continue;
          }
          // 关联属性控件有sourceType属性,其数据不保存到数据库
          if (controlManager.formVal.sourcetype) {
            continue;
          }
          if (controlManager.formVal.controlkey === 'FormFormula') {
            continue;
          }
        }

        if (!$.isFunction(controlManager.SaveDataField) || controlManager.formVal.dataField === undefined || (`${controlManager.formVal.dataField}`).indexOf('.') !== -1 || controlManager.formVal.dataField === 'Comments') continue;
        $.extend(SheetData, controlManager.SaveDataField());
      }
    }
    return SheetData;
  },

  ConfirmAction(message, doneCallback) {
    H3PluginDeveloper.IConfirm('提示', message, (isTrue) => {
      if (isTrue) {
        doneCallback.call();
      }
    });
  },
  // controlkey
  // 保存
  Save(actionControl, self, fromRoute) {
    if (!this.ValidateAction(actionControl)){
      self.isCanBack = true; // 返回可点
      return false;
    }
    const SheetPostValue = this.GetPostValue(this.Action_Save);
    const that = this;
    H3PluginDeveloper.IShowPreLoader('提交中');
    this.PostForm(
      this.Action_Save, {
        PostValue: JSON.stringify(SheetPostValue),
      },
      (data) => {
        H3PluginDeveloper.IHidePreLoader();
        //过滤流程中心节点
        if (self.isCreateMode && self.appCode !== 'Sys_Workflow') {
          self.$store.dispatch('Home/recordForm', self.schemaCode);
        }
        that.ResultHandler.apply(that, [actionControl, data, self, fromRoute]);
      },
    );
    return true;
  },

  // 删除
  Remove(actionControl, self, fromRoute) {
    // 移动端标识，是否是提交类型的操作，不缓存当前表单
    const that = this;
    H3PluginDeveloper.IConfirm('提示', '确定删除该条数据吗', (isConfirm) => {
      if (isConfirm) {
        H3PluginDeveloper.IShowPreLoader('提交中');
        const SheetPostValue = that.GetPostValue(that.Aciton_Remove);
        that.PostForm(
          that.Aciton_Remove, {
            PostValue: JSON.stringify(SheetPostValue),
          },
          (data) => {
            H3PluginDeveloper.IHidePreLoader();
            that.ResultHandler.apply(that, [actionControl, data, self, fromRoute]);
          },
        );
      }
    });
  },

  // 提交/同意
  Submit(
    actionControl, text, attachments,
    destActivity, postValue, groupValue, self, fromRoute,
    url, schemaCode, bizObjectId, displayName, EnableReviewExternalForm,
    isExternalFormBol, isCreateMode, currentCommentId,
  ) {
    const that = this;
    if (that.IsPosting) {
      self.isCanBack = true; // 返回可点
      return;
    }

    if (actionControl.Text !== '已阅' && !this.ValidateAction(actionControl, self)) {
      self.isCanBack = true; // 返回可点
      return;
    }

    H3PluginDeveloper.IShowPreLoader('提交中');
    that.IsPosting = true;
    const SheetPostValue = that.GetPostValue(
      that.Action_Submit,
      destActivity, postValue, groupValue,
    );

    if (this.ResponseContext && this.ResponseContext.IsMobile) {
      // if (text) {
      let result = {};
      result.Text = text || '同意';
      if (currentCommentId) {
        result.IsNewComment = false;
        result.CommentId = currentCommentId;
      } else {
        result.IsNewComment = true;
        result.CommentId = H3PluginDeveloper.IGuid();
      }

      if ((this.ResponseContext.InstanceId ||
        this.ResponseContext.WorkItemId) &&
        !this.ResponseContext.IsCreateMode &&
        this.ResponseContext.WorkflowState !== 4 && this.ResponseContext.WorkItemType === 2) {
        result.AttachmentIds = attachments;
        result.Signature = url;
      }
      if (Object.keys(result).length === 0) {
        result = {
          AttachmentIds: [],
          CommentId: '',
          IsNewComment: true,
          Signature: '',
          Text: '同意',
        };
      }
      SheetPostValue.Comment = result;
    }
    that.PostForm(
      that.Action_Submit, {
        PostValue: JSON.stringify(SheetPostValue),
      },
      (data) => {
        H3PluginDeveloper.IHidePreLoader();
        //过滤流程中心节点
        if (self.isCreateMode && self.appCode !== 'Sys_Workflow') {
          self.$store.dispatch('Home/recordForm', self.schemaCode);
        }
        that.ResultHandler.apply(
          that,
          [
            actionControl, data, self, fromRoute, schemaCode,
            bizObjectId, displayName, EnableReviewExternalForm, url,
            isExternalFormBol, isCreateMode,
          ],
        );
      },
    );
  },

  // 驳回
  Reject(
    actionControl, text,
    attachments, destActivity, postValue, groupValue, self, fromRoute, url, currentCommentId,
  ) {
    if (!this.initOnValidate(actionControl)) {
      return false;
    }
    const SheetPostValue = this.GetPostValue(this.Action_Reject, destActivity);
    if (this.ResponseContext.IsMobile) {
      const result = {
        AttachmentIds: attachments,
        Signature: url,
      };
      result.Text = text || '';
      if (currentCommentId) {
        result.IsNewComment = false;
        result.CommentId = currentCommentId;
      } else {
        result.IsNewComment = true;
        result.CommentId = H3PluginDeveloper.IGuid();
      }
      SheetPostValue.Comment = result;
    }
    const that = this;
    this.PostForm(
      that.Action_Reject, {
        PostValue: JSON.stringify(SheetPostValue),
      },
      (data) => {
        that.ResultHandler.apply(that, [actionControl, data, self, fromRoute]);
      },
    );
    return null;
  },
  // 结束流程
  FinishInstance(actionControl, self, fromRoute) {
    const SheetPostValue = this.GetPostValue(this.Action_FinishInstance);
    const that = this;
    this.PostForm(
      that.Action_FinishInstance, {
        PostValue: JSON.stringify(SheetPostValue),
      },
      (data) => {
        that.ResultHandler.apply(that, [actionControl, data, self, fromRoute]);
      },
    );
  },
  // 取回流程
  RetrieveInstance(actionControl, self, fromRoute) {
    const that = this;
    this.PostForm(
      this.Action_RetrieveInstance, {},
      (data) => {
        that.ResultHandler.apply(that, [actionControl, data, self, fromRoute]);
      },
    );
  },

  // 当使用POST方式时，浏览器把各表单字段元素及其数据作为HTTP消息的实体内容发送给Web服务器，
  // 而不是作为URL地址的参数进行传递，使用POST方式传递的数据量要比使用GET方式传送的数据量大的多
  PostForm(action, datas, callback, errorhandler, isAsync = true) {
    const data = datas;
    const that = this;
    if (data.PostValue) {
      const PostValue = JSON.parse(data.PostValue);
      const beforSubmitResult = that.initBeforeSubmit(action, PostValue);
      if (typeof (beforSubmitResult) !== 'undefined' && !beforSubmitResult) {
        return;
      }
      data.PostValue = JSON.stringify(PostValue);
    }

    const paramData = Object.assign({
      Command: action,
    }, data, that.RequestParameters);
    paramData.ActionName = that.BaseActionName;
    const params = {
      PostData: JSON.stringify(paramData),
    };
    const ajaxTimeOut = $.ajax({
      url: baseUrl + that.AjaxUrl,
      method: 'post',
      data: params,
      dataType: 'json',
      async: isAsync,
      success(response) {
        if (response.Successful) {
          that.initAfterSubmit(
            that, action.Action ? action.Action : action,
            response.ReturnData.StartFormResponse,
          );
          if (that.IsFunc(callback)) {
            callback(response.ReturnData.StartFormResponse);
          }
        }
      },
      error() {
        // reject(err);
      },
      complete(XMLHttpRequest, status) { // 当请求完成时调用函数
        if (status === 'error' && XMLHttpRequest.readyState === 0) { // status == 'timeout'意为超时,status的可能取值：success,notmodified,nocontent,error,timeout,abort,parsererror
          H3PluginDeveloper.IHidePreLoader();
          that.IsPosting = false;
          if (ajaxTimeOut) {
            ajaxTimeOut.abort(); // 取消请求
          }
          H3PluginDeveloper.IShowWarn('提示', '网络不给力，请稍后再试');
        }
      },
    });
  },
  // 开放给开发者的接口:校验
  ValidateAction(ActionControl, self) {
    if (this.initOnValidate(ActionControl)) {
      return this.Validate(ActionControl, self);
    }
    return false;
  },
  // 函数：控件校验
  Validate(ActionControl) {
    let flag = true;
    // for (let control in this.controls) {
    for (const control of this.components) {
      if (control && control.formVal && control.formVal.controlkey !== 'FormGridView') {
        const controlManager = control;
        if (controlManager.formVal.controlkey === 'FormTitle') continue;
        if (ActionControl != null && ActionControl.Action === this.Action_Save && controlManager.formVal.controlkey !== 'FormAttachment') {
          // 保存的时候，需要校验附件是上传完整
          continue;
        }

        if (!this.IsFunc(controlManager.Validate)) continue;
        // if (controlManager.DataField == void 0) continue;
        // 控件不可见不校验
        if (!controlManager.isVisible) continue;
        if (!controlManager.Validate(ActionControl.Action) && flag) {
          flag = false;
          // 自动定位到验证失败的控件
          if (this.ResponseContext.IsMobile) {
            const $elment = controlManager.$el;
            const top = $elment.offsetTop;
            const height = $($elment).height();
            // window.scrollTo(0, top - height)
            const dom = document.getElementById('vux_view_box_body');
            dom.scrollTop = top - height;
            if (controlManager.formVal.controlkey === 'FormTextBox' || controlManager.formVal.controlkey === 'FormTextArea' || controlManager.formVal.controlkey === 'FormNumber' || controlManager.formVal.controlkey === 'FormAreaSelect') {
              $($elment).find('input,textarea').focus();
            }
          }
        }
      } else {
        if (!control.isVisible) continue;
        if (!control.Validate() && flag) {
          flag = false;
          // 自动定位到验证失败的控件
          if (this.ResponseContext.IsMobile) {
            const $elment = control.$el;
            const top = $elment.offsetTop;
            const height = $($elment).height();
            // window.scrollTo(0, top - height)
            const dom = document.getElementById('vux_view_box_body');
            dom.scrollTop = top - height;
          }
        }
        if (control.formVal.displayMode !== '1' && control.$children[0].$children.length > 0) {
          const childTableRowCount = control.$children[0].$children.length;
          for (let i = 0; i < childTableRowCount; i += 1) {
            for (const childControl of control.$children[0].$children[i].$children) {
              // let controlManager = childControl;
              if (ActionControl != null && ActionControl.Action === this.Action_Save) {
                // 保存的时候，需要校验附件是上传完整
                continue;
              }
              if (!this.IsFunc(childControl.Validate)) continue;
              // 控件不可见不校验
              if (!childControl.isVisible) continue;
              if (!childControl.Validate() && flag) {
                flag = false;

                // 自动定位到验证失败的控件
                if (this.ResponseContext.IsMobile) {
                  const $elment = childControl.$el;
                  const top = $elment.getElementTop();
                  const height = $elment.offsetHeight;
                  // window.scrollTo(0, top - height);
                  const dom = document.getElementById('vux_view_box_body');
                  dom.scrollTop = top - height;
                  if (childControl.formVal.controlkey === 'FormTextBox' || childControl.formVal.controlkey === 'FormTextArea' || childControl.formVal.controlkey === 'FormNumber' || childControl.formVal.controlkey === 'FormAreaSelect') {
                    $($elment).find('input,textarea').focus();
                  }
                }
              }
            }
          }
        }
      }
    }
    return flag;
  },
  // 关闭页面
  ClosePage() {
    // 判断是否是移动端
    if (this.ResponseContext.IsMobile) {
      // 判断是否通过消息传过来的
      if (window.GlobalConfig.messageType) {
        closeApp();
      } else {
        window.history.go(-1);
      }
    }
  },

  // 回调函数处理
  ResultHandler(
    actionControl, data, selfs, fromRoute, schemaCode,
    bizObjectId, displayName, EnableReviewExternalForm, url, isExternalFormBol, isCreateMode,
  ) {
    const self = selfs;
    if (actionControl.OnActionDone) {
      if (!actionControl.OnActionDone.apply(actionControl, [data])) {
        return;
      }
    }

    if (data.Successful) {
      // 单页模式为240，目前移动端做不到操作后重新刷新页面，只能先把页面关闭，与PC端不一致
      if (
        data.ClosePage || data.NodeType === 240 || (!data.ClosePage && isExternalFormBol)
      ) {
        const that = this;
        let successTips,
type;
        if (actionControl.Action === 'Reject' || (actionControl.Action === 'Submit' && (this.ResponseContext.InstanceId || this.ResponseContext.WorkItemId) && !this.ResponseContext.IsCreateMode && this.ResponseContext.WorkflowState !== 4 && this.ResponseContext.WorkItemType === 2)) {
          successTips = actionControl.Text ? actionControl.Text : '审批';
          type = '审批';
        } else {
          successTips = actionControl.Text;
        }
        if (data.Message) {
          H3PluginDeveloper.IShowTip(data.Message);
        }
        if (successTips) {
          H3PluginDeveloper.IShowSuccess('提示', `${successTips}成功`, () => {
            self.$store.state.actionName = actionControl.Action;
            if (that.ResponseContext.IsMobile) {
              if ((!window.GlobalConfig.schemaCode &&
                !window.GlobalConfig.menuCode &&
                !window.GlobalConfig.isExternalForm)
              || window.GlobalConfig.isList) {
                if (actionControl.Action === 'Remove') {
                  self.$root.eventHub.$emit('form-remove');
                }
                if (type === '审批') {
                  self.$router.go(-2);
                } else if (self.fromHome && data.NodeType !== 240){
                  const appCode = self.appCode;
                  const schemaCode = self.schemaCode;
                  const appName = self.DisplayName;
                  self.$root.eventHub.$emit('query-lists');
                  self.$router.replace({
                    name: 'list',
                    params: { appCode, schemaCode, appName },
                  });
                } else {
                  self.$router.go(-1);
                }
              } else if (EnableReviewExternalForm) {
                if (isCreateMode) {
                  self.$router.push({
                    name: 'externalForm',
                    params: {
                      ReviewQrCodeUrl: url,
                      schemaCode: schemaCode || window.GlobalConfig.schemaCode,
                      bizObjectId: bizObjectId || this.responseContext.BizObjectId,
                      displayName,
                      isExternalForm: '1',
                    },
                  });
                } else if (isDingtalk) {
                  setTimeout(() => {
                    closeApp();
                  }, 300);
                } else if (typeof (WeixinJSBridge) !== 'undefined') {
                  WeixinJSBridge.call('closeWindow');
                  return;
                } else {
                  const browserName = navigator.appName;
                  if (browserName === 'Netscape') {
                    window.open('', '_self', '');
                    window.close();
                  }
                  if (browserName === 'Microsoft Internet Explorer') {
                    window.parent.opener = 'whocares';
                    window.parent.close();
                  }
                }
              } else if (isDingtalk) {
                closeApp();
              } else if (typeof (WeixinJSBridge) !== 'undefined') {
                WeixinJSBridge.call('closeWindow');
                return;
              } else {
                const browserName = navigator.appName;
                if (browserName === 'Netscape') {
                  window.open('', '_self', '');
                  window.close();
                }
                if (browserName === 'Microsoft Internet Explorer') {
                  window.parent.opener = 'whocares';
                  window.parent.close();
                }
              }
              self.isCanBack = true;
              that.IsPosting = false;
              self.$root.eventHub.$emit('form-updated');
              self.$store.state.excludeComp = ['formPage', 'approve'];
              self.$store.state.childRenderedLen = 0;
              self.$store.state.gridChildLen = 0;
              self.$store.state.isFormInitFinish = false;
              // 判断ISHowForm是否有回调函数，如果就就先执行，再赋空值；
              if (window.GlobalConfig.callbackCache.length && actionControl.Action !== 'Close') {
                window.GlobalConfig.callbackCache[0](that.GetPostValue(actionControl.Action));
                window.GlobalConfig.callbackCache = [];
              }
            }
            // },100)
          });
        } else {
          self.isCanBack = true;
          self.$router.go(-1);
          that.IsPosting = false;
          self.$root.eventHub.$emit('form-updated');
          self.$store.state.excludeComp = ['formPage', 'approve'];
          self.$store.state.childRenderedLen = 0;
          self.$store.state.gridChildLen = 0;
          self.$store.state.isFormInitFinish = false;
          // 判断ISHowForm是否有回调函数，如果就就先执行，再赋空值；
          if (window.GlobalConfig.callbackCache.length && actionControl.Action !== 'Close') {
            window.GlobalConfig.callbackCache[0](that.GetPostValue());
            window.GlobalConfig.callbackCache = [];
          }
        }
      } else if (data.Message) {
        self.isCanBack = true;
        H3PluginDeveloper.IShowTip('提示', data.Message);
      }

    } else {
      // Error:错误提示方式需要修改
      if (data.Errors.length) {
        for (let i = 0; i < data.Errors.length; i += 1) {
          const errorMessage = data.Errors[i];
          H3PluginDeveloper.IErrorConfirm('系统出错了，请联系相关人员处理', (result) => {
            if (result === 1) {
              self.$router.push({
                name: 'errorShow',
                params: {
                  errorInfo: errorMessage,
                },
              });
            }
          });
        }
      }
      if (data.Infos.length) {
        for (let i = 0; i < data.Infos.length; i += 1) {
          H3PluginDeveloper.IShowWarn('提示', data.Infos[i], () => false);
        }
      }
      if (data.Message) {
        H3PluginDeveloper.IShowTip('提示', data.Message);
      }
      this.IsPosting = false;
      self.isCanBack = true;
    }
  },


  // 表单加载
  initOnLoad() {
    if (this.IsFunc(this.OnLoad)) {
      try {
        this.OnLoad();
      } catch(error) {
        console.info(error);
      }
    }
  },

  // 加载菜单
  initOnLoadActions(actions) {
    if (this.IsFunc(this.OnLoadActions)) {
      try {
        this.OnLoadActions(actions);
      } catch(error) {
        console.info(error);
      }
    }
  },

  // 表单校验
  initOnValidate(ActionControl) {
    if (this.IsFunc(this.OnValidate)) {
      try {
        return this.OnValidate(ActionControl);
      } catch(error) {
        console.info(error);
      }
    }
    return true;
  },

  // 提交前事件
  initBeforeSubmit(action, postValue) {
    if (this.IsFunc(this.BeforeSubmit)) {
      try {
        return this.BeforeSubmit(action, postValue);
      } catch(error) {
        console.info(error);
      }
    }
    return undefined;
  },

  // 提交后事件
  initAfterSubmit(that, action, postValue) {
    if (this.IsFunc(this.AfterSubmit)) {
      try {
        return this.AfterSubmit(action, postValue);
      } catch(error) {
        console.info(error);
      }
    }
    return null;
  },

  // 清理所有自定义事件
  CleanEvents() {
    this.OnLoad = null;
    this.OnLoadActions = null;
    this.OnValidate = null;
  },
  // 判断参数是否是函数
  IsFunc(fn) {
    return !!fn && typeof fn !== 'string' && !fn.nodeName && fn.constructor !== Array && /^[\s[]?function/.test(`${fn}`);
  },
};
