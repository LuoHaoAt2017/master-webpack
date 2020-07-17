import {
  ActivityStyleClassName, ActivityModelSettings,
  ActivityModelStyleClassName,
} from '../activity/setting';

// 活动模板
// selector          :DOM对象选择器
export const ActivityModel = function b(_selector) {
  // DOM对象
  this.htmlObject = undefined;
  this.compatibleTypes = undefined;

  this.init(_selector);
  return this;
};

export const TooltipTexts = {
  FillSheet: '只能提交数据，提交后进入下一节点',
  Approve: '可同意或驳回流程',
  Circulate: '可提醒相关人员查看流程进度或流程处理结果',
  Connection: '多个节点均处理完成后才能进入下一节点的场景，可用汇合点来实现',
  SubInstance: '可在当前流程中创建另外一个流程',
  Line: '用于连接节点，标识流程走向',
};

ActivityModel.prototype = {
  init(_selector) {
    this.htmlObject = $(_selector)[0];
    if (this.htmlObject) {
      // 在DOM中保存当前模板
      $(this.htmlObject).data(ActivityModelSettings.ActivityDataProperty, this);
    }
  },

};

// 活动模板初始化
export const ActivityModelInit = function ActivityModelInit(activityTemplateConfigs) {
  // 加载模板定义
  if (activityTemplateConfigs && activityTemplateConfigs.length > 0) {
    // 活动模板的容器
    const modelDiv = $('<div ></div>').addClass(ActivityModelStyleClassName.ActivityModel);
    const modelContent = $('<div></div>').addClass(ActivityStyleClassName.ActivityContent);
    // 图标
    const logoDiv = $('<span></span>').addClass(ActivityModelStyleClassName.ActivityModelLogoDiv);
    modelDiv.append(modelContent);
    modelContent.append(logoDiv);
    // 文字
    modelContent.append($('<span></span>').addClass(ActivityModelStyleClassName.ActivityModelLabel));
    // 添加编辑框
    ActivityModelSettings.ActivityModels = [];

    // 活动模板按SortKey排序
    activityTemplateConfigs.sort((a, b) => {
      if (a && b && !Number.isNaN(Number(a.SortKey)) && !Number.isNaN(Number(b.SortKey))) {
        return a.SortKey > b.SortKey;
      }
      return null;
    });

    // 初始化各模板
    $(activityTemplateConfigs).each(function a() {
      if (this.ToolTipText) {
        // 解析和初始化活动模板区域
        const currentModelHtml = modelDiv.clone();
        currentModelHtml.find(`.${ActivityModelStyleClassName.ActivityModelLogoDiv}`).addClass(`activity_logo_${this.ToolTipText}`);
        currentModelHtml.find(`.${ActivityModelStyleClassName.ActivityModelLogoDiv}`).attr('title', this.DisplayName);
        const activitymodel = new ActivityModel(currentModelHtml);
        ActivityModelSettings.ActivityModels.push(activitymodel);

        $.extend(activitymodel, activitymodel, this);
        activitymodel.ToolTipText = this.ToolTipText;
      }
    });
  }
};

