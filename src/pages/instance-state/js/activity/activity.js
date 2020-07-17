import { WorkflowElementType, WorkflowMode } from '../setting';
import { LineArrowDirection } from '../line/setting';
import {
  ActivityStyleClassName, ActivitySettings, ActivityModelStyleClassName,
  ActivityModelSettings,
} from '../activity/setting';

// 活动节点
const Activity = function Activity(selector, activityModel, Id) {
  // Id
  this.Id = Id;
  this.WorkflowElementType = WorkflowElementType.Activity;
  // 位置
  this.left = 0;
  this.top = 0;
  this.width = 0;
  this.height = 0;
  // ActivityCode
  this.ActivityCode = undefined;

  // 活动类型
  this.ActivityType = undefined;

  // DOM对象
  this.htmlObject = undefined;

  // 是否选中
  this.isSelected = false;

  // 是否正在编辑
  this.isEditing = false;
  // 大小变化处理器
  this.resizeHandler = undefined;

  // 初始化
  this.init(selector, activityModel);

  return this;
};

// 活动的方法
Activity.prototype = {
  // 保存活动位置信息
  // _SaveOnly:        只保存位置,不修改相关线条
  // resizeDirection: 被调整边所在的方向
  savePosition(_SaveOnly) {
    const oldPosition = {
      left: this.left,
      top: this.top,
    };
    const oldSize = {
      width: this.width,
      height: this.height,
    };
    const position = $(this.htmlObject).position();
    if (position) {
      // 位置是否改变
      const positionChanged = (this.left !== position.left) ||
      (this.top !== position.top) ||
      (this.width !== $(this.htmlObject).outerWidth()) ||
      (this.height !== $(this.htmlObject).outerHeight());

      this.left = position.left;
      this.top = position.top;
      this.width = $(this.htmlObject).outerWidth();
      this.height = $(this.htmlObject).outerHeight();

      this.right = this.left + this.width;
      this.bottom = this.top + this.height;

      this.center = this.left + (this.width / 2);
      this.middle = this.top + (this.height / 2);

      this.X = this.center;
      this.Y = this.middle;

      const thisActivity = this;

      // var _BackDirection = LineArrowDirection.Unspecified;
      if (positionChanged && !_SaveOnly) {
        // 判断大小是否变化
        if (this.width === oldSize.width || this.height === oldSize.height) {
          // 调整大小时
          // 背向的线条不调整

          // 正向的线条移动端点
          let RightDirection = LineArrowDirection.Unspecified;
          // 侧向的线条重绘
          let RelateDirections = LineArrowDirection.Unspecified;

          // 正向位移
          const RightOffset = {
            x: 0,
            y: 0,
          };

          // 宽度调整
          if (this.width !== oldSize.width) {
            RelateDirections = [LineArrowDirection.Up, LineArrowDirection.Down];
            if (this.left === oldPosition.left) {
              RightDirection = LineArrowDirection.Right;
              RightOffset.x = this.width - oldSize.width;
            } else {
              RightDirection = LineArrowDirection.Left;
              RightOffset.x = oldSize.width - this.width;
            }
          } else {
            RelateDirections = [LineArrowDirection.Left, LineArrowDirection.Right];
            if (this.top === oldPosition.top) {
              RightDirection = LineArrowDirection.Down;
              RightOffset.y = this.height - oldSize.height;
            } else {
              RightDirection = LineArrowDirection.Up;
              RightOffset.y = oldSize.height - this.height;
            }
          }

          // 背向
          // var _BackDirection = LineArrowDirection.Opposite(RightDirection);

          // 修改正向线段的端点
          // 重绘侧向线条
          $(GlobalWorkflowProperties.Workflow.lines).each(function a() {
            // 起\止点是否需要重设
            const startReset = (this.startActivity === thisActivity &&
              $.inArray(this.startDirection, RelateDirections) > -1);
            const endReset = (this.endActivity === thisActivity &&
              $.inArray(this.endDirection, RelateDirections) > -1);
            // 起\止点是否需要移动
            const needMoveStart = (this.startActivity === thisActivity &&
              this.startDirection === RightDirection);
            const needMoveEnd = (this.endActivity === thisActivity &&
              this.endDirection === RightDirection);
            if (startReset) {
              this.startPoint = {
                x: thisActivity.left + (this.offsetToStartActivity.x * thisActivity.width),
                y: thisActivity.top + (this.offsetToStartActivity.y * thisActivity.height),
              };
            }
            if (endReset) {
              this.endPoint = {
                x: thisActivity.left + (this.offsetToEndActivity.x * thisActivity.width),
                y: thisActivity.top + (this.offsetToEndActivity.y * thisActivity.height),
              };
            }
            if (startReset || endReset) {
              this.setPoints();
            } else if (needMoveStart && needMoveEnd) {
              this.DoMove(RightOffset);
            } else if (needMoveStart) {
              this.MoveStartPoint(RightOffset);
            } else if (needMoveEnd) {
              this.MoveEndPoint(RightOffset);
            }
          });
        } else if (oldPosition.left !== position.left || oldPosition.top !== position.top) {
          // 如果没有调整大小,判断是否有位置移动
          // 修改活动的线条的停靠点
          $(GlobalWorkflowProperties.Workflow.lines).each(function b() {
            if (this.startActivity === thisActivity) {
              this.startPoint = {
                x: thisActivity.left + (this.offsetToStartActivity.x * thisActivity.width),
                y: thisActivity.top + (this.offsetToStartActivity.y * thisActivity.height),
              };
            }
            if (this.endActivity === thisActivity) {
              this.endPoint = {
                x: thisActivity.left + (this.offsetToEndActivity.x * thisActivity.width),
                y: thisActivity.top + (this.offsetToEndActivity.y * thisActivity.height),
              };
            }
            if (this.startActivity === thisActivity || this.endActivity === thisActivity) {
              this.setPoints();
            }
          });
        }
      }
    }
  },

  // 显示箭头,
  showArrow() {
  },
  // 活动初始化
  init(selector, activityModel) {
    // 活动DOM
    this.htmlObject = $(selector)[0];

    this.FontColor = $(this.htmlObject).find(`.${ActivityStyleClassName.ActivityLabel}`).css('color');
    let fontSize = $(this.htmlObject).find(`.${ActivityStyleClassName.ActivityLabel}`).css('font-size');
    if (fontSize) {
      this.FontSize = $(this.htmlObject).find(`.${ActivityStyleClassName.ActivityLabel}`).css('font-size').parsePxToFloat();
    }

    const activityModels = $.extend({}, {}, activityModel);
    delete activityModels.htmlObject;

    // //初始化模板属性
    // $.extend(this, this, _activityModel);
    this.ActivityType = activityModels.ActivityType;
    this.ToolTipText = activityModels.ToolTipText;

    $(this.htmlObject).removeClass(ActivityModelStyleClassName.ActivityModel);

    this.DisplayName = $(this.htmlObject).find(`.${ActivityStyleClassName.ActivityLabel}`).text();

    // 如果不存在控制点则添加
    if ($(this.htmlObject).find(`.${ActivityStyleClassName.Resize}`).length === 0) {
      const resize = $(`<div class='${ActivityStyleClassName.Resize}'></div>`);
      $(this.htmlObject).append(resize.clone().addClass(ActivityStyleClassName.ResizeLeft));
      $(this.htmlObject).append(resize.clone().addClass(ActivityStyleClassName.ResizeUp));
      $(this.htmlObject).append(resize.clone().addClass(ActivityStyleClassName.ResizeRight));
      $(this.htmlObject).append(resize.clone().addClass(ActivityStyleClassName.ResizeDown));
    }

    // 在DOM对象里保存当前活动信息
    // $(this.htmlObject).data(ActivitySettings.ActivityDataProperty, this);

    // Id
    if (!this.Id) {
      this.Id = GlobalWorkflowProperties.Workflow.getNewShapeID();
    }

    // ActivityCode
    if (!this.ActivityCode) {
      this.ActivityCode = `Activity${this.Id}`;
    }

    if (!$(this.htmlObject).hasClass(ActivityStyleClassName.Activity)) {
      $(this.htmlObject).addClass(ActivityStyleClassName.Activity);
    }
    // 保存位置信息
    this.savePosition(true);

    $(this.htmlObject).data(ActivitySettings.ActivityDataProperty, this);

    // 初始化行为  --隐藏双击编辑文本事件
    if (GlobalWorkflowProperties.WorkflowMode === WorkflowMode.Designer) {
      $(this.htmlObject).find(`.${ActivityStyleClassName.ActivityContent}`).css('cursor', 'move');
    }
    return this;
  },

  // 从模板初始化属性
  getPropertyFromModel() {
    if (!this.ActivityType || !ActivityModelSettings.ActivityModels) {
      return;
    }
    const Activitys = this;
    const ToolTipText = this.ToolTipText;
    const ActivityModel = ActivityModelSettings.GetActivityModelByTypeName(ToolTipText);
    if (ActivityModel) {
      // 找到模板
      const ModelProperties = $(ActivitySettings.ModelableProperties).filter(function d() {
        return this.ToolTipText === ToolTipText;
      });

      if (ModelProperties && ModelProperties.length > 0) {
        // 通用属性
        $(ActivitySettings.CommonProperties).each(function e() {
          if (typeof (ActivityModel[this]) === 'object') {
            // 对象类型属性需要深度复制
            // ERROR: 维护时需特别注意,object类型属性更改时,需使用新的object保存
          }
          Activitys[this] = ActivityModel[this];
        });
        // 特定属性
        $(ModelProperties[0].Properties).each(function f() {
          // 对象类型属性需要深度复制
          if (typeof (ActivityModel[this]) === 'object' &&
            this.toString() === 'PermittedActions') {
            Activitys[this] = {};
            if (typeof (Activitys[this]) !== 'undefined') {
              for (const p in ActivityModel[this]) {
                //
                if (typeof (ActivityModel.PermittedActions[p]) !== 'object') {
                  Activitys.PermittedActions[p] = ActivityModel.PermittedActions[p];
                }
              }
            }
          } else {
            Activitys[this] = ActivityModel[this];
          }
        });

        // 自定义数据权限
        // var _DataItems = PackageManager.GetDataItems();
        // $(WorkflowProperties[ToolTipText]).each(function () {
        //     if (this.Group === 'DataItem') {
        //         Activitys['PropertyPermissions'] = [];
        //         $(_DataItems).each(function () {
        //             Activitys['PropertyPermissions'].push({
        //                 ItemName: this.Value,
        //                 Visible: true,
        //                 MobileVisible: true
        //             });
        //         });
        //     }
        // });

        // 自定义代码
        this.initCustomCode();
        this.SetFontSize();
        this.SetFontColor();
      }
    }
  },

  initCustomCode() {
    const ActivityModel = ActivityModelSettings.GetActivityModelByType(this.ActivityType);
    // 自定义代码
    if (ActivityModel) {
      if (ActivityModel.CustomCode) {
        this.CustomCode = ActivityModel.CustomCode.replace(/{ClassName}/g, `Activity${this.Id}`);
      } else {
        this.CustomCode = '';
      }
    }
  },


  SetText() {
    $(this.htmlObject).find(`.${ActivityStyleClassName.ActivityLabel}`).text(this.DisplayName);
  },

  GetFontColor() {
    if (!this.FontColor) {
      this.FontColor = ActivitySettings.DefaultFontColor;
    }
    return this.FontColor;
  },
  SetFontColor() {
    // var _div = $('<div></div>');
    // if (!this.FontColor){
    //     this.FontColor = ActivitySettings.DefaultFontColor;
    // }
    // _div.css('color', this.FontColor);
    // this.FontColor = _div.css('color');

  },

  GetFontSize() {
    let FontSize = parseInt($(this.htmlObject).find(`.${ActivityStyleClassName.ActivityLabel}`).css('font-size').replace('px', ''), 10);
    if (Number.isNaN(Number(FontSize))) {
      FontSize = ActivitySettings.DefaultFontSize;
    }
    this.FontSize = FontSize;
    return FontSize;
  },

  SetFontSize() {
    if (Number.isNaN(Number(this.FontSize)) || parseInt(this.FontSize, 10) <= 0) {
      this.FontSize = ActivitySettings.DefaultFontSize;
    }
    $(this.htmlObject).find(`.${ActivityStyleClassName.ActivityLabel}`).css('font-size', `${this.FontSize}px`);

    const FinialSize = $(this.htmlObject).find(`.${ActivityStyleClassName.ActivityLabel}`).css('font-size');

    if (FinialSize) {
      this.FontSize = parseInt(FinialSize.replace(/px/, ''), 10);
    }
  },


  redrawLines() {
    // 获取当前操纵的活动对象
    const thisActivity = this;
    if (thisActivity) {
      $(GlobalWorkflowProperties.Workflow.lines).each(function b() {
        if (this.startActivity === thisActivity || this.endActivity === thisActivity) {
          this.calculateCrossPoints();
        }
      });

      $(GlobalWorkflowProperties.Workflow.lines).each(function c() {
        if (this.needRedraw) { this.draw(true); }
      });
    }
  },

};

export default Activity;
