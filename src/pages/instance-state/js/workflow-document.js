
import { WorkflowDocumentStack, TokenState, WorkItemState, InstanceState, WorkflowStyleClassName } from './setting';
import { ActivityModelSettings, ActivitySettings } from './activity/setting';
import { LineArrowDirection } from './line/setting';
import Line from './line/line';
import { WorkflowPlayStack } from './workflow-play';


const WorkflowDocument = {
  // _PlayAble:允许播放
  // _RemoveLeftSpace:移除左上侧空白
  LoadWorkflow(_Content, _PlayAble, _RemoveLeftTopSpace) {
    if (!_Content) {
      return;
    }
    const workflow = GlobalWorkflowProperties.Workflow;
    // 左侧保留的最小空白宽度
    const MinLeftSpace = 45;
    // 上侧保留的最小空白宽度
    const MinTopSpace = 45;

    // 从后台获取的流程模板对象
    WorkflowDocumentStack.Workflow = {};
    $.extend(WorkflowDocumentStack.Workflow, WorkflowDocumentStack.Workflow, _Content);
    // 时间类型不能读取后保存
    delete WorkflowDocumentStack.Workflow.ModifiedTime;
    delete WorkflowDocumentStack.Workflow.CreatedTime;
    // 去除活动\线条
    delete WorkflowDocumentStack.Workflow.Activities;
    delete WorkflowDocumentStack.Workflow.Rules;
    delete WorkflowDocumentStack.Workflow.StartActivity;

    // 获取流程图属性
    for (const Property in _Content) {
      if (Property !== 'Activities' && Property !== 'Rules') { workflow[Property] = _Content[Property]; }
    }

    // 移除左上空白
    if (_RemoveLeftTopSpace) {
      let LeftSpace = Number.POSITIVE_INFINITY;
      let TopSpace = Number.POSITIVE_INFINITY;
      $(_Content.Activities).each(function a() {
        LeftSpace = Math.min(this.X - (this.Width / 2), LeftSpace);
        TopSpace = Math.min(this.Y - (this.Height / 2), TopSpace);
      });
      $(_Content.Rules).each(function b() {
        $(this.Points).each(function c() {
          const x = parseInt(this.split(',')[0], 10);
          const y = parseInt(this.split(',')[1], 10);
          LeftSpace = Math.min(x, LeftSpace);
          TopSpace = Math.min(y, TopSpace);
        });
      });

      // 是否左移
      const moveLeft = LeftSpace !== Number.POSITIVE_INFINITY && LeftSpace > MinLeftSpace;
      // 是否上移
      const moveTop = TopSpace !== Number.POSITIVE_INFINITY && TopSpace > MinTopSpace;
      if (moveLeft || moveTop) {
        if (moveLeft) {
          LeftSpace -= MinLeftSpace;
        }
        if (moveTop) {
          TopSpace -= MinTopSpace;
        }
        $(_Content.Activities).each(function rr() {
          if (moveLeft) {
            this.X -= LeftSpace;
          }
          if (moveTop) {
            this.Y -= TopSpace;
          }
        });
        $(_Content.Rules).each(function d() {
          for (let i = 0; i < this.Points.length; i += 1) {
            let x = parseInt(this.Points[i].split(',')[0], 10);
            let y = parseInt(this.Points[i].split(',')[1], 10);
            if (moveLeft) {
              x -= LeftSpace;
            }
            if (moveTop) {
              y -= TopSpace;
            }
            this.Points[i] = `${x},${y}`;
          }
        });
      }
    }

    // 绘制活动
    $(_Content.Activities).each(function e() {
      // 活动模板
      const modelHtml = ActivityModelSettings.GetActivityModelByType(this.ActivityType).htmlObject;
      const selector = $(modelHtml)
        .clone()
        .appendTo(GlobalWorkflowProperties.Workflow.workspace).show()
        .css('left', this.X - (this.Width / 2))
        .css('top', this.Y - (this.Height / 2));
      // 绘制图形
      const activity = GlobalWorkflowProperties.Workflow.addActivity(
        selector,
        ActivityModelSettings.GetActivityModelByType(this.ActivityType), this.ObjectId,
      );
      // 高
      if (this.Height) {
        $(activity.htmlObject).outerHeight(this.Height < ActivitySettings.MinOuterHeight ?
          this.Height < ActivitySettings.MinOuterHeight : this.Height);
      }
      // 宽
      if (this.Width) {
        $(activity.htmlObject).width(this.Width);
      }

      // 文字
      activity.DisplayName = this.DisplayName;

      activity.SetText();
      // 颜色
      activity.FontColor = this.FontColor;
      activity.SetFontColor();
      // 文字大小
      activity.FontSize = this.FontSize;
      activity.SetFontSize();

      // 位置
      activity.savePosition();

      // 获取属性
      $.extend(activity, activity, this);
    });

    const getDirection = function f(_xOffset, _yOffset, _activity) {
      if (Math.abs(_xOffset - 0) <= 2) {
        return LineArrowDirection.Left;
      } else if (Math.abs(_yOffset - 0) <= 2) {
        return LineArrowDirection.Up;
      } else if (Math.abs(_xOffset - _activity.width) <= 2) {
        return LineArrowDirection.Right;
      }
      return LineArrowDirection.Down;
    };
    // 绘制线条
    $(_Content.Rules).each(function g() {
      const StartActivity =
      GlobalWorkflowProperties.Workflow.getActivityByCode(this.PreActivityCode);
      const EndActivity =
      GlobalWorkflowProperties.Workflow.getActivityByCode(this.PostActivityCode);
      if (StartActivity && EndActivity) {
        const StartPoint = {
          x: parseInt(this.Points[0].split(',')[0], 10),
          y: parseInt(this.Points[0].split(',')[1], 10),
        };
        // 第二点
        const SecondPoint = {
          x: parseInt(this.Points[1].split(',')[0], 10),
          y: parseInt(this.Points[1].split(',')[1], 10),
        };
        // 倒数第二点
        const PenultimatePoint = {
          x: parseInt(this.Points[this.Points.length - 2].split(',')[0], 10),
          y: parseInt(this.Points[this.Points.length - 2].split(',')[1], 10),
        };
        const EndPoint = {
          x: parseInt(this.Points[this.Points.length - 1].split(',')[0], 10),
          y: parseInt(this.Points[this.Points.length - 1].split(',')[1], 10),
        };

        // let StartDirection = LineArrowDirection.Unspecified;
        // let EndDirection = LineArrowDirection.Unspecified;

        // 用第二个点判断起始方向
        if (SecondPoint.x > StartActivity.left && SecondPoint.x < StartActivity.right) {
          if (SecondPoint.y < StartActivity.top) {
            // StartDirection = LineArrowDirection.Up;
            StartPoint.y = StartActivity.top;
          } else {
            // StartDirection = LineArrowDirection.Down;
            StartPoint.y = StartActivity.bottom;
          }
        } else if (SecondPoint.y > StartActivity.top && SecondPoint.y < StartActivity.bottom) {
          if (SecondPoint.x < StartActivity.left) {
            // StartDirection = LineArrowDirection.Left;
            StartPoint.x = StartActivity.left;
          } else {
            // StartDirection = LineArrowDirection.Right;
            StartPoint.x = StartActivity.right;
          }
        } else {
          // StartDirection = getDirection(
          //   StartPoint.x - StartActivity.left,
          //   StartPoint.y - StartActivity.top, StartActivity,
          // );
        }

        // 用倒数第二个点判断结束方向
        if (PenultimatePoint.x > EndActivity.left && PenultimatePoint.x < EndActivity.right) {
          if (PenultimatePoint.y < EndActivity.top) {
            // EndDirection = LineArrowDirection.Up;
            EndPoint.y = EndActivity.top;
          } else {
            // EndDirection = LineArrowDirection.Down;
            EndPoint.y = EndActivity.bottom;
          }
        } else if (PenultimatePoint.y > EndActivity.top &&
          PenultimatePoint.y < EndActivity.bottom) {
          if (PenultimatePoint.x < EndActivity.left) {
            // EndDirection = LineArrowDirection.Left;
            EndPoint.x = EndActivity.left;
          } else {
            // EndDirection = LineArrowDirection.Right;
            EndPoint.x = EndActivity.right;
          }
        } else {
          // EndDirection = getDirection(
          //   EndPoint.x - EndActivity.left,
          //   EndPoint.y - EndActivity.top, EndActivity,
          // );
        }

        const line = new Line({
          Id: this.ObjectId,

          startActivity: StartActivity,
          startPoint: StartPoint,
          startDirection: getDirection(
            StartPoint.x - StartActivity.left,
            StartPoint.y - StartActivity.top, StartActivity,
          ),

          endActivity: EndActivity,
          endPoint: EndPoint,
          endDirection: getDirection(
            EndPoint.x - EndActivity.left,
            EndPoint.y - EndActivity.top, EndActivity,
          ),
        });

        line.Points = [];
        const PointCount = this.Points.length;
        $(this.Points).each(function h(index) {
          if (index === 0) {
            line.Points.push(StartPoint);
          } else if (index === PointCount - 1) {
            line.Points.push(EndPoint);
          } else if (index === 1) {
            line.Points.push(SecondPoint);
          } else if (index === PointCount - 2) {
            line.Points.push(PenultimatePoint);
          } else {
            line.Points.push({
              x: parseInt(this.split(',')[0], 10),
              y: parseInt(this.split(',')[1], 10),
            });
          }
        });

        if (this.Points.length === 0) { this.setPoints(); }

        GlobalWorkflowProperties.Workflow.lines.push(line);

        //
        delete this.Points;
        $.extend(line, line, this);
      }
    });

    // 如果使用SVG,才计算交叉点
    if (GlobalWorkflowProperties.Workflow.UtilizeSvg) {
      $(GlobalWorkflowProperties.Workflow.lines).each(function i() {
        this.calculateCrossPoints();
      });
    }
    $(GlobalWorkflowProperties.Workflow.lines).each(function j() {
      this.draw(true);
      this.SetText();
      this.SetFontColor();
      this.SetFontSize();
      this.SetLineStyle();
    });

    GlobalWorkflowProperties.Workflow.autoFit();

    // 计算下一个Id
    if (!GlobalWorkflowProperties.Workflow.NewShapeID) {
      GlobalWorkflowProperties.Workflow.NewShapeID = 1;
    }
    $(GlobalWorkflowProperties.Workflow.activities).each(function k() {
      if (!Number.isNaN(Number(this.Id)) && this.Id >=
      GlobalWorkflowProperties.Workflow.NewShapeID) {
        GlobalWorkflowProperties.Workflow.NewShapeID = this.Id + 1;
      }
    });

    $(GlobalWorkflowProperties.Workflow.lines).each(function l() {
      if (!Number.isNaN(Number(this.Id)) && this.Id >=
      GlobalWorkflowProperties.Workflow.NewShapeID) {
        GlobalWorkflowProperties.Workflow.NewShapeID = this.Id + 1;
      }
    });
    const WorkflowInstance = GlobalWorkflowProperties.WorkflowInstance;
    const WorkItems = GlobalWorkflowProperties.WorkItems;
    // 显示流程状态
    if (typeof (WorkflowInstance) !== 'undefined' && WorkflowInstance) {
      // 流程有异常
      let InstanceExceptional = false;
      if (typeof (UnfixedExceptionLogs) !== 'undefined' && window.UnfixedExceptionLogs.length > 0) {
        InstanceExceptional = true;
      }
      for (const activity of GlobalWorkflowProperties.Workflow.activities) {
        if (activity.ToolTipText === 'Start') {
          WorkflowPlayStack.StartActivityCode = activity.ActivityCode;
          break;
        }
      }

      if (WorkflowPlayStack.StartActivityCode) {
        // 插入开始Token
        WorkflowInstance.Tokens.splice(0, 0, {
          Activity: WorkflowPlayStack.StartActivityCode,
          CreatedTime: WorkflowInstance.CreatedTime,
          FinishedTime: WorkflowInstance.CreatedTime,
          State: TokenState.Finished,
          TokenId: -1,
        });
      }

      $(WorkflowInstance.Tokens).each(function m() {
        // 从WorkItems修正Token的StartTime、FinishTime、CancelTime、State
        if (typeof (WorkItems) !== 'undefined') {
          const thisToken = this;
          this.WorkItems = $(WorkItems).filter(function n() {
            return this.TokenId === thisToken.TokenId;
          });
          if (this.WorkItems.length > 0) {
            // 如果当前Token的状态是Running(0),判断是否有未完成的任务,若有,返回;
            // 若无,取最后一个FinishTime\CancelTime为Token的FinishTime\CancelTime,并修改State为Finished\Canceled
            if (this.State === TokenState.Running) {
              let ExistUnfinished = false;
              let ExistFinished = false;
              let LastFinishTime;
              let LastCancelTime;
              $(this.WorkItems).each(function o() {
                if (this.State === WorkItemState.Waiting || this.State === WorkItemState.Working) {
                  ExistUnfinished = true;
                } else if (this.State === WorkItemState.Finished) {
                  ExistFinished = true;
                  if (!LastFinishTime || LastFinishTime < this.FinishTime) {
                    LastFinishTime = this.FinishTime;
                  }
                } else if (this.State === WorkItemState.Canceled) {
                  if (!LastCancelTime || LastCancelTime < this.CancelTime) {
                    LastCancelTime = this.CancelTime;
                  }
                }
              });
              // 如果不存在未完成的
              if (!ExistUnfinished) {
                // 存在已完成的
                if (ExistFinished) {
                  thisToken.State = TokenState.Finished;
                  thisToken.FinishedTime = LastFinishTime;
                } else {
                // 不存在已完成的
                  thisToken.State = TokenState.Dropped;
                  thisToken.CanceledTime = LastCancelTime;
                }
              }
            } else if (this.State === TokenState.Dropped) {
            // 如果当前Token的状态是Dropped,取最后一个CancelTime为Token的CancelTime
              this.CanceledTime = undefined;
              $(this.WorkItems).each(function aa() {
                if (this.State === WorkItemState.Canceled &&
                  (!thisToken.CanceledTime || thisToken.CanceledTime < this.CancelTime)) {
                  thisToken.CanceledTime = this.CancelTime;
                }
              });
            }
          }
        }
      });

      $(GlobalWorkflowProperties.Workflow.activities).each(function bb() {
        const thisActivity = this;

        let ExistUnfinished = false;
        let ExistFinished = false;
        let Exceptional = false;

        // 出现过异常
        if (typeof (ExceptionActivities) !== 'undefined' && $(window.ExceptionActivities).filter(function dd() {
          return this.toString() === thisActivity.ActivityCode;
        }).length > 0) {
          Exceptional = true;
          window.ExceptionActivityCode = thisActivity.ActivityCode;
        } else {
          $(WorkflowInstance.Tokens).each(function cc() {
            if (this.Activity === thisActivity.ActivityCode) {
              // 只有流程在进行中才显示进行中的任务
              if (!InstanceExceptional && WorkflowInstance.State === InstanceState.Running &&
                this.State === TokenState.Running) {
                ExistUnfinished = true;
              } else if (this.State === TokenState.Finished) {
              // 已完成
                ExistFinished = true;
              }
            }
          });
        }
        // ERROR:异常已修复\未修复未显示
        // TODO: 异常已修复\未修复显示
        if (Exceptional) {
          $(this.htmlObject).addClass('ActivityException');
        } else if (ExistUnfinished) {
          $(this.htmlObject).addClass('ActivityWorking');
        } else if (ExistFinished) {
          $(this.htmlObject).addClass('ActivityFinished');
        }
      });
    }
  },

  ClearWorkflowContent() {
    $(GlobalWorkflowProperties.Workflow.activities).each(function ee() {
      $(this.htmlObject).remove();
    });

    $(GlobalWorkflowProperties.Workflow.lines).each(function ff() {
      $(this.Path).remove();
      $(this.Arrow).remove();
      this.Unselect();
    });

    $(`.${WorkflowStyleClassName.WorkflowAotuArrow}`).hide();
    GlobalWorkflowProperties.Workflow.activities = [];
    GlobalWorkflowProperties.Workflow.lines = [];
    GlobalWorkflowProperties.Workflow.selectedActivities = [];

    // WorkflowDocument.ShowDealResult(_WorkflowDesigner_GlobalString.WorkflowDocument_Empty);
  },
};

export default WorkflowDocument;
