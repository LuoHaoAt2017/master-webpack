import {
  WorkflowElementType, WorkflowMode, WorkflowStyleClassName,
  WorkflowSettings, WorkflowEventStack,
} from './setting';
import { ActivityMovingStack } from './activity/setting';
import Activity from './activity/activity';
import Line from './line/line';
import { LineSettings, LineArrowDirection } from './line/setting';


/**
 * 单例对象
 */
const Workflow = function a(selector) {
  this.WorkflowElementType = WorkflowElementType.Workflow;

  // 画图空间对象
  this.workspace = undefined;
  this.ActivityInstaneDiv = undefined;

  this.NewShapeID = 1;

  // 活动绘制区域
  this.workspace_content = undefined;

  // 流程图所在的父容器
  this.outerContainer = undefined;

  // 流程图内元素可放置区域离流程图offset().left的距离
  this.minInnerPaddingOffsetLeft = 30;
  // 流程图内元素可放置区域离流程图offset().top的距离
  this.minInnerPaddingTop = 30;

  // 活动集合
  this.activities = [];

  // 线条集合
  this.lines = [];
  // 初始化
  this.init(selector);

  return this;
};

Workflow.prototype = {
  // 初始化流程图对象和行为
  init(selector) {
    // DOM对象
    this.workspace = $(selector)[0];


    // 活动绘制区域
    if ($(this.workspace).find(`.${WorkflowStyleClassName.WorkSpaceContent}`).length === 0) {
      $('<div></div>').addClass(WorkflowStyleClassName.WorkSpaceContent).appendTo(this.workspace);
    }

    this.workspace_content = $(this.workspace).children(`.${WorkflowStyleClassName.WorkSpaceContent}`);

    // 流程图所在的父容器
    this.outerContainer = $(this.workspace).parent();

    // 流程图的最小尺寸为 容器的尺寸
    WorkflowSettings.MinInnerWidth = $(this.outerContainer).width();
    WorkflowSettings.MinInnerHeight = $(this.outerContainer).height();

    if ($(this.workspace_content).position() !== undefined) {
      // 上侧
      ActivityMovingStack.WorkflowContentEdgeLeft =
      $(this.workspace_content).position().left;
      // + $(this.workspace_content).css('border-left-width').parsePxToFloat();
      // 左侧
      ActivityMovingStack.WorkflowContentEdgeTop =
      $(this.workspace_content).position().top;
      // + $(this.workspace_content).css('border-top-width').parsePxToFloat();
      // 最小内部右侧
      ActivityMovingStack.WorkspaceContentMinInnerRight =
      $(this.workspace_content).position().left + $(this.workspace_content).outerWidth();
      // - $(this.workspace_content).css('border-right-width').parsePxToFloat();
      // 最小内部下侧
      ActivityMovingStack.WorkspaceContentMinInnerBottom =
      $(this.workspace_content).position().top + $(this.workspace_content).outerHeight();
      // - $(this.workspace_content).css('border-bottom-width').parsePxToFloat();
    }
  },

  getNewShapeID() {
    if (!this.NewShapeID) {
      this.NewShapeID = 1;
    }

    this.NewShapeID += 1;
    return this.NewShapeID - 1;
  },


  autoFit(_triggerActivity) {
    // 流程为只读时,调整外容器
    if (GlobalWorkflowProperties.WorkflowMode === WorkflowMode.ViewOnly) {
      $(this.workspace).width('100%');
      $(this.outerContainer).width('100%');

      let height = 0; let width = 0;
      $(this.activities).each(function z() {
        if (this.right > width) { width = this.right; }
        if (this.bottom > height) { height = this.bottom; }
      });
      if ($(this.workspace).width() < width + 100) {
        $(this.workspace).width(width + 100);
        $(this.outerContainer).width(width + 100);
      }
      $(this.workspace).height(height + 100);
      $(this.outerContainer).height(height + 100);
      return;
    }
    // 流程设计模式,调整流程尺寸

    WorkflowSettings.MinInnerWidth = $(this.outerContainer).width();
    WorkflowSettings.MinInnerHeight = $(this.outerContainer).height();

    // 当前右、下边缘
    ActivityMovingStack.CurrentRightRange =
    $(this.workspace_content).position().left + $(this.workspace_content).outerWidth();
    ActivityMovingStack.CurrentBottomRange =
    $(this.workspace_content).position().top + $(this.workspace_content).outerHeight();

    if (_triggerActivity) {
      if (_triggerActivity.right > ActivityMovingStack.CurrentRightRange) {
        $(this.workspace).css('width', $(this.workspace).width() + (_triggerActivity.right - ActivityMovingStack.CurrentRightRange));
        ActivityMovingStack.CurrentRightRange = _triggerActivity.right;
      }
      if (_triggerActivity.bottom > ActivityMovingStack.CurrentBottomRange) {
        $(this.workspace).css('height', $(this.workspace).height() + (_triggerActivity.bottom - ActivityMovingStack.CurrentBottomRange));
        ActivityMovingStack.CurrentBottomRange = _triggerActivity.bottom;
      }
    } else {
      // 内边缘
      let RightEdge = 0;
      let BottomEdge = 0;

      $(this.activities).each(function x() {
        if (RightEdge < this.right) { RightEdge = this.right; }
        if (BottomEdge < this.bottom) { BottomEdge = this.bottom; }
      });
      // 外边缘
      RightEdge += $(this.workspace_content).css('right').parsePxToFloat();
      BottomEdge += $(this.workspace_content).css('bottom').parsePxToFloat();
      $(this.lines).each(function s() {
        $(this.Points).each(function k() {
          if (this.x > RightEdge) {
            RightEdge = this.x;
          }
          if (this.y > BottomEdge) {
            BottomEdge = this.y;
          }
        });
      });
      if (RightEdge > WorkflowSettings.MinInnerWidth) {
        $(this.workspace).width(RightEdge);
        $(this.workspace).parent().css('overflow-x', 'scroll');
      } else {
        $(this.workspace).width('100%');
        $(this.workspace).parent().css('overflow-x', 'visible');
      }
      if (BottomEdge > WorkflowSettings.MinInnerHeight) {
        $(this.workspace).height(BottomEdge);
        $(this.outerContainer).css('overflow-y', 'scroll');
      } else {
        $(this.workspace).height('100%');
        $(this.outerContainer).css('overflow-y', 'visible');
      }
    }
  },

  // 获取流程图节点(活动、线条)
  getWorkflowNode(Id) {
    const Activitys = $(this.activities).filter(function c() {
      return this.Id === Id;
    });
    if (Activitys.length > 0) { return Activitys[0]; }

    const Lines = $(this.lines).filter(function d() {
      return this.Id === Id;
    });
    if (Lines.length > 0) { return Lines[0]; }
    return null;
  },

  // 获取流程图里的活动
  getActivityByCode(_ActivityCode) {
    return $(this.activities).filter(function l() {
      return this.ActivityCode === _ActivityCode;
    })[0];
  },

  // 获取流程图里的线条
  getLine(Id) {
    return $(this.lines).filter(function q() {
      return this.Id === Id;
    })[0];
  },

  // 添加活动
  addActivity(selector, activityModel, id) {
    const activity = new Activity(selector, activityModel, id);
    this.activities.push(activity);
    return activity;
  },

  // 添加线条，若存在则更新
  saveLine(lineConfig) {
    let line;
    if (lineConfig) {
      line = this.getLine(lineConfig.currentLineId);
      if (line) { line.init(lineConfig); } else {
        line = new Line(lineConfig);
        this.lines.push(line);
      }
    }
  },

  saveActivityPositions(_Activities, _ActivityMoveOffset) {
    if (_ActivityMoveOffset.x === 0 && _ActivityMoveOffset.y === 0) { return; }
    $(_Activities).each(function e() {
      // 保存活动的位置信息
      this.savePosition(true);
    });
    $(this.lines).each(function f() {
      // 起始活动都移动,则平移线条
      if ($.inArray(this.startActivity, _Activities) > -1 &&
      $.inArray(this.endActivity, _Activities) > -1) {
        this.DoMove(_ActivityMoveOffset);
      } else if ($.inArray(this.startActivity, _Activities) > -1) {
      // 移动线条起点
        this.MoveStartPoint(_ActivityMoveOffset);
      } else if ($.inArray(this.endActivity, _Activities) > -1) {
      // 移动线条终点
        this.MoveEndPoint(_ActivityMoveOffset);
      }
    });
  },

  // 计算停靠的活动、点、方向
  calculateDockActivity(e) {
    let dockPosition;
    const x = e.pageX - GlobalWorkflowProperties.SVG.offset().left;
    const y = e.pageY - GlobalWorkflowProperties.SVG.offset().top;

    $(this.activities).each(function g() {
      if (x > this.left
        && x < this.left + this.width
        && y > this.top
        && y < this.top + this.height) {
        dockPosition = {
          Activity: this,
        };
        const xPercentage = (x - this.left) / this.width;
        const yPercentage = (y - this.top) / this.height;

        if (Math.min(xPercentage, 1 - xPercentage) < Math.min(yPercentage, 1 - yPercentage)) {
          dockPosition.y = y;
          if (xPercentage < 0.5) {
            dockPosition.x = this.left;
            dockPosition.DockDirection = LineArrowDirection.Left;
          } else {
            dockPosition.x = this.left + this.width;
            dockPosition.DockDirection = LineArrowDirection.Right;
          }
        } else {
          dockPosition.x = x;
          if (yPercentage < 0.5) {
            dockPosition.DockDirection = LineArrowDirection.Up;
            dockPosition.y = this.top;
          } else {
            dockPosition.DockDirection = LineArrowDirection.Down;
            dockPosition.y = this.top + this.height;
          }
        }
      }
    });
    // 边缘停靠
    if (!dockPosition) {
      $(this.activities).each(function w() {
        if (x > this.left - LineSettings.DockDistanceToEdge
          && x < this.left + this.width + LineSettings.DockDistanceToEdge
          && y > this.top - LineSettings.DockDistanceToEdge
          && y < this.top + this.height + LineSettings.DockDistanceToEdge) {
          dockPosition = {
            Activity: this,
          };
          if (x < this.left || x > this.left + this.width) {
            dockPosition.y = Math.max(this.top, Math.min(y, this.top + this.height));
            if (x < this.left) {
              dockPosition.x = this.left;
              dockPosition.DockDirection = LineArrowDirection.Left;
            } else {
              dockPosition.x = this.left + this.width;
              dockPosition.DockDirection = LineArrowDirection.Right;
            }
          } else {
            dockPosition.x = x;
            if (y < this.top) {
              dockPosition.y = this.top;
              dockPosition.DockDirection = LineArrowDirection.Up;
            } else {
              dockPosition.y = this.top + this.height;
              dockPosition.DockDirection = LineArrowDirection.Down;
            }
          }
        }
      });
    }
    // 向中点停靠
    if (dockPosition && dockPosition.Activity) {
      if (Math.abs((dockPosition.Activity.left +
        (dockPosition.Activity.width / 2)) - dockPosition.x) <=
        LineSettings.DockDisntaceToEdgeCenter) {
        dockPosition.x = dockPosition.Activity.left + (dockPosition.Activity.width / 2);
      } else if (
        Math.abs((dockPosition.Activity.top +
          (dockPosition.Activity.height / 2)) - dockPosition.y) <=
        LineSettings.DockDisntaceToEdgeCenter
      ) {
        dockPosition.y = dockPosition.Activity.top + (dockPosition.Activity.height / 2);
      }
    }

    return dockPosition;
  },

  // 标识复合操作中
  setMultiActionFlag(actionType) {
    WorkflowEventStack.CurrentMultiAction = actionType;
  },
};

export default Workflow;
