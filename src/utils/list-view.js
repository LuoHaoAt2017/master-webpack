// zyq;
import H3PluginDeveloper from '../lib/h3-plugins-developer';
import { baseUrl } from '../config/env';

export default class ListView {
  constructor() {
    this.Element = null;
    this.ResponseContext = {};
    this.Actions = {};
    this.Headers = {};

    this.AjaxUrl = `${baseUrl}/App/OnAction/`;
    this.SheetUrl = `${baseUrl}/Form/DefaultSheet/`;

    this.ListViewDisplayMode = {
      // / 列表模式
      List: 0,
      // / 日历模式
      Calendar: 1,
      // /时间轴模式
      Timeline: 2,
    };
    this.ListViewCheckBox = {
      // / 列表模式
      Show: 0,
      // / 日历模式
      Hide: 1,
    };

    this.BizObjectStatus = {
      // / 草稿，对于表单来说，用户点保存，表示是草稿状态；对于流程来说，审批完成前，都是草稿状态
      Draft: 0,
      // / 审批通过
      Effective: 1,
      // / 被取消
      Canceled: 3,
      // 进行中
      Running: 2,
    };
    this.Action_Create = 'Create';
    this.SearchParamsJson = 'searchParamsJson';
    this.ScopeType = 'scopeType';
  }

  Init(ResponseContext, vm) {
    window.listview = this;
    window.H3PluginDeveloper = H3PluginDeveloper;
    this.ResponseContext = ResponseContext;
    this.Actions = this.ResponseContext.Actions;
    this.Headers = this.ResponseContext.Headers;
    this.QueryCode = this.ResponseContext.SchemaCode;
    this.LoadScriptString();

    // this.InitQueryItems(this.ResponseContext.QueryItems);
    this.Selectable = this.ResponseContext.Selectable;
    this.HasCustomActions = this.ResponseContext.HasCustomActions;
    this.AppCode = this.ResponseContext.AppCode;
    this.Mode = this.ResponseContext.ListMode;
    this.vm = vm;
  }

  // 初始化过滤
  // InitQueryItems(queryItems) { }

  // 初始化工具栏
  // InitActions(Actions) { }

  // InitFilter() { }

  LoadScriptString() {
    if (this.ResponseContext.Javascript) {
      let javascriptCode = this.ResponseContext.Javascript.replace(/\$.ListView/g, 'listview');
      javascriptCode = javascriptCode.replace(/\$/g, 'H3PluginDeveloper');
      eval(javascriptCode);
    }
  }

  // 工具栏点击事件
  DoAction(actionName) {
    if ($.isFunction(this.ActionPreDo)) {
      const preDoResult = this.ActionPreDo.apply(this, [actionName]);
      // todo  代码直接return时直接返回undefined
      if (preDoResult !== undefined && !preDoResult) {
        return;
      }
    }
    switch (actionName) {
      case 'Create':
        this.Create.apply(this);
        break;
      case 'Remove':
        this.Remove.apply(this);
        break;
      default:
        if (actionName !== undefined && actionName !== '') {
          const that = this;
          const rows = this.GetSelected();
          const ids = [];
          if (rows && rows.length > 0) {
            for (let i = 0, len = rows.length; i < len; i += 1) {
              ids.push(rows[i].ObjectId);
            }
          }
          this.Post(actionName, { ObjectIds: JSON.stringify(ids) }, (result) => {
            if (result.Successful) {
              if (result.Message) {
                H3PluginDeveloper.IShowTip(result.Message);
              }
              that.RefreshView.apply(that);
            } else if (result.ErrorMessage) {
              H3PluginDeveloper.IShowWarn(result.ErrorMessage);
            } else if (result.Errors.length > 0) {
              // 当有返回错误提示信息时，优先显示提示信息
              H3PluginDeveloper.IShowWarn(result.Errors[0]);
            } else {
              H3PluginDeveloper.IShowWarn('失败!');
            }
          });
        }
        break;
    }
  }

  // Create() { }

  Remove() {
    const that = this;
    const Rows = this.GetSelected();
    if (Rows.length === 0) {
      H3PluginDeveloper.IShowWarn('警告', '没有选中任何行');
      return;
    }

    H3PluginDeveloper.IConfirm('提示', '确定删除选中数据吗', () => {
      const ids = [];
      for (let i = 0; i < Rows.length; i += 1) {
        ids.push(Rows[i].ObjectId);
      }
      $.ajax({
        type: 'POST',
        url: that.AjaxUrl,
        data: {
          PostData: JSON.stringify({
            ActionName: 'DoAction', Command: 'Remove', QueryCode: that.QueryCode, ObjectIds: JSON.stringify(ids),
          }),
        },
        dataType: 'json',
        success(result) {
          if (result.Successful) {
            that.RefreshView.apply(that);
          } else {
            H3PluginDeveloper.IShowError('错误', '删除失败');
          }
        },
      });
    });
  }

  // InitBody() { }

  GetSelected() {
    // 先判断是否可以选择
    if (!this.Selectable) {
      return [];
    }
    return this.vm.getSelected();
  }

  RefreshView() {
    if (this.vm.$route.name === 'list') {
      this.vm.doRefresh();
    }
  }

  Post(action, data, callback, errorhandler, isAsync = true) {
    // const that = this;
    const paramData = $.extend({ Command: action, ActionName: 'DoAction', QueryCode: this.QueryCode }, data);
    jQuery.ajax({
      type: 'POST',
      url: this.AjaxUrl,
      data: { PostData: JSON.stringify(paramData) },
      dataType: 'json',
      async: isAsync,
      success(outData) {
        const reponseData = outData.ReturnData.Response;
        function handle(d) {
          if ($.isFunction(callback)) {
            callback.apply(this, [d]);
          }
        }
        if (reponseData.DebugTrack != null && reponseData.DebugTrack.DebugState === 0) {
          // $.IPushDebugTrack(reponseData, that, handle);
        } else {
          handle(reponseData);
        }
      },
      error: errorhandler,
    });
  }
}
