import workflow from './workflow';
import { WorkflowColor } from './setting';

export const WorkflowPlaySettings = {
  StartPlay: undefined,
  PausePlay: undefined,
  EndPlay: undefined,
  PlayNextFrame: undefined,
  // 播放标识
  PlayFlag: {
    // 播放中
    Playing: 1,
    // 暂停
    Pause: 2,
    // 结束
    End: 3,
  },
  // 动作类型
  ActionType: {
    // 激活
    Active: 1,
    // 完成
    Finish: 2,
    // 取消
    Cancel: 3,
    // 异常
    Exception: 4,
  },
};

export const WorkflowPlayStack = {
  // 开始活动编码
  StartActivityCode: undefined,

  // 所有动作
  AllActions: [],
  StageModel: undefined,
  DancerModel: undefined,

  // 播放标识
  PlayFlag: undefined,
  // 当前控制帧
  Controler: undefined,
  // 当前表演帧
  CurrentFrame: undefined,
  // 下一帧索引
  NextFrameIndex: 0,
  // 当前正在播放的多个动作
  CurrentActions: undefined,
};

export const PlayAction = function c(_ActionTime, _ActivityCode, _ActionType, _TokenId) {
  // 表演时间
  this.ActionTime = _ActionTime;
  // 活动编码
  this.ActivityCode = _ActivityCode;
  // 动作类型
  this.ActionType = _ActionType;
  // TokenId
  this.TokenId = _TokenId;
};
// 播放
// _IsControler:判断是否在控制下一帧
PlayAction.prototype.Play = function a() {
  const Activity = workflow.getActivityByCode(this.ActivityCode);
  if (Activity) {
    const Dancer = $(Activity.htmlObject).find('.Dancer');
    let DancerStyles;
    switch (this.ActionType) {
      case WorkflowPlaySettings.ActionType.Active:
        // 播放激活动作
        Dancer.css('background-color', WorkflowColor.Working);
        DancerStyles = { height: '100%' };
        break;
      case WorkflowPlaySettings.ActionType.Finish:
        // 播放完成动作
        Dancer.css('background-color', WorkflowColor.Finished);
        DancerStyles = { height: '100%' };
        break;
      case WorkflowPlaySettings.ActionType.Cancel:
        Dancer.css('background-color', WorkflowColor.Default);
        DancerStyles = { height: '100%' };
        break;
      case WorkflowPlaySettings.ActionType.Exception:
        Dancer.css('background-color', WorkflowColor.Exception);
        DancerStyles = { height: '100%' };
        break;
      default:
        break;
    }
    if (DancerStyles) {
      if (this === WorkflowPlayStack.Controler) {
        Dancer.animate(DancerStyles, undefined, undefined, () => {
          // 播放下一帧
          WorkflowPlaySettings.PlayNextFrame();
        });
      } else {
        Dancer.animate(DancerStyles);
      }
    }
  }
};
// 将舞者动作保存为舞台的状态,并初始化舞者
PlayAction.prototype.SaveStage = function b() {
  const Activity = workflow.getActivityByCode(this.ActivityCode);
  if (Activity) {
    switch (this.ActionType) {
      case WorkflowPlaySettings.ActionType.Active:
        $(Activity.htmlObject).find('.Stage').css('background-color', WorkflowColor.Working);
        break;
      case WorkflowPlaySettings.ActionType.Finish:
        $(Activity.htmlObject).find('.Stage').css('background-color', WorkflowColor.Finished);
        break;
      case WorkflowPlaySettings.ActionType.Cancel:
        $(Activity.htmlObject).find('.Stage').css('background-color', WorkflowColor.Default);
        break;
      case WorkflowPlaySettings.ActionType.Exception:
        $(Activity.htmlObject).find('.Stage').css('background-color', WorkflowColor.Exception);
        break;
      default:
        break;
    }
    $(Activity.htmlObject).find('.Dancer').removeAttr('style');
  }
};

