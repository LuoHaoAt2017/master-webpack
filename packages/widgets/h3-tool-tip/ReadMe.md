---
category: Components
type: Data Display
title: Icon
subtitle: tool-tip气泡提示框
---



## 如何使用 

```html
<h3-tool-tip content='这里是内容' showTip='true' :extraBtn='array' direction="center-top"></h3-tool-tip>
```
其中extraBtn绑定的数组所需字段如下：
```
array: [
  {
    name: '管理',
    action: this.onClickExtra,
    cutline: true,
  }, {
    name: '删除',
    action: this.onClickExtra,
    cutline: false,  // 是否有分割线 |
  },
]
```





## API

适用平台：WEB

| 属性        | 说明           | 类型            | 默认值       |
|------------|----------------|----------------|--------------|
| content    |   提示框内容 | String   |
| showTip    |   是否显示    | boolean  | true |
| hasClose    |   是否显示    | boolean  | true |
| direction    |   箭头方向    | 'left', 'right', 'left-top', 'left-bottm', 'right-top', 'right-bottm', 'center-top', 'center-bottm'  | 'left-top' |
| extraBtn   | 右部按钮  | Array |  |
| className   | 自定义css类名  | String | - |
| h3style   | 自定义Style  | Object | - |


监听事件
showReportTooltip 点击 X 隐藏tool-tip时触发
