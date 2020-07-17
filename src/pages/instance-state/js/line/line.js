import { LineStyleClassName, LineArrowDirection, LineSettings } from '../line/setting';
import { WorkflowElementType, WorkflowMode } from '../setting';
// 线条类定义
const Line = function Line(lineConfig) {
  // Id
  this.Id = undefined;
  this.WorkflowElementType = WorkflowElementType.Line;
  // 起点活动
  this.startActivity = undefined;
  // 终点活动
  this.endActivity = undefined;

  // 位于起点活动的边的方向
  this.startDirection = LineArrowDirection.Unspecified;
  // 位于终点活动的边的方向
  this.endDirection = LineArrowDirection.Unspecified;

  // 起点相对于开始活动的偏移
  this.offsetToStartActivity = { x: 0, y: 0 };
  // 终点相对于结束活动的偏移
  this.offsetToEndActivity = { x: 0, y: 0 };

  // 折线点集，不包含箭头
  this.Points = [];

  // 起点
  this.startPoint = { x: 0, y: 0 };
  // 结束节点
  this.endPoint = { x: 0, y: 0 };

  // 箭头html对象
  // this.Arrow;
  // 路径html对象
  // this.Path;
  // 文字
  // this.Label;

  // 初始化
  this.init(lineConfig);

  this.isSelected = false;

  this.crossPoints = [];

  this.needRedraw = false;

  return this;
};

Line.prototype = {
  // 设置点
  // _ResetStartAndEnd:是否重设起止点
  setPoints(_ResetStartAndEnd) {
    this.needRedraw = true;
    // 重设文字位置
    this.TextX = 0;
    this.TextY = 0;
    this.FixedPoint = false;
    if (_ResetStartAndEnd) {
      if (this.startActivity) {
        this.startPoint = {
          x: this.startActivity.left + (this.offsetToStartActivity.x * this.startActivity.width),
          y: this.startActivity.top + (this.offsetToStartActivity.y * this.startActivity.height),
        };
      }
      if (this.endActivity) {
        this.endPoint = {
          x: this.endActivity.left + (this.offsetToEndActivity.x * this.endActivity.width),
          y: this.endActivity.top + (this.offsetToEndActivity.y * this.endActivity.height),
        };
      }
    }

    if (this.startDirection === LineArrowDirection.Unspecified &&
      this.endDirection === LineArrowDirection.Unspecified) { return; }

    const getEndDirection = function getEndDirection(_startPoint, _startDirection, _endPoint) {
      const originX = _startPoint.x;
      const originY = _startPoint.y;
      const targetX = _endPoint.x;
      const targetY = _endPoint.y;
      let endDirection = LineArrowDirection.Unspecified;
      switch (_startDirection) {
        case LineArrowDirection.Up:
          if (targetY < originY - LineSettings.MinSegementLength) {
            endDirection = LineArrowDirection.Down;
          } else {
            endDirection = LineArrowDirection.Up;
          }
          break;
        case LineArrowDirection.Down:
          if (targetY > originY + LineSettings.MinSegementLength) {
            endDirection = LineArrowDirection.Up;
          } else {
            endDirection = LineArrowDirection.Down;
          }
          break;
        case LineArrowDirection.Left:
          if (targetX < originX - LineSettings.MinSegementLength) {
            endDirection = LineArrowDirection.Right;
          } else {
            endDirection = LineArrowDirection.Left;
          }
          break;
        case LineArrowDirection.Right:
          if (targetX > originX + LineSettings.MinSegementLength) {
            endDirection = LineArrowDirection.Left;
          } else {
            endDirection = LineArrowDirection.Right;
          }
          break;
        default:
          break;
      }
      return endDirection;
    };

    if (this.endDirection === LineArrowDirection.Unspecified) {
      this.endDirection = getEndDirection(this.startPoint, this.startDirection, this.endPoint);
    } else if (this.startDirection === LineArrowDirection.Unspecified) {
      this.startDirection = getEndDirection(this.endPoint, this.endDirection, this.startPoint);
    }

    // 更新线条相对于活动边的位置信息
    this.setOffsetToActivity();

    // 计算所有点
    this.Points = LineSettings.RecalculatePoints(
      this.startDirection,
      this.endDirection, this.startPoint, this.endPoint,
    );
  },


  // 设置聚焦样式
  SetFocusStyle() {
    GlobalWorkflowProperties.Workflow.FocusLine = this;
    if (this.Path) {
      this.Path.attr('stroke', LineSettings.LineFocusColor).attr('stroke-width', LineSettings.LineFocusWidth);
      this.Arrow.attr('fill', LineSettings.ArrowFocusColor).attr('stroke', LineSettings.LineFocusColor);
    }
  },

  // 设置失去焦点样式
  SetBlurStyle() {
    GlobalWorkflowProperties.Workflow.FocusLine = undefined;
    GlobalWorkflowProperties.Workflow.SelectLine = undefined;

    if (this.Path) {
      this.Path.attr('stroke', LineSettings.LineColor).attr('stroke-width', LineSettings.LineWidth);
      this.Arrow.attr('fill', LineSettings.ArrowFillColor).attr('stroke', LineSettings.LineColor);
    }
  },

  // 绘制
  // 是否绘制交叉点
  draw(drawCrossPoints) {
    // 如果点已设置,判断点是否在线上,否则重定位
    if (this.TextX || this.TextY) {
      let isOn = false;
      for (let i = 0; i < this.Points.length - 1; i += 1) {
        // 水平线
        if (this.Points[i].y === this.Points[i + 1].y) {
          if (this.TextY === this.Points[i].y &&
            this.TextX >= Math.min(this.Points[i].x, this.Points[i + 1].x) &&
            this.TextX <= Math.max(this.Points[i].x, this.Points[i + 1].x)) {
            isOn = true;
            break;
          }
        } else if (this.TextX === this.Points[i].x &&
          this.TextY >= Math.min(this.Points[i].y, this.Points[i + 1].y) &&
          this.TextY <= Math.max(this.Points[i].y, this.Points[i + 1].y)) {
        // 竖直线
          isOn = true;
          break;
        }
      }
      if (!isOn) {
        this.TextX = 0;
        this.TextY = 0;
        this.SetText();
      }
    }

    if (drawCrossPoints) { this.needRedraw = false; }
    const thisLine = this;
    if (!this.Points || this.Points.length === 0) { return; }

    // 使用SVG绘线
    if (GlobalWorkflowProperties.Workflow.UtilizeSvg) {
      let pathDefine;
      // 结束于箭尾的点集合
      const PointsEndWithArrowTailPoint = this.Points.slice();
      // 当两个交叉点的距离小于拱形半径的两倍时，将其合并为一个交叉点绘制
      const joinToCrossOffsetX = function joinToCrossOffsetX(_crossOffsetXss, _newOffsetX) {
        // 是否已加入
        const crossOffsetXs = _crossOffsetXss;
        let inserted = false;
        if (crossOffsetXs && crossOffsetXs.length > 0) {
          for (let crossIndex = 0; crossIndex < crossOffsetXs.length; crossIndex += 1) {
            if (_newOffsetX + LineSettings.CrossRadius < crossOffsetXs[crossIndex].start) {
              crossOffsetXs.splice(
                crossIndex, 0,
                {
                  start: _newOffsetX - LineSettings.CrossRadius,
                  end: _newOffsetX + LineSettings.CrossRadius,
                },
              );
              inserted = true;
              break;
            } else if (
              _newOffsetX >= crossOffsetXs[crossIndex].start - LineSettings.CrossRadius &&
              _newOffsetX <= crossOffsetXs[crossIndex].end + LineSettings.CrossRadius) {
            // 如果可以合入当前范围
              crossOffsetXs[crossIndex].start =
              Math.min(crossOffsetXs[crossIndex].start, _newOffsetX - LineSettings.CrossRadius);
              crossOffsetXs[crossIndex].end =
              Math.max(crossOffsetXs[crossIndex].end, _newOffsetX + LineSettings.CrossRadius);

              // 判断合入下一个范围
              if (crossIndex < crossOffsetXs.length - 1 &&
                crossOffsetXs[crossIndex].end >= crossOffsetXs[crossIndex + 1].start) {
                crossOffsetXs[crossIndex].end = crossOffsetXs[crossIndex + 1].end;
                crossOffsetXs.splice(crossIndex + 1, 1);
              }

              inserted = true;
              break;
            }
          }
        }
        if (!inserted) {
          crossOffsetXs.push({
            start: _newOffsetX - LineSettings.CrossRadius,
            end: _newOffsetX + LineSettings.CrossRadius,
          });
        }
        return crossOffsetXs;
      };

      // 最后一点修正为箭尾
      if (PointsEndWithArrowTailPoint.length > 0) {
        PointsEndWithArrowTailPoint[PointsEndWithArrowTailPoint.length - 1] =
        LineSettings.GetArrowTailPoint(thisLine.endPoint, thisLine.endDirection);
      }

      // 画线
      $(PointsEndWithArrowTailPoint).each(function b(index) {
        if (index === 0) { pathDefine = `M${this.x},${this.y} `; }
        if (index < PointsEndWithArrowTailPoint.length - 1) {
          const thisPoint = PointsEndWithArrowTailPoint[index];
          const next = PointsEndWithArrowTailPoint[index + 1];
          // 绘制交点
          if (drawCrossPoints
            // 水平线
            && thisPoint.y === next.y
            && Math.abs(thisPoint.x - next.x) >=
            (LineSettings.CornerRadius * 2) + (LineSettings.CrossRadius * 2)) {
            const crossOffsetXs = [];
            $(thisLine.crossPoints).each(function c() {
              if (this.y === thisPoint.y
                && this.x > Math.min(thisPoint.x, next.x) +
                LineSettings.CornerRadius + LineSettings.CrossRadius
                && this.x < Math.max(thisPoint.x, next.x) -
                LineSettings.CornerRadius - LineSettings.CrossRadius) {
                joinToCrossOffsetX(crossOffsetXs, this.x);
              }
            });

            if (crossOffsetXs && crossOffsetXs.length > 0) {
              if (this.x < next.x) {
                // 添加拱点
                for (let crossIndex = 0; crossIndex < crossOffsetXs.length; crossIndex += 1) {
                  pathDefine += ` H ${crossOffsetXs[crossIndex].start} a${LineSettings.CrossRadius} ${LineSettings.CrossRadius} 0 0 1 ${LineSettings.CrossRadius} -${LineSettings.CrossRadius} H${crossOffsetXs[crossIndex].end - LineSettings.CrossRadius} a${LineSettings.CrossRadius} ${LineSettings.CrossRadius} 0 0 1 ${LineSettings.CrossRadius} ${LineSettings.CrossRadius} `;
                }
              } else {
                // 添加拱点
                for (let crossIndex = crossOffsetXs.length - 1; crossIndex >= 0; crossIndex -= 1) {
                  pathDefine += ` H ${crossOffsetXs[crossIndex].end} a${LineSettings.CrossRadius} ${LineSettings.CrossRadius} 0 0 0 -${LineSettings.CrossRadius} -${LineSettings.CrossRadius} H${crossOffsetXs[crossIndex].start + LineSettings.CrossRadius} a${LineSettings.CrossRadius} ${LineSettings.CrossRadius} 0 0 0 -${LineSettings.CrossRadius} ${LineSettings.CrossRadius} `;
                }
              }
            }
          }

          // 绘制到当前线的终点
          if (index === PointsEndWithArrowTailPoint.length - 2) { pathDefine += `L ${next.x} ${next.y} `; } else {
            // 更下一个点
            const nexter = PointsEndWithArrowTailPoint[index + 2];
            if (Math.abs(thisPoint.x - next.x) + Math.abs(thisPoint.y - next.y) >
            LineSettings.CornerRadius * 2
              && Math.abs(next.x - nexter.x) + Math.abs(next.y - nexter.y) >
              LineSettings.CornerRadius * 2
              && (nexter.x - this.x !== 0 && nexter.y - this.y !== 0)) {
              const x = (LineSettings.CornerRadius * (nexter.x - this.x)) /
              Math.abs(nexter.x - this.x);
              const y = (LineSettings.CornerRadius * (nexter.y - this.y)) /
              Math.abs(nexter.y - this.y);

              // 圆弧方向，默认为逆时针
              let sweepFlag = 0;
              if ((thisPoint.x > nexter.x && thisPoint.x === next.x && thisPoint.y < nexter.y)
                || (thisPoint.x > nexter.x && thisPoint.y === next.y && thisPoint.y > nexter.y)
                || (thisPoint.x < nexter.x && thisPoint.x === next.x && thisPoint.y > nexter.y)
                || (thisPoint.x < nexter.x && thisPoint.y === next.y && thisPoint.y < nexter.y)) {
                sweepFlag = 1;
              }
              if (thisPoint.x === next.x) {
                pathDefine += `L${thisPoint.x} ${next.y - y} `;
              } else {
                pathDefine += `L${next.x - x} ${thisPoint.y} `;
              }
              pathDefine += `a${LineSettings.CornerRadius} ${LineSettings.CornerRadius} 0 0 ${sweepFlag} ${x} ${y} `;
            } else {
              pathDefine += `L ${next.x} ${next.y} `;
            }
          }
        }
      });

      if (pathDefine) {
        if (!this.Path) {
          this.Path = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'))
            .attr('fill', 'white').attr('fill-opacity', '0')
            .attr('stroke', LineSettings.LineColor)
            .attr('stroke-width', LineSettings.LineWidth)
            .appendTo(GlobalWorkflowProperties.SVG);
        }

        this.Path.attr('d', pathDefine);
      }

      // 绘制箭头
      const getArrowPoints = function d(_point, _direction) {
        let points = `${_point.x},${_point.y} `;
        switch (_direction) {
          case LineArrowDirection.Left:
            points += `${_point.x - LineSettings.ArrowLength},${_point.y - LineSettings.ArrowWidth} ${_point.x - LineSettings.ArrowLength},${_point.y + LineSettings.ArrowWidth}`;
            break;
          case LineArrowDirection.Down:
            points += `${_point.x - LineSettings.ArrowWidth},${_point.y + LineSettings.ArrowLength} ${_point.x + LineSettings.ArrowWidth},${_point.y + LineSettings.ArrowLength}`;
            break;
          case LineArrowDirection.Right:
            points += `${_point.x + LineSettings.ArrowLength},${_point.y - LineSettings.ArrowWidth} ${_point.x + LineSettings.ArrowLength},${_point.y + LineSettings.ArrowWidth}`;
            break;
          case LineArrowDirection.Up:
            points += `${_point.x - LineSettings.ArrowWidth},${_point.y - LineSettings.ArrowLength} ${_point.x + LineSettings.ArrowWidth},${_point.y - LineSettings.ArrowLength}`;
            break;
          default:
            break;
        }
        return points;
      };
      if (!this.Arrow) {
        this.Arrow = $(document.createElementNS('http://www.w3.org/2000/svg', 'polygon')).attr('fill-opacity', '1')
          .attr('fill', LineSettings.ArrowFillColor)
          .attr('stroke', LineSettings.LineColor)
          .attr('stroke-width', LineSettings.LineWidth)
          .appendTo(GlobalWorkflowProperties.SVG);
      }
      this.Arrow.attr('points', getArrowPoints(this.Points[this.Points.length - 1], this.endDirection));
    } else {
      const PointsEndWithArrowTailPoint = this.Points.slice();
      // 使用DIV绘线
      // 画线的最后一点修正为箭尾
      if (PointsEndWithArrowTailPoint.length > 0) {
        PointsEndWithArrowTailPoint[PointsEndWithArrowTailPoint.length - 1] =
         LineSettings.GetArrowTailPoint(thisLine.endPoint, thisLine.endDirection);
      }

      if (this.LineDiv) { $(this.LineDiv).remove(); }
      const thisLineDiv = $('<div></div>').addClass('LineDiv').appendTo(GlobalWorkflowProperties.Workflow.workspace);
      this.LineDiv = $('<div></div>').addClass('LineDiv').appendTo(GlobalWorkflowProperties.Workflow.workspace);
      const thisPoints = this.Points;
      $(PointsEndWithArrowTailPoint).each(function e(index) {
        if (index > 0) {
          $('<div></div>').addClass('SegementDiv')
            .css('left', Math.min(this.x, thisPoints[index - 1].x))
            .css('top', Math.min(this.y, thisPoints[index - 1].y))
            .width(Math.abs(this.x - thisPoints[index - 1].x))
            .height(Math.abs(this.y - thisPoints[index - 1].y))
            .appendTo(thisLineDiv);
        }
      });
      this.LineDiv.appendTo(GlobalWorkflowProperties.Workflow.workspace);

      if (this.Arrow) { $(this.Arrow).remove(); }
      this.Arrow = $('<div></div>').addClass('LineArrow').css('left', this.Points[this.Points.length - 1].x).css('top', this.Points[this.Points.length - 1].y);
      switch (this.endDirection) {
        case LineArrowDirection.Left:
          this.Arrow.addClass('LineArrow_Left');
          break;
        case LineArrowDirection.Right:
          this.Arrow.addClass('LineArrow_Right');
          break;
        case LineArrowDirection.Up:
          this.Arrow.addClass('LineArrow_Up');
          break;
        case LineArrowDirection.Down:
          this.Arrow.addClass('LineArrow_Down');
          break;
        default:
          break;
      }
      this.Arrow.appendTo(GlobalWorkflowProperties.Workflow.workspace);
    }
    this.SetLineStyle();
    this.SetText();
  },

  SetLineStyle() {
    if (GlobalWorkflowProperties.Workflow.UtilizeSvg) {
      if (this.Formula || this.Exclusive) {
        this.Path.attr('stroke-dasharray', '5,3');
      } else {
        this.Path.removeAttr('stroke-dasharray');
      }
    } else if (this.Formula || this.Exclusive) {
      this.LineDiv.css('broder-style', 'dotted');
    } else {
      this.LineDiv.css('broder-style', 'solid');
    }
  },

  SetText() {
    if (!this.DisplayName) {
      if (this.Label) {
        this.Label.remove();
        this.Label = undefined;
      }
      return;
    }

    if (!this.Label) {
      const that = this;
      this.Label = $(`<div class='${LineStyleClassName.Label}'></div>`).attr(LineSettings.Label_LineIDPropertyName, this.Id).appendTo(GlobalWorkflowProperties.Workflow.workspace);
      this.Label.bind('mousedown', (e) => { e.preventDefault(); });
      // add by xc 双击修改
      this.Label.unbind('dblclick.ChoiseName').bind('dblclick.ChoiseName', function f(e) {
        const $that = $(this);
        const $input = $('<input type="text">').val($that.text()).attr('style', $that.attr('style')).css({
          width: $that.outerWidth(), height: $that.outerHeight(), 'z-index': 1000, position: 'absolute',
        });
        $that.after($input);
        $input.focus();

        $input.unbind('change.ChoiseName').bind('change.ChoiseName', function j() {
          that.DisplayName = this.value;
          $(this).remove();
          $that.html(that.DisplayName);
          that.SetText.call(that);
          that.doDown.call(that);
        });
        $input.unbind('mousedown').bind('mousedown.ChoiseName', (ev) => {
          ev.stopPropagation();
        });
        $input.unbind('blur.ChoiseName').bind('blur.ChoiseName', function g() {
          that.DisplayName = this.value;
          $(this).remove();
          $that.html(that.DisplayName);
          that.SetText.call(that);
          that.doDown.call(that);
          e.stopPropagation();
        });
      });
      // end
    }

    if (this.DisplayName !== this.Label.text()) { this.Label.text(this.DisplayName); }


    if (this.Points) {
      let X = this.TextX;
      let Y = this.TextY;
      if (!X && !Y) {
        // 如果没有设置文本位置,则显示到中间
        switch (this.Points.length) {
          case 2:
            X = (this.Points[0].x / 2) + (this.Points[1].x / 2);
            Y = (this.Points[0].y / 2) + (this.Points[1].y / 2);
            break;
          case 3:
            X = (this.Points[1].x / 2) + (this.Points[2].x / 2);
            Y = (this.Points[1].y / 2) + (this.Points[2].y / 2);
            break;
          case 4:
            X = (this.Points[1].x / 2) + (this.Points[2].x / 2);
            Y = (this.Points[1].y / 2) + (this.Points[2].y / 2);
            break;
          case 5:
            X = (this.Points[2].x / 2) + (this.Points[3].x / 2);
            Y = (this.Points[2].y / 2) + (this.Points[3].y / 2);
            break;
          case 6:
            X = (this.Points[2].x / 2) + (this.Points[3].x / 2);
            Y = (this.Points[2].y / 2) + (this.Points[3].y / 2);
            break;
          default:
            break;
        }
      }
      this.Label.css('left', X).css('top', Y);
      if (GlobalWorkflowProperties.WorkflowMode === WorkflowMode.Designer) {
        $(this.Label).move({
          x: -$(this.Label).outerWidth() / 2,
          y: -$(this.Label).outerHeight() / 2,
        });
      } else if (this.DisplayName) {
        const Parent = $(this.Label).parent();
        $(this.Label).css('font-size', $(this.Label).css('font-size')).appendTo($('body:first'));

        const Width = $(this.Label).outerWidth();
        const Height = $(this.Label).outerHeight();

        $(this.Label).appendTo(Parent);
        $(this.Label).css('left', X - (Width / 2)).css('top', Y - (Height / 2));
      }
    }
  },

  GetFontColor() {
    if (!this.FontColor) { this.FontColor = LineSettings.DefaultFontColor; }
    return this.FontColor;
  },

  SetFontColor() {
    // var _div = $("<div></div>");
    // if (!this.FontColor)
    //     this.FontColor = LineSettings.LineColor;
    // _div.css("color", this.FontColor);
    // this.FontColor = _div.css("color");

    if (this.Label) {
      $(this.Label).css('color', LineSettings.DefaultFontColor);
    }
  },

  GetFontSize() {
    if (!this.FontSize) {
      this.FontSize = LineSettings.DefaultFontSize;
    }
    return this.FontSize;
  },

  SetFontSize() {
    if (Number.isNaN(Number(this.FontSize)) || parseInt(this.FontSize, 10) <= 0) {
      this.FontSize = LineSettings.DefaultFontSize;
    }
    $(this.Label).css('font-size', `${this.FontSize}px`);

    const FinialSize = $(this.Label).css('font-size');

    if (FinialSize) { this.FontSize = parseInt(FinialSize.replace(/px/, ''), 10); }
  },

  // 添加交点
  addCrossPoint(x, y, verticalLineId) {
    if (!this.crossPoints) { this.crossPoints = []; }
    this.crossPoints.push({
      x,
      y,
      verticalLineId,
    });
    this.needRedraw = true;
  },
  // 移除与目标线的所有交点
  removeCrossPointToLine(lineId) {
    if (this.crossPoints && this.crossPoints.length > 0) {
      for (let index = this.crossPoints.length - 1; index >= 0; index -= 1) {
        if (this.crossPoints[index].verticalLineId === lineId) {
          this.crossPoints.splice(index, 1);
          this.needRedraw = true;
        }
      }
    }
  },

  init(lineConfig) {
    // 线条的Id
    this.Id = lineConfig.Id;

    this.startActivity = lineConfig.startActivity;
    this.startPoint = lineConfig.startPoint;

    // 画线开始时的方向
    this.startDirection = lineConfig.startDirection;
    // 结束活动
    this.endActivity = lineConfig.endActivity;
    // 结束方向
    this.endDirection = lineConfig.endDirection;
    // 结束点
    this.endPoint = lineConfig.endPoint;

    // 设置相对于活动原点的偏移
    this.setOffsetToActivity();

    this.crossPoints = this.crossPoints || [];

    return this;
  },

  // 设置起、终点相对于所在活动的位移
  setOffsetToActivity() {
    // 相对于活动的位移百分比
    const offsetToActivity = function offsetToActivity(point, activity) {
      if (point && activity) {
        return {
          x: (point.x - activity.left) / activity.width,
          y: (point.y - activity.top) / activity.height,
        };
      }
      return null;
    };

    if (this.startPoint) {
      this.offsetToStartActivity = offsetToActivity(this.startPoint, this.startActivity);
    }
    if (this.endPoint) {
      this.offsetToEndActivity = offsetToActivity(this.endPoint, this.endActivity);
    }
  },


  // 计算交叉点，并标记需重绘的线段为needRedraw
  calculateCrossPoints() {
    const thisLine = this;
    this.crossPoints = [];

    const ArrowTailPoints = {};
    $(GlobalWorkflowProperties.Workflow.lines).each(function g() {
      this.removeCrossPointToLine(thisLine.Id);

      ArrowTailPoints[this.Id] = LineSettings.GetArrowTailPoint(this.endPoint, this.endDirection);
    });

    // 更新交叉点
    $(thisLine.Points).each((indexI) => {
      if (indexI > 0) {
        // 当前线段起、终点
        const currentSegementStartPoint = thisLine.Points[indexI - 1];
        let currentSegementEndPoint = thisLine.Points[indexI];
        // 最末点，以箭尾处进行计算
        if (indexI === thisLine.Points.length - 1) {
          currentSegementEndPoint = ArrowTailPoints[thisLine.Id];
        }

        // 计算与当前线的交叉点，重绘所有交叉线条
        $(GlobalWorkflowProperties.Workflow.lines).each(function i() {
          if (this.Id !== thisLine.Id) {
            const otherLine = this;
            $(otherLine.Points).each((indexJ) => {
              if (indexJ > 0) {
                const otherSegementStartPoint = otherLine.Points[indexJ - 1];
                let otherSegementEndPoint = otherLine.Points[indexJ];
                if (indexJ === otherLine.Points.length - 1) {
                  otherSegementEndPoint = ArrowTailPoints[otherLine.Id];
                }

                // 当前线是水平线
                if (currentSegementStartPoint.y === currentSegementEndPoint.y
                  // 其他线是竖直线
                  && otherSegementStartPoint.x === otherSegementEndPoint.x
                  && Math.min(currentSegementStartPoint.x, currentSegementEndPoint.x) +
                  LineSettings.CornerRadius + LineSettings.CrossRadius < otherSegementStartPoint.x
                  && Math.max(currentSegementStartPoint.x, currentSegementEndPoint.x) -
                  LineSettings.CornerRadius - LineSettings.CrossRadius > otherSegementStartPoint.x
                  && currentSegementStartPoint.y >
                  Math.min(otherSegementStartPoint.y, otherSegementEndPoint.y) +
                  LineSettings.CornerRadius + LineSettings.CrossRadius
                  && currentSegementStartPoint.y <
                  Math.max(otherSegementStartPoint.y, otherSegementEndPoint.y) -
                  LineSettings.CornerRadius - LineSettings.CrossRadius) {
                  thisLine.addCrossPoint(
                    otherSegementStartPoint.x,
                    currentSegementStartPoint.y,
                    otherLine.Id,
                  );
                } else if (otherSegementStartPoint.y === otherSegementEndPoint.y
                // 其他线是水平线
                  // 当前线是竖直线
                  && currentSegementStartPoint.x === currentSegementEndPoint.x
                  && Math.min(otherSegementStartPoint.x, otherSegementEndPoint.x) +
                  LineSettings.CornerRadius + LineSettings.CrossRadius <
                  currentSegementStartPoint.x
                  && Math.max(otherSegementStartPoint.x, otherSegementEndPoint.x) -
                  LineSettings.CornerRadius - LineSettings.CrossRadius >
                  currentSegementStartPoint.x
                  && otherSegementStartPoint.y >
                  Math.min(currentSegementStartPoint.y, currentSegementEndPoint.y) +
                  LineSettings.CornerRadius + LineSettings.CrossRadius
                  && otherSegementStartPoint.y <
                  Math.max(currentSegementStartPoint.y, currentSegementEndPoint.y) -
                  LineSettings.CornerRadius - LineSettings.CrossRadius) {
                  otherLine.addCrossPoint(
                    currentSegementStartPoint.x,
                    otherSegementStartPoint.y,
                    thisLine.Id,
                  );
                }
              }
            });
          }
        });
      }
    });
  },
};

export default Line;
