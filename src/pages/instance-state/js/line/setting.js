// 箭头的方向
export const LineArrowDirection = {
  // 未指定
  Unspecified: undefined,
  // 下
  Down: 1,
  // 上
  Up: -1,
  // 左
  Left: 2,
  // 右
  Right: -2,

  Opposite(_direction) {
    switch (_direction) {
      case LineArrowDirection.Up:
        return LineArrowDirection.Down;
      case LineArrowDirection.Down:
        return LineArrowDirection.Up;
      case LineArrowDirection.Left:
        return LineArrowDirection.Right;
      case LineArrowDirection.Right:
        return LineArrowDirection.Left;
      default:
        break;
    }
    return null;
  },
};

// 线条设置
export const LineSettings = {
  // Id 属性名称
  PropertyNameOfID: 'line_id',

  // 最小线段长
  MinSegementLength: 20,

  // 自由画线时停靠到起点的距离
  DockDistanceToStartPoint: 10,
  // 接近时停靠到活动的距离
  DockDistanceToEdge: 20,
  // 接近活动边的中点时自动停靠的距离
  DockDisntaceToEdgeCenter: 10,
  // 线条圆角半径
  CornerRadius: 3,
  // 交点半径
  CrossRadius: 5,
  // 线条颜色
  // LineColor: "rgb(75, 155, 237)",
  LineColor: '#cadcf6',
  // 线条宽度
  LineWidth: 1,

  // 线条聚焦颜色
  LineFocusColor: 'rgb(237, 125, 49)',
  // 线条聚焦宽度
  LineFocusWidth: 2,
  // 箭头聚焦颜色
  ArrowFocusColor: 'rgb(237, 125, 49)',

  // 线条选中颜色
  LineSelectedColor: 'rgb(237, 125, 49)',
  // 箭头选中颜色
  ArrowSelectedColor: 'rgb(237, 125, 49)',

  // 箭头长
  ArrowLength: 8,
  // 箭头宽
  ArrowWidth: 4,
  // 箭头填充色
  // ArrowFillColor: "rgb(75, 155, 237)",
  ArrowFillColor: '#cadcf6',

  // .线条调整事件的命名空间
  LineHandleEventNamespace: '.linehandle',
  // .线条文字移动事件的命名空间
  LineLabelEventNamespace: '.line_label',
  // 线条Id属性名称
  Label_LineIDPropertyName: 'Line-Id',

  // 寻找最近活动时，垂直距离的权重加成
  VerticalPerceage: 1.1,

  // 默认文字颜色
  DefaultFontColor: '#77bcfa',
  // 默认文字大小
  DefaultFontSize: 11,

  // 重计算箭尾点
  GetArrowTailPoint(_EndPoint, _EndDirection) {
    const ArrowTailPoint = {
      x: _EndPoint.x,
      y: _EndPoint.y,
    };
    // 折线的终点(箭尾中点)
    switch (_EndDirection) {
      case LineArrowDirection.Up:
        ArrowTailPoint.y -= LineSettings.ArrowLength;
        break;
      case LineArrowDirection.Down:
        ArrowTailPoint.y += LineSettings.ArrowLength;
        break;
      case LineArrowDirection.Left:
        ArrowTailPoint.x -= LineSettings.ArrowLength;
        break;
      case LineArrowDirection.Right:
        ArrowTailPoint.x += LineSettings.ArrowLength;
        break;
      default:
        break;
    }
    return ArrowTailPoint;
  },

  // 根据起始点,计算所有点
  // Return:点集合
  RecalculatePoints(_StartDirection, _EndDirection, _StartPoint, _EndPoint) {
    const originX = _StartPoint.x;
    const originY = _StartPoint.y;
    const targetX = _EndPoint.x;
    const targetY = _EndPoint.y;

    const Points = [{
      x: _StartPoint.x,
      y: _StartPoint.y,
    }];
    if (originX === targetX && originY === targetY && _StartDirection === _EndDirection) {
      switch (_StartDirection) {
        case LineArrowDirection.Left:
          Points.push({
            x: _StartPoint.x - 20,
            y: _StartPoint.y,
          });
          break;
        case LineArrowDirection.Right:
          Points.push({
            x: _StartPoint.x + 20,
            y: _StartPoint.y,
          });
          break;
        case LineArrowDirection.Up:
          Points.push({
            x: _StartPoint.x,
            y: _StartPoint.y - 20,
          });
          break;
        case LineArrowDirection.Down:
          Points.push({
            x: _StartPoint.x,
            y: _StartPoint.y + 20,
          });
          break;
        default:
          break;
      }
      Points.push({
        x: _EndPoint.x,
        y: _EndPoint.y,
      });
      return Points;
    }

    switch (_StartDirection) {
      case LineArrowDirection.Up:
      {
        switch (_EndDirection) {
          case LineArrowDirection.Left:
            // 第一象限
            if (targetY < originY && targetX > originX) {
              Points.push({ x: originX, y: targetY });
            } else if (targetY < originY && targetX <= originX) {
            // 第二象限
              Points.push({ x: originX, y: (originY / 2) + (targetY / 2) });
              Points.push({
                x: targetX - LineSettings.MinSegementLength,
                y: (originY / 2) + (targetY / 2),
              });
              Points.push({ x: targetX - LineSettings.MinSegementLength, y: targetY });
            } else if (targetY >= originY && targetX <= originX) {
            // 第三象限
              Points.push({ x: originX, y: (originY - LineSettings.MinSegementLength) });
              Points.push({
                x: (targetX - LineSettings.MinSegementLength),
                y: (originY - LineSettings.MinSegementLength),
              });
              Points.push({ x: (targetX - LineSettings.MinSegementLength), y: targetY });
            } else {
            // 第四象限
              Points.push({ x: originX, y: (originY - LineSettings.MinSegementLength) });
              Points.push({
                x: ((originX / 2) + (targetX / 2)),
                y: (originY - LineSettings.MinSegementLength),
              });
              Points.push({ x: ((originX / 2) + (targetX / 2)), y: targetY });
            }
            break;
          case LineArrowDirection.Down:
            // 第一二象限
            if (targetY < originY - LineSettings.MinSegementLength) {
              Points.push({ x: originX, y: ((originY / 2) + (targetY / 2)) });
              Points.push({ x: targetX, y: ((originY / 2) + (targetY / 2)) });
            } else if (targetX === originX && targetY < originY) {
            // 直线
            } else {
            // 第三四象限
              Points.push({ x: originX, y: (originY - LineSettings.MinSegementLength) });
              Points.push({
                x: ((originX / 2) + (targetX / 2)),
                y: (originY - LineSettings.MinSegementLength),
              });
              Points.push({
                x: ((originX / 2) + (targetX / 2)),
                y: (targetY + LineSettings.MinSegementLength),
              });
              Points.push({ x: targetX, y: (targetY + LineSettings.MinSegementLength) });
            }
            break;
          case LineArrowDirection.Right:
            // 第一象限
            if (targetY < originY && targetX > originX) {
              Points.push({ x: originX, y: ((originY / 2) + (targetY / 2)) });
              Points.push({
                x: (targetX + LineSettings.MinSegementLength),
                y: ((originY / 2) + (targetY / 2)),
              });
              Points.push({ x: (targetX + LineSettings.MinSegementLength), y: targetY });
            } else if (targetY < originY && targetX <= originX) {
            // 第二象限
              Points.push({ x: originX, y: targetY });
            } else if (targetY >= originY && targetX <= originX) {
            // 第三象限
              Points.push({ x: originX, y: (originY - LineSettings.MinSegementLength) });
              Points.push({
                x: ((originX / 2) + (targetX / 2)),
                y: (originY - LineSettings.MinSegementLength),
              });
              Points.push({ x: ((originX / 2) + (targetX / 2)), y: targetY });
            } else {
            // 第四象限
              Points.push({ x: originX, y: (originY - LineSettings.MinSegementLength) });
              Points.push({
                x: (targetX + LineSettings.MinSegementLength),
                y: (originY - LineSettings.MinSegementLength),
              });
              Points.push({ x: (targetX + LineSettings.MinSegementLength), y: targetY });
              Points.push({ x: (targetX + LineSettings.ArrowLength), y: targetY });
            }
            break;
          case LineArrowDirection.Up:
            // 第一二象限
            if (targetY < originY) {
              Points.push({ x: originX, y: (targetY - LineSettings.MinSegementLength) });
              Points.push({ x: (targetX), y: (targetY - LineSettings.MinSegementLength) });
            } else {
            // 第三/四象限
              Points.push({ x: originX, y: (originY - LineSettings.MinSegementLength) });
              Points.push({ x: targetX, y: (originY - LineSettings.MinSegementLength) });
            }
            break;
          default:
            break;
        }
        break;
      }
      case LineArrowDirection.Down:
        switch (_EndDirection) {
          case LineArrowDirection.Left:
            // 第二象限
            if (targetX < originX && targetY < originY) {
              Points.push({ x: originX, y: (originY + LineSettings.MinSegementLength) });
              Points.push({
                x: (targetX - LineSettings.MinSegementLength),
                y: (originY + LineSettings.MinSegementLength),
              });
              Points.push({ x: (targetX - LineSettings.MinSegementLength), y: targetY });
            } else if (targetX < originX && targetY > originY) {
            // 第三象限
              Points.push({ x: originX, y: ((originY / 2) + (targetY / 2)) });
              Points.push({
                x: (targetX - LineSettings.MinSegementLength),
                y: ((originY / 2) + (targetY / 2)),
              });
              Points.push({ x: (targetX - LineSettings.MinSegementLength), y: targetY });
            } else if (targetX >= originX && targetY <= originY) {
            // 第一象限
              Points.push({ x: originX, y: (originY + LineSettings.MinSegementLength) });
              Points.push({
                x: ((originX / 2) + (targetX / 2)),
                y: (originY + LineSettings.MinSegementLength),
              });
              Points.push({ x: ((originX / 2) + (targetX / 2)), y: targetY });
            } else {
            // 第四象限
              Points.push({ x: originX, y: targetY });
            }
            break;
          case LineArrowDirection.Down:
            // 第一二象限
            if (targetY < originY) {
              Points.push({ x: originX, y: (originY + LineSettings.MinSegementLength) });
              Points.push({ x: targetX, y: (originY + LineSettings.MinSegementLength) });
            } else {
            // 第三四象限
              Points.push({ x: originX, y: (targetY + LineSettings.MinSegementLength) });
              Points.push({ x: targetX, y: (targetY + LineSettings.MinSegementLength) });
            }
            break;
          case LineArrowDirection.Right:
            // 第二象限
            if (targetX < originX && targetY < originY) {
              Points.push({ x: originX, y: (originY + LineSettings.MinSegementLength) });
              Points.push({
                x: ((originX / 2) + (targetX / 2)),
                y: (originY + LineSettings.MinSegementLength),
              });
              Points.push({ x: ((originX / 2) + (targetX / 2)), y: targetY });
            } else if (targetX < originX && targetY > originY) {
            // 第三象限
              Points.push({ x: originX, y: targetY });
            } else if (targetX >= originX && targetY <= originY) {
            // 第一象限
              Points.push({ x: originX, y: (originY + LineSettings.MinSegementLength) });
              Points.push({
                x: (targetX + LineSettings.MinSegementLength),
                y: (originY + LineSettings.MinSegementLength),
              });
              Points.push({ x: (targetX + LineSettings.MinSegementLength), y: targetY });
            } else {
            // 第四象限
              Points.push({ x: originX, y: ((originY / 2) + (targetY / 2)) });
              Points.push({
                x: (targetX + LineSettings.MinSegementLength),
                y: ((originY / 2) + (targetY / 2)),
              });
              Points.push({ x: (targetX + LineSettings.MinSegementLength), y: targetY });
            }
            break;
          case LineArrowDirection.Up:
            // 第一二象限
            if (targetY - LineSettings.MinSegementLength < originY) {
              Points.push({ x: originX, y: (originY + LineSettings.MinSegementLength) });
              Points.push({
                x: ((originX / 2) + (targetX / 2)),
                y: (originY + LineSettings.MinSegementLength),
              });
              Points.push({
                x: ((originX / 2) + (targetX / 2)),
                y: (targetY - LineSettings.MinSegementLength),
              });
              Points.push({ x: targetX, y: (targetY - LineSettings.MinSegementLength) });
            } else if (targetX === originX && targetY > originY) {
            // 直线
            } else {
            // 第三四象限
              Points.push({ x: originX, y: ((originY / 2) + (targetY / 2)) });
              Points.push({ x: targetX, y: ((originY / 2) + (targetY / 2)) });
            }
            break;
          default:
            break;
        }
        break;
      case LineArrowDirection.Left:
        switch (_EndDirection) {
          case LineArrowDirection.Left:
            // 第二三象限
            if (targetX < originX) {
              Points.push({ x: (targetX - LineSettings.MinSegementLength), y: originY });
              Points.push({ x: (targetX - LineSettings.MinSegementLength), y: targetY });
            } else {
            // 第一四象限
              Points.push({ x: (originX - LineSettings.MinSegementLength), y: originY });
              Points.push({ x: (originX - LineSettings.MinSegementLength), y: targetY });
            }
            break;
          case LineArrowDirection.Down:
            // 第二象限
            if (targetX < originX && targetY < originY) {
              Points.push({ x: targetX, y: originY });
            } else if (targetX < originX && targetY >= originY) {
            // 第三象限
              Points.push({ x: ((originX / 2) + (targetX / 2)), y: originY });
              Points.push({
                x: ((originX / 2) + (targetX / 2)),
                y: (targetY + LineSettings.MinSegementLength),
              });
              Points.push({ x: targetX, y: (targetY + LineSettings.MinSegementLength) });
            } else if (targetX >= originX && targetY <= originY) {
            // 第一象限
              Points.push({ x: (originX - LineSettings.MinSegementLength), y: originY });
              Points.push({
                x: (originX - LineSettings.MinSegementLength),
                y: ((originY / 2) + (targetY / 2)),
              });
              Points.push({ x: targetX, y: ((originY / 2) + (targetY / 2)) });
            } else {
            // 第四象限
              Points.push({ x: (originX - LineSettings.MinSegementLength), y: originY });
              Points.push({
                x: (originX - LineSettings.MinSegementLength),
                y: (targetY + LineSettings.MinSegementLength),
              });
              Points.push({ x: targetX, y: (targetY + LineSettings.MinSegementLength) });
            }
            break;
          case LineArrowDirection.Right:
            // 第二三象限
            if (targetX < originX - LineSettings.MinSegementLength) {
              Points.push({ x: ((originX / 2) + (targetX / 2)), y: originY });
              Points.push({ x: ((originX / 2) + (targetX / 2)), y: targetY });
            } else if (targetX < originX && targetY === originY) {
            // 直线
            } else {
            // 第一四象限
              Points.push({ x: (originX - LineSettings.MinSegementLength), y: originY });
              Points.push({
                x: (originX - LineSettings.MinSegementLength),
                y: ((originY / 2) + (targetY / 2)),
              });
              Points.push({
                x: (targetX + LineSettings.MinSegementLength),
                y: ((originY / 2) + (targetY / 2)),
              });
              Points.push({ x: (targetX + LineSettings.MinSegementLength), y: targetY });
            }
            break;
          case LineArrowDirection.Up:
            // 第一象限
            if (targetX > originX && targetY < originY) {
              Points.push({ x: (originX - LineSettings.MinSegementLength), y: originY });
              Points.push({
                x: (originX - LineSettings.MinSegementLength),
                y: (targetY - LineSettings.MinSegementLength),
              });
              Points.push({ x: targetX, y: (targetY - LineSettings.MinSegementLength) });
            } else if (targetX <= originX && targetY <= originY) {
            // 第二象限
              Points.push({ x: ((originX / 2) + (targetX / 2)), y: originY });
              Points.push({
                x: ((originX / 2) + (targetX / 2)),
                y: (targetY - LineSettings.MinSegementLength),
              });
              Points.push({ x: targetX, y: (targetY - LineSettings.MinSegementLength) });
            } else if (targetX < originX && targetY > originY) {
            // 第三象限
              Points.push({ x: targetX, y: originY });
            } else {
            // 第四象限
              Points.push({ x: (originX - LineSettings.MinSegementLength), y: originY });
              Points.push({
                x: (originX - LineSettings.MinSegementLength),
                y: ((originY / 2) + (targetY / 2)),
              });
              Points.push({ x: targetX, y: ((originY / 2) + (targetY / 2)) });
            }
            break;
          default:
            break;
        }
        break;
      case LineArrowDirection.Right:
        switch (_EndDirection) {
          case LineArrowDirection.Left:
            // 第二三象限
            if (targetX - LineSettings.MinSegementLength < originX) {
              Points.push({ x: (originX + LineSettings.MinSegementLength), y: originY });
              Points.push({
                x: (originX + LineSettings.MinSegementLength),
                y: ((originY / 2) + (targetY / 2)),
              });
              Points.push({
                x: (targetX - LineSettings.MinSegementLength),
                y: ((originY / 2) + (targetY / 2)),
              });
              Points.push({ x: (targetX - LineSettings.MinSegementLength), y: targetY });
            } else if (targetX > originX && targetY === originY) {
            // 直线
            } else {
            // 第一四象限
              Points.push({ x: ((originX / 2) + (targetX / 2)), y: originY });
              Points.push({ x: ((originX / 2) + (targetX / 2)), y: targetY });
            }
            break;
          case LineArrowDirection.Down:
            // 第二象限
            if (targetX < originX && targetY < originY) {
              Points.push({ x: (originX + LineSettings.MinSegementLength), y: originY });
              Points.push({
                x: (originX + LineSettings.MinSegementLength),
                y: ((originY / 2) + (targetY / 2)),
              });
              Points.push({ x: targetX, y: ((originY / 2) + (targetY / 2)) });
            } else if (targetX < originX && targetY >= originY) {
            // 第三象限
              Points.push({ x: (originX + LineSettings.MinSegementLength), y: originY });
              Points.push({
                x: (originX + LineSettings.MinSegementLength),
                y: (targetY + LineSettings.MinSegementLength),
              });
              Points.push({ x: targetX, y: (targetY + LineSettings.MinSegementLength) });
            } else if (targetX >= originX && targetY <= originY) {
            // 第一象限
              Points.push({ x: targetX, y: originY });
            } else {
            // 第四象限
              Points.push({ x: ((originX / 2) + (targetX / 2)), y: originY });
              Points.push({
                x: ((originX / 2) + (targetX / 2)),
                y: (targetY + LineSettings.MinSegementLength),
              });
              Points.push({ x: targetX, y: (targetY + LineSettings.MinSegementLength) });
            }
            break;
          case LineArrowDirection.Right:
            // 第二三象限
            if (targetX < originX) {
              Points.push({ x: (originX + LineSettings.MinSegementLength), y: originY });
              Points.push({ x: (originX + LineSettings.MinSegementLength), y: targetY });
            } else {
            // 第一四象限
              Points.push({ x: (targetX + LineSettings.MinSegementLength), y: originY });
              Points.push({ x: ((targetX + LineSettings.MinSegementLength)), y: targetY });
            }
            break;
          case LineArrowDirection.Up:
            // 第一象限
            if (targetX > originX && targetY < originY) {
              Points.push({ x: ((originX / 2) + (targetX / 2)), y: originY });
              Points.push({
                x: ((originX / 2) + (targetX / 2)),
                y: (targetY - LineSettings.MinSegementLength),
              });
              Points.push({ x: targetX, y: (targetY - LineSettings.MinSegementLength) });
            } else if (targetX <= originX && targetY <= originY) {
            // 第二象限
              Points.push({ x: (originX + LineSettings.MinSegementLength), y: originY });
              Points.push({
                x: (originX + LineSettings.MinSegementLength),
                y: (targetY - LineSettings.MinSegementLength),
              });
              Points.push({ x: targetX, y: (targetY - LineSettings.MinSegementLength) });
            } else if (targetX < originX && targetY > originY) {
            // 第三象限
              Points.push({ x: (originX + LineSettings.MinSegementLength), y: originY });
              Points.push({
                x: (originX + LineSettings.MinSegementLength),
                y: ((originY / 2) + (targetY / 2)),
              });
              Points.push({ x: targetX, y: ((originY / 2) + (targetY / 2)) });
            } else {
            // 第四象限
              Points.push({ x: targetX, y: originY });
            }
            break;
          default:
            break;
        }
        break;


      default:
        break;
    }
    Points.push({
      x: targetX,
      y: targetY,
    });

    // 合并在一条直线上的线段
    for (let i = Points.length - 1; i >= 2; i -= 1) {
      if ((Points[i].x === Points[i - 1].x && Points[i - 1].x === Points[i - 2].x)
        || (Points[i].y === Points[i - 1].y && Points[i - 1].y === Points[i - 2].y)) {
        Points.splice(i - 1, 1);
      }
    }
    return Points;
  },
};

// 线条的样式名称
export const LineStyleClassName = {
  // 控制点样式
  LineHandler: 'line_handler',
  // 起点控制样式
  StartPointHandler: 'line_handler_start_point',
  // 终点控制样式
  EndPointHandler: 'line_handler_end_point',
  // 水平线段控制样式
  HorizontalSegementHandler: 'line_handler_line_horizontal',
  // 竖直线段控制样式
  VerticalSegementHandler: 'line_handler_line_vertical',

  // 标题
  Label: 'line_label_div',
  // 标题移动样式
  LabelMoving: 'line-label-moving',
};

// 线条绘制栈
export const LineDrawStack = {
  // 当前调整的线条
  CurrentLine: undefined,
  // 当前控制点
  CurrentHandler: undefined,
  // 正在绘制
  IsDrawing: false,
  // 线条的画布原点
  OriginOffset: {
    x: 0,
    y: 0,
  },
};

// 线条调整栈
export const LineResizeStack = {
  // 当前调整的线条
  CurrentLine: undefined,
  // 当前控制点
  CurrentHandler: undefined,
  // 正在绘制
  IsDrawing: false,
  // 线条的画布原点
  OriginOffset: {
    x: 0,
    y: 0,
  },
  // 调整前的状态
  SourceState: undefined,
};

